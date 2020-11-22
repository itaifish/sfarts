import Location from "../game/location";

const locationToString = (location: Location): string => {
    return `${location.x}, ${location.y}`;
};

export default locationToString;
