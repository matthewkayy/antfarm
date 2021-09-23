"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookNest = void 0;
const nest_1 = require("./nest");
const interfaceManager_1 = require("../ui/interfaceManager");
const http = require("http");
class WebhookNest extends nest_1.Nest {
    /**
     * Webhook Nest constructor
     * @param e
     * @param path
     * @param httpMethod
     * @param handleRequest     Custom request handler function.
     */
    constructor(e, path, httpMethod, handleRequest) {
        super(e, path.toString());
        let wh = this;
        wh.path = path;
        wh.httpMethod = httpMethod;
        if (handleRequest) {
            wh.customHandleRequest = handleRequest;
        }
        this._im = new interfaceManager_1.InterfaceManager(this.e, this);
        this._holdResponse = false;
    }
    /**
     * Set hold response flag. This allows you to run tunnel logic and send the response after completion.
     * You must call _releaseResponse_ later if you use this.
     * @param holdResponse
     */
    set holdResponse(holdResponse) {
        this._holdResponse = holdResponse;
    }
    /**
     * Get the holdResponse flag.
     * @returns {boolean}
     */
    get holdResponse() {
        return this._holdResponse;
    }
    /**
     * Releases the webhook response when tunnel run logic is complete.
     * @param job {WebhookJob}      The webhook job that triggered the webhook nest.
     * @param message {string}      The optional response message, if not using a custom request handler.
     * #### Example
     * ```js
     * var webhook = af.createWebhookNest(["jobs", "submit"], "post");
     * webhook.holdResponse = true; // Keeps the response from being sent immediately
     * var tunnel = af.createTunnel("Dwight's test tunnel");
     * tunnel.watch(webhook);
     * tunnel.run(function(job, nest){
     *      setTimeout(function(){
     *          nest.releaseResponse(job, "Worked!"); // Sends response
     *      }, 1500); // After 1.5 seconds
     * });
     * ```
     */
    releaseResponse(job, message) {
        let wn = this;
        if (wn.holdResponse === false) {
            wn.e.log(3, `Nest responses must be held to release a response.`, wn);
        }
        else if (job.responseSent === true) {
            wn.e.log(0, `Nest responses was already sent. Skipping.`, wn);
        }
        else {
            wn.e.server.sendHookResponse(false, job, wn, job.request, job.response, wn.customHandleRequest, message);
        }
    }
    /**
     * Get the custom handleRequest function.
     * @returns {any}
     */
    get customHandleRequest() {
        return this._handleRequest;
    }
    /**
     * Set the custom handlerRequest function.
     * @param handleRequest
     */
    set customHandleRequest(handleRequest) {
        if (handleRequest !== null && typeof handleRequest !== "function") {
            throw ("Custom handleRequest must be a function.");
        }
        this._handleRequest = handleRequest;
    }
    /**
     * Set the _path as a string or a string array. All parts are URI encoded.
     * Create directory structures with an array: ["one", "two"] results in "/one/two".
     * @param path
     */
    set path(path) {
        let wh = this;
        let modifiedPath = "";
        if (typeof (path) === "string") {
            modifiedPath = encodeURIComponent(path);
        }
        else if (path instanceof Array) {
            path.forEach(function (pi) {
                modifiedPath += "/" + encodeURIComponent(pi);
            });
        }
        else {
            throw `Path should be a string or array, ${typeof (path)} found.`;
        }
        if (modifiedPath.charAt(0) !== "/") {
            modifiedPath = "/" + modifiedPath;
        }
        wh._path = modifiedPath;
    }
    /**
     * Get the _path.
     * @returns {string}
     */
    get path() {
        return this._path;
    }
    /**
     * Get the HTTP method.
     * @returns {string}
     */
    get httpMethod() {
        return this._httpMethod;
    }
    /**
     * Set the HTTP method.
     * @param httpMethod
     */
    set httpMethod(httpMethod) {
        let lower = httpMethod.toLowerCase();
        let acceptableMethods = ["get", "post", "put", "head", "delete", "options", "trace", "copy", "lock", "mkcol", "move", "purge", "propfind", "proppatch", "unlock", "report", "mkactivity", "checkout", "merge", "m-search", "notify", "subscribe", "unsubscribe", "patch", "search", "connect", "all"];
        if (acceptableMethods.indexOf(lower) === -1) {
            throw `HTTP method "${lower}" is not an acceptable value. ${JSON.stringify(acceptableMethods)}`;
        }
        this._httpMethod = lower;
    }
    /**
     * Get the _name.
     * @returns {string}
     */
    get name() {
        return this._name;
    }
    /**
     * On load, do nothing.
     */
    load() { }
    /**
     * Add webhook to server watch list.
     */
    watch() {
        let wh = this;
        wh.e.addWebhook(wh);
    }
    /**
     * Creates a new job
     * @param job
     */
    arrive(job) {
        super.arrive(job);
    }
    /**
     * Get the interface manager. Used to manage interface instances for session handling.
     * @returns {InterfaceManager}
     */
    get interfaceManager() {
        return this._im;
    }
}
exports.WebhookNest = WebhookNest;
//# sourceMappingURL=webhookNest.js.map