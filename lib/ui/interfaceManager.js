"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceManager = void 0;
const webhookInterface_1 = require("./webhookInterface");
const step_1 = require("./step");
const _ = require("lodash"), clone = require("clone");
/**
 * The interface manager allows you to separate your interface fields for stepped user interfaces.
 * It's a factory that handles the construction and session handling of WebhookInterface instances.
 * #### Example
 * ```js
 * var manager = webhook.getInterfaceManager();
 * manager.addField({
 *      id: "job_number",
 *      _name: "Job Number";
 *      type: "text"
 * });
 * ```
 */
class InterfaceManager {
    /**
     *
     * @param e
     * @param webhookNest
     * @param handleRequest     Optional custom request handler for webhooks.
     */
    constructor(e, webhookNest, handleRequest) {
        this.e = e;
        this._nest = webhookNest;
        this._interfaceInstances = [];
        this._fields = [];
        this._steps = [];
        this._handleRequest = handleRequest;
        this.initMetadata();
    }
    initMetadata() {
        this._metadata = {
            interfaceProperties: []
        };
    }
    get metadata() {
        return this._metadata;
    }
    set metadata(metadata) {
        let clonedMetadata = clone(metadata);
        if (_.has(clonedMetadata, "interfaceProperties") && typeof (clonedMetadata.interfaceProperties) !== "undefined" && clonedMetadata.interfaceProperties.constructor === Array) {
        }
        else {
            clonedMetadata.interfaceProperties = [];
        }
        this._metadata = clonedMetadata;
    }
    set description(description) {
        this.metadata.description = description;
    }
    set tooltip(tooltip) {
        this.metadata.tooltip = tooltip;
    }
    addInterfaceProperty(property) {
        this.metadata.interfaceProperties.push(property);
    }
    set interfaceProperties(properties) {
        this.metadata.interfaceProperties = properties;
    }
    get interfaceInstances() {
        return this._interfaceInstances;
    }
    get checkpointNest() {
        return this._checkpointNest;
    }
    set checkpointNest(nest) {
        this._checkpointNest = nest;
    }
    /**
     * Get the custom handleRequest function.
     * @returns {any}
     */
    get customHandleRequest() {
        return this._handleRequest;
    }
    /**
     * Get the nest
     * @returns {WebhookNest}
     */
    get nest() {
        return this._nest;
    }
    /**
     * Get the nest _path.
     * @returns {string}
     */
    get path() {
        return this.nest.path;
    }
    /**
     * Adds an interface field to the interface.
     * @param {FieldOptions} field
     */
    addField(field) {
        let wi = this;
        let existingField = _.find(wi.fields, function (f) { return f.id === field.id; });
        if (existingField) {
            wi.e.log(3, `Field id "${field.id}" already exists. It cannot be added again.`, wi);
            return false;
        }
        this.fields.push(field);
    }
    /**
     * Gets an array of interface fields.
     * @returns {FieldOptions[]}
     */
    get fields() {
        return this._fields;
    }
    /**
     * Adds a user interface step.
     * @param stepName
     * @param callback          Parameters: WebhookJob, WebhookInterface, Step, Done callback
     * #### Example
     * ```js
     *  manager.addStep("Check job number", function(webhookJob, webhookInterface, step, done){
     *      if(webhookJob.getQueryStringValue("job_number")){
     *          webhookInterface.addField({
     *              id: "something_else",
     *              _name: "Some other field",
     *              type: "text",
     *              description: "Thanks for adding a job number!"
     *          });
     *          step.complete = true; // Mark step as complete
     *          done(); // Callback to do next step or send response if complete
     *      }
     * });
     * ```
     */
    addStep(stepName, callback) {
        let step = new step_1.Step();
        step.name = stepName;
        step.callback = callback;
        step.complete = false;
        this._steps.push(step);
    }
    /**
     * Get an array of user interface steps.
     * @returns {Step[]}
     */
    get steps() {
        return this._steps;
    }
    addInterfaceInstance(wi) {
        let im = this;
        im.interfaceInstances.push(wi);
        // Destruct
        let sessionExpiration = (im.e.options.webhook_interface_session_timeout * 60000) || 300000;
        setTimeout(() => {
            im.removeInterfaceInstance(wi);
        }, sessionExpiration);
    }
    removeInterfaceInstance(wi) {
        let im = this;
        let removeSuccess = _.remove(im.interfaceInstances, (i) => {
            return i.sessionId === wi.sessionId;
        });
        if (removeSuccess) {
            im.e.log(0, `Removed webhook interface session ${wi.sessionId}`, im);
        }
        else {
            im.e.log(3, `Unable to remove webhook interface session ${wi.sessionId}`, im);
        }
    }
    ;
    /**
     * Find or return a new webhook interface instance.
     * @param sessionId
     * @returns {WebhookInterface}
     */
    getInterface(sessionId) {
        let im = this;
        let wi;
        // Find in this.interfaceInstances
        if (sessionId) {
            wi = _.find(im.interfaceInstances, function (i) { return i.sessionId === sessionId; });
        }
        if (!wi) {
            // Make new interface if not found
            wi = new webhookInterface_1.WebhookInterface(im.e, im.nest);
            wi.fields = im.fields;
            wi.steps = im.steps;
            wi.metadata = im.metadata;
            wi.checkpointNest = im.checkpointNest;
            if (im.interfaceInstances.length === 0) {
                im.e.addWebhookInterface(this);
            }
            else {
                im.e.log(0, `${im.interfaceInstances.length} interface sessions already exist.`, im);
            }
            im.addInterfaceInstance(wi);
        }
        else {
            im.e.log(0, `Restored interface session ${wi.sessionId}.`, im);
        }
        return wi;
    }
    /**
     * Adds pending jobs to the interfaces job list.
     * @param nest
     */
    checkNest(nest) {
        this.checkpointNest = nest;
        nest.watchHold();
    }
}
exports.InterfaceManager = InterfaceManager;
//# sourceMappingURL=interfaceManager.js.map