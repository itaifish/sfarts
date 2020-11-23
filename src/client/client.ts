import socketio from "socket.io-client";
import MessageEnum from "../shared/communication/messageEnum";
import Constants from "../shared/config/constants";
import {
    LoginMessageRequest,
    LoginMessageResponse,
    LoginMessageResponseType,
} from "../shared/communication/messageInterfaces/loginMessage";
import LobbySettings from "../server/room/lobby/lobbySettings";
import {
    ClientLobby,
    CreateLobbyRequest,
    GetLobbiesResponse,
    JoinLobbyRequest,
} from "../shared/communication/messageInterfaces/lobbyMessage";
import log, { LOG_LEVEL } from "../shared/utility/logger";
import GameManager from "../shared/game/manager/gameManager";
import { EndTurnRequest, GameStateResponse } from "../shared/communication/messageInterfaces/endTurnMessage";
import GameUnit from "../shared/game/units/gameUnit";
import InputMessageRequest, { ACTION_TYPE } from "../shared/communication/messageInterfaces/inputMessage";
import MoveAction from "../shared/game/move/moveAction";
import SpecialAction from "../shared/game/move/specialAction";
import GameOverMessage from "../shared/communication/messageInterfaces/gameOverMessage";
import Process from "../../process.json";
import constants from "../shared/config/constants";

type callbackFunction = (...args: any[]) => void;

export default class Client {
    loginStatus: LoginMessageResponseType | null;

    userId: number;

    gameOverWinner: string;

    lobbyList: ClientLobby[];

    socket: SocketIOClient.Socket;

    messageCallbacks: {
        [key in MessageEnum]: callbackFunction[];
    };

    gameManager: GameManager;

    updateBoardStateCallback: (boardState: GameUnit[][]) => void;

