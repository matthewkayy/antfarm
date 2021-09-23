import { Tunnel } from "../tunnel/tunnel";
import { Job } from "../job/job";
import { Environment } from "../environment/environment";
/**
 * A nest is a resource that holds or produces jobs.
 */
export declare abstract class Nest {
    protected _id: string;
    protected _name: string;
    protected _tunnel: Tunnel;
    protected e: Environment;
    constructor(e: Environment, name: string);
    get id(): string;
    toString(): string;
    get name(): string;
    set name(name: string);
    get tunnel(): Tunnel;
    register(tunnel: Tunnel): void;
    arrive(job: Job): void;
    take(job: Job, callback: any): void;
}
