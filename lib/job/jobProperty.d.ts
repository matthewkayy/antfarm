export declare class JobProperty {
    protected _key: string;
    protected _value: any;
    protected _type: string;
    constructor(key: string, value: any);
    get value(): any;
    set value(value: any);
    protected resolveType(): void;
    get key(): string;
    set key(key: string);
    get type(): string;
    set type(type: string);
}