    constructor() {
        this.gameManager = null;
        this.loginStatus = null;
        this.userId = null;
        this.gameOverWinner = null;
        this.lobbyList = [];
        const url = Process?.PROD ? constants.HOSTED_URL : constants.URL;
        this.socket = socketio(url);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.messageCallbacks = {};
        for (const key in MessageEnum) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.messageCallbacks[MessageEnum[key]] = [];
        }
        this.updateBoardStateCallback = (boardState) => {
            log("This function should absolutely never be called", this.constructor.name, LOG_LEVEL.WARN);
        };
    }

    listen(): void {
        this.socket.on(MessageEnum.CONNECT, () => {
            log(`Socket has connected (${this.socket.connected})`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.CONNECT);
        });
        this.socket.on(MessageEnum.DISCONNECT, () => {
            this.loginStatus = null;
            log(`Socket has disconnected (${this.socket.connected})`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.DISCONNECT);
        });
        this.socket.on(MessageEnum.LOGIN, (msg: LoginMessageResponse) => {
            log(
                `Your login status is now: ${LoginMessageResponseType[msg.status]}`,
                this.constructor.name,
                LOG_LEVEL.INFO,
            );
            this.loginStatus = msg.status;
            this.userId = msg.id;
            if (msg.gameStateToRejoin) {
                this.gameManager = new GameManager(msg.gameStateToRejoin.gameId, this.userId, []);
                this.gameManager.copyBoardState(msg.gameStateToRejoin.gameState);
            }
            this.runAndRemoveCallbacks(MessageEnum.LOGIN);
        });
        this.socket.on(MessageEnum.CREATE_ACCOUNT, (msg: LoginMessageResponse) => {
            this.loginStatus = msg.status;
            this.runAndRemoveCallbacks(MessageEnum.CREATE_ACCOUNT);
        });
        this.socket.on(MessageEnum.GET_LOBBIES, (response: GetLobbiesResponse) => {
            log(`Got this response: ${JSON.stringify(response)}`, this.constructor.name, LOG_LEVEL.DEBUG);
            this.lobbyList = response.lobbies;
            log(`Got ${this.lobbyList.length} lobbies`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.GET_LOBBIES);
        });
        this.socket.on(MessageEnum.END_TURN_SIGNAL, (response: GameStateResponse) => {
            this.gameManager.endTurn();
            this.gameManager.copyBoardState(response.gameState);
            this.updateBoardStateCallback(this.gameManager.boardState);
            this.runAndRemoveCallbacks(MessageEnum.END_TURN_SIGNAL);
        });
        this.socket.on(MessageEnum.START_GAME, (response: GameStateResponse) => {
            log(`Starting game: ${response.gameId}`, this.constructor.name, LOG_LEVEL.INFO);
            this.gameManager = new GameManager(response.gameId, this.userId, []);
            this.gameManager.copyBoardState(response.gameState);
            this.runAndRemoveCallbacks(MessageEnum.START_GAME);
        });
        this.socket.on(MessageEnum.RESET_PLAYER_MOVES, (response: GameStateResponse) => {
            this.gameManager.copyBoardState(response.gameState);
            this.updateBoardStateCallback(this.gameManager.boardState);
            this.runAndRemoveCallbacks(MessageEnum.RESET_PLAYER_MOVES);
        });
        this.socket.on(MessageEnum.GAME_HAS_ENDED, (response: GameOverMessage) => {
            this.gameOverWinner = response.winner;
            this.gameManager = null;
            this.runAndRemoveCallbacks(MessageEnum.GAME_HAS_ENDED);
        });
    }

    /** Server Communication **/

    createAccount(username: string, password: string, callbackFunc?: callbackFunction): void {
        const loginData: LoginMessageRequest = {
            username: username,
            password: password,
        };
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.CREATE_ACCOUNT, callbackFunc);
        }
        this.socket.emit(MessageEnum.CREATE_ACCOUNT, loginData);
    }

    sendLoginAttempt(username: string, password: string): void {
        const loginData: LoginMessageRequest = {
            username: username,
            password: password,
        };
        this.socket.emit(MessageEnum.LOGIN, loginData);
    }

    createLobby(settings: LobbySettings) {
        const createLobbyRequest: CreateLobbyRequest = {
            lobbySettings: settings,
        };
        this.socket.emit(MessageEnum.CREATE_LOBBY, createLobbyRequest);
    }

    joinLobby(lobbyId: string, teamId: number, callbackFunc?: callbackFunction) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, callbackFunc);
        }
        const joinLobbyRequest: JoinLobbyRequest = {
            lobbyId: lobbyId,
            teamId: teamId,
        };
        this.socket.emit(MessageEnum.JOIN_LOBBY, joinLobbyRequest);
    }

    leaveLobby(lobbyId: string, callbackFunc?: callbackFunction) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, callbackFunc);
        }
        // join a non-existant team in lobby to leave
        const joinLobbyRequest: JoinLobbyRequest = {
            lobbyId: lobbyId,
            teamId: -1,
        };
        this.socket.emit(MessageEnum.JOIN_LOBBY, joinLobbyRequest);
    }

    loadLobbyList(callbackFunc?: callbackFunction): void {
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, callbackFunc);
        }
        this.socket.emit(MessageEnum.GET_LOBBIES);
    }

    startGame(callbackFunc?: callbackFunction): void {
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.START_GAME, callbackFunc);
        }
        this.socket.emit(MessageEnum.START_GAME);
    }

    sendMove(move: MoveAction): void {
        const request: InputMessageRequest = {
            actionType: ACTION_TYPE.MOVE,
            action: move,
        };
        this.socket.emit(MessageEnum.PLAYER_INPUT, request);
    }

    sendSpecial(special: SpecialAction): void {
        const request: InputMessageRequest = {
            actionType: ACTION_TYPE.SPECIAL,
            action: special,
        };
        this.socket.emit(MessageEnum.PLAYER_INPUT, request);
    }

    setEndTurn(endTurn: boolean): void {
        const request: EndTurnRequest = {
            playerHasEndedTurn: endTurn,
        };
        this.socket.emit(MessageEnum.END_TURN_SIGNAL, request);
    }

    resetMoves(): void {
        this.socket.emit(MessageEnum.RESET_PLAYER_MOVES);
    }

    concede(): void {
        this.socket.emit(MessageEnum.CONCEDE);
    }

    getTimeRemaining(processRemainingTimeFunction: (remainingTime: number) => void) {
        // add callback for time remaining to call function
        // send request
    }

    /**************************/

    addOnServerMessageCallback(serverMessage: MessageEnum, callbackFunc: callbackFunction): void {
        this.messageCallbacks[serverMessage].push(callbackFunc);
    }

    private runAndRemoveCallbacks(serverMessage: MessageEnum): void {
        this.messageCallbacks[serverMessage].forEach((callback) => callback());
        this.messageCallbacks[serverMessage] = [];
    }
}
