export interface LoginMessageRequest {
    username: string;
    password: string;
}

export enum LoginMessageResponseType {
    SUCCESS,
    USER_NOT_EXIST,
    PASSWORD_INCORRECT,
}

export interface LoginMessageResponse {
    status: LoginMessageResponseType;
}
