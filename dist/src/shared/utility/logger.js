"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVEL = void 0;
var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["TRACE"] = 0] = "TRACE";
    LOG_LEVEL[LOG_LEVEL["DEBUG"] = 1] = "DEBUG";
    LOG_LEVEL[LOG_LEVEL["INFO"] = 2] = "INFO";
    LOG_LEVEL[LOG_LEVEL["WARN"] = 3] = "WARN";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 4] = "ERROR";
})(LOG_LEVEL = exports.LOG_LEVEL || (exports.LOG_LEVEL = {}));
const log = (message, className, logLevel) => {
    const output = `${className || "LOGGER"}.${LOG_LEVEL[logLevel] || "ANY"} [${new Date().toLocaleTimeString()}]: ${message}`;
    console.log(output);
};
exports.default = log;
//# sourceMappingURL=logger.js.map