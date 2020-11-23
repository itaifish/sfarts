export enum LOG_LEVEL {
    "TRACE",
    "DEBUG",
    "INFO",
    "WARN",
    "ERROR",
}

const log = (message: string, className?: string, logLevel?: LOG_LEVEL): void => {
    const output = `${className || "LOGGER"}.${
        LOG_LEVEL[logLevel] || "ANY"
    } [${new Date().toLocaleTimeString()}]: ${message}`;
    console.log(output);
};

export default log;
