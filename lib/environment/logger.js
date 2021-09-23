"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs = require("fs"), winston = require("winston"), _ = require("lodash");
/**
 * Logging service
 */
class Logger {
    constructor(options) {
        /**
         * Valid log times
         * @type {{0: string; 1: string; 2: string; 3: string}}
         */
        this.log_types = {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
        };
        winston.emitErrs = true;
        this.options = options;
        this.createLogger();
    }
    /**
     * Console formatting function.
     * @param options
     * @returns {string}
     */
    consoleFormatter(options) {
        let kvString = "";
        _.forEach(options.meta, (key, value) => {
            kvString += " " +
                winston.config.colorize("silly", `${value}`) +
                winston.config.colorize("debug", " > ") +
                key;
        });
        let formattedDate = new Date().toLocaleString();
        return winston.config.colorize(options.level, formattedDate) + " " +
            winston.config.colorize(options.level, _.padEnd(options.level, 6)) +
            options.message + " " +
            kvString;
    }
    ;
    /**
     * Initialize logger
     */
    createLogger() {
        let lg = this;
        if (lg.options && lg.options.log_dir) {
            // Create the log directory if it does not exist
            if (!fs.existsSync(lg.options.log_dir)) {
                fs.mkdirSync(lg.options.log_dir);
            }
            lg.logger = new winston.Logger({
                transports: [
                    new winston.transports.File({
                        level: lg.options.log_file_level || "info",
                        filename: `${lg.options.log_dir}/antfarm.log`,
                        handleExceptions: true,
                        json: true,
                        maxsize: lg.options.log_max_size || 5242880,
                        maxFiles: lg.options.log_max_files || 5,
                        colorize: false
                    }),
                    new winston.transports.Console({
                        level: lg.options.log_out_level || "info",
                        handleExceptions: true,
                        prettyPrint: true,
                        colorize: true,
                        silent: false,
                        timestamp: () => {
                            return Date();
                        },
                        formatter: (options) => { return lg.consoleFormatter(options); }
                    })
                ],
                exitOnError: false
            });
        }
        else {
            lg.logger = new winston.Logger({
                transports: [
                    new winston.transports.Console({
                        level: lg.options.log_out_level || "info",
                        handleExceptions: true,
                        prettyPrint: true,
                        colorize: true,
                        silent: false,
                        timestamp: () => {
                            return Date();
                        },
                        formatter: (options) => { return lg.consoleFormatter(options); }
                    })
                ],
                exitOnError: false
            });
        }
    }
    /**
     * Generates a formatted logging entry.
     * @param entry
     * @param actor
     * @param instances
     * @returns {Object}
     */
    getEntry(entry, actor, instances = []) {
        instances.push(actor);
        if (instances) {
            instances.forEach((instance) => {
                if (instance && typeof instance !== "undefined") {
                    let super_name = instance.toString();
                    try {
                        entry[super_name] = instance.name;
                        if (super_name === "Job")
                            entry["JobId"] = instance.getId();
                    }
                    catch (e) {
                    }
                }
            });
        }
        return entry;
    }
    /**
     * Create a log entry. Used for log _files and console reporting.
     * @param type
     * @param message
     * @param actor
     * @param instances
     */
    log(type, message, actor, instances) {
        if (typeof (this.log_types[type]) === "undefined") {
            type = 0;
        }
        let log_types = this.log_types;
        let entry = {
            message: message,
            actor: actor.constructor.name
        };
        let modified_entry = this.getEntry(entry, actor, instances);
        this.logger.log(log_types[type], modified_entry);
    }
    query(options, callback) {
        let l = this;
        l.logger.query(options, (err, results) => {
            if (err) {
                l.log(3, `Log query error: ${err}.`, l);
            }
            callback(results);
        });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map