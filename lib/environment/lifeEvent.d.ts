/**
 * The LifeEvent class provides a lifecycle that can be provided to debug job failures.
 */
export declare class LifeEvent {
    protected _date: Date;
    protected _verb: string;
    protected _start: string;
    protected _finish: string;
    constructor(verb: any, start: any, finish: any);
    get date(): Date;
    set date(date: Date);
    get verb(): string;
    set verb(verb: string);
    get start(): string;
    set start(start: string);
    get finish(): string;
    set finish(finish: string);
    get statement(): string;
}
