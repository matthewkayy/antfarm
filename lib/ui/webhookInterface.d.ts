import { Environment } from "../environment/environment";
import { WebhookNest } from "../nest/webhookNest";
import { FolderNest } from "../nest/folderNest";
import { FieldOptions } from "./field";
import { Step } from "./step";
import { InterfaceMetadata } from "./interfaceMetadata";
import { InterfaceProperty } from "./InterfaceProperty";
/**
 * A webhook interface instance, tied to a particular session.
 * Within interface steps, you can use these methods directly to alter the schema being returned to the user interface.
 * #### Example
 * ```js
 * var manager = webhook.getInterfaceManager();
 * manager.addStep("Check job number", function(webhookJob, webhookInterface, step){
 *      if(webhookJob.getQueryStringValue("job_number")){
 *          webhookInterface.addField({
 *              id: "something_else",
 *              _name: "Some other field",
 *              type: "text",
 *              description: "Thanks for adding a job number!"
 *          });
 *          step.complete = true; // Mark step as complete
 *      }
 * });
 * ```
 */
export declare class WebhookInterface {
    protected _fields: FieldOptions[];
    protected e: Environment;
    protected _nest: WebhookNest;
    protected _checkpointNest: FolderNest;
    protected _steps: Step[];
    protected _sessionId: string;
    protected _metadata: InterfaceMetadata;
    /**
     * Constructor
     * @param {Environment} e
     * @param {WebhookNest} nest
     */
    constructor(e: Environment, nest: WebhookNest);
    protected initMetadata(): void;
    get metadata(): InterfaceMetadata;
    /**
     * Sets a cloned instance of metadata.
     * @param metadata
     */
    set metadata(metadata: InterfaceMetadata);
    set description(description: string);
    set tooltip(tooltip: string);
    addInterfaceProperty(property: InterfaceProperty): void;
    set interfaceProperties(properties: InterfaceProperty[]);
    /**
     * Return the session id. Used to match to interface instanced within the manager.
     * @returns {string}
     */
    get sessionId(): string;
    /**
     * Get the nest
     * @returns {WebhookNest}
     */
    get nest(): WebhookNest;
    /**
     * Adds an interface field to the interface.
     * @param {FieldOptions} field
     */
    addField(field: FieldOptions): boolean;
    /**
     * Get an existing field from the interface to modify its properties.
     * @param fieldId
     * @returns {FieldOptions}
     * #### Example
     * ```js
     * im.addStep("Check job number", function(webhookJob, webhookInterface, step, done) {
     *      if(webhookJob.getParameter("job_number").length == 6) {
     *          // Make job number read only
     *          var jobNumberField = webhookInterface.getField("job_number");
     *          jobNumberField.readonly = true;
     *          // Complete step
     *          webhookInterface.completeStep(step);
     *      } else {
     *          step.failure = "Job number was not 6 characters.";
     *      }
     *      done();
     * });
     * ```
     */
    getField(fieldId: string): any;
    /**
     * Overwrites fields with a clone.
     * @param fields
     */
    set fields(fields: FieldOptions[]);
    /**
     * Get an array of all of the fields.
     * @returns {FieldOptions[]}
     */
    get fields(): FieldOptions[];
    /**
     * Returns the interface for transport.
     * @returns {{fields: Array}}
     */
    getTransportInterface(): {
        sessionId: string;
        fields: FieldOptions[];
        heldJobs: any[];
        steps: any[];
        metadata: InterfaceMetadata;
    };
    /**
     * Returns checked jobs.
     * @returns {(FileJob|FolderJob)[]}
     */
    getJobs(): (import("../job/fileJob").FileJob | import("../job/folderJob").FolderJob)[];
    /**
     * Sets the checkpoint nest.
     * @param nest
     */
    set checkpointNest(nest: FolderNest);
    get checkpointNest(): FolderNest;
    /**
     * Adds a user interface step
     * @param stepName
     * @param callback
     */
    addStep(stepName: string, callback: any): void;
    /**
     * Mark a step as complete and remove it from the interface.
     * @param step {Step}
     */
    completeStep(step: Step): boolean;
    /**
     * Alias of completeStep.
     * @param step {Step}
     */
    removeStep(step: Step): void;
    /**
     * Get an array of instance steps.
     * @returns {Step[]}
     */
    get steps(): any;
    getStepsTransport(): any[];
    /**
     * Overwrite the instant steps.
     * @param steps
     */
    set steps(steps: any);
}
