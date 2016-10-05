import { WebhookNest } from "../nest/webhookNest";
import { WebhookInterface } from "./webhookInterface";
import { Environment } from "../environment/environment";
export declare class InterfaceManager {
    protected e: Environment;
    protected nest: WebhookNest;
    protected fields: FieldOptions[];
    protected steps: Step[];
    protected interfaceInstances: WebhookInterface[];
    protected handleRequest: any;
    constructor(e: Environment, webhookNest: WebhookNest, handleRequest?: any);
    /**
     * Get the custom handleRequest function.
     * @returns {any}
     */
    getCustomHandleRequest(): any;
    /**
     * Get the nest
     * @returns {WebhookNest}
     */
    getNest(): WebhookNest;
    /**
     * Get the nest path.
     * @returns {string}
     */
    getPath(): string;
    /**
     * Adds an interface field to the interface.
     * @param {FieldOptions} field
     */
    addField(field: FieldOptions): boolean;
    getFields(): FieldOptions[];
    /**
     * Adds a user interface step
     * @param stepName
     * @param callback
     */
    addStep(stepName: string, callback: any): void;
    /**
     *
     * @returns {Step[]}
     */
    getSteps(): Step[];
    /**
     * Find or return a new interface instance.
     * @param sessionId
     * @returns {WebhookInterface}
     */
    getInterface(sessionId?: string): any;
}
