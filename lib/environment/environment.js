"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const logger_1 = require("./logger");
const server_1 = require("./server");
const emailer_1 = require("./emailer");
const fs = require("fs");
/**
 * The environment class controls all aspects of the antfarm environment, like options, logging,
 * and constructing globally referenced objects.
 */
class Environment {
    constructor(options) {
        this.hookRoutes = [];
        this.hookInterfaceRoutes = [];
        this.logger = new logger_1.Logger(options);
        this.options = options;
    }
    /**
     * Sets the options and creates other environmental objects if necessary.
     * @param options
     */
    set options(options) {
        let e = this;
        if (options.auto_managed_folder_directory) {
            try {
                fs.statSync(options.auto_managed_folder_directory);
            }
            catch (err) {
                e.log(3, `Auto managed directory "${options.auto_managed_folder_directory}" does not exist.`, this);
            }
        }
        this._options = options;
        if (options.port) {
            e.createServer();
            e.server.createLogServer(e.logger);
        }
        if (options.email_credentials) {
            e.createEmailer();
        }
    }
    /**
     * Get the Antfarm options.
     * @returns {AntfarmOptions}
     */
    get options() {
        return this._options;
    }
    /**
     * Creates an Emailer object to send emails.
     */
    createEmailer() {
        let e = this;
        // Get options needed and pass to emailer
        let credentials = e.options.email_credentials;
        e._emailer = new emailer_1.Emailer(e, credentials);
    }
    get emailer() {
        return this._emailer;
    }
    /**
     * Return the auto managed folder directory, if set.
     * @returns {string}
     */
    get autoManagedFolderDirectory() {
        return this.options.auto_managed_folder_directory;
    }
    /**
     * Creates the server.
     */
    createServer() {
        this._server = new server_1.Server(this);
    }
    /**
     * Get the server instance.
     * @returns {Server}
     */
    get server() {
        return this._server;
    }
    /**
     * Adds a webhook to the webhook server.
     * @param nest
     */
    addWebhook(nest) {
        let e = this;
        e.server.addWebhook(nest);
    }
    /**
     * Adds a webhook interface to the webhook server.
     * @param im
     */
    addWebhookInterface(im) {
        let e = this;
        e.server.addWebhookInterface(im);
    }
    toString() {
        return "Environment";
    }
    /**
     * Adds a log entry to the Logger instance.
     * @param type {number}          The log level. 0 = debug, 1 = info, 2 = warning, 3 = error
     * @param message {string}       Log message.
     * @param actor  {any}           Instance which triggers the action being logged.
     * @param instances {any[]}      Array of of other involved instances.
     * #### Example
     * ```js
     * job.e.log(1, `Transferred to Tunnel "${tunnel.getName()}".`, job, [oldTunnel]);
     * ```
     */
    log(type, message, actor, instances = []) {
        this.logger.log(type, message, actor, instances);
    }
}
exports.Environment = Environment;
//# sourceMappingURL=environment.js.map