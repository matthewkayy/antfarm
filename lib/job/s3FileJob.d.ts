import { FileJob } from "./fileJob";
import { File } from "./file";
import { Environment } from "./../environment/environment";
export declare class S3FileJob extends FileJob {
    protected _file: File;
    private _bucket;
    private _key;
    private _eTag;
    constructor(e: Environment, basename: any);
    /**
     * Set remote bucket location.
     * @param bucket
     */
    set bucket(bucket: string);
    /**
     * Get remote bucket location.
     * @returns {string}
     */
    get bucket(): string;
    /**
     * Set remote key.
     * @param key
     */
    set key(key: string);
    /**
     * Get remote key
     * @returns {string}
     */
    get key(): string;
    /**
     * Set remote ETag
     * @param eTag
     */
    set eTag(eTag: string);
    /**
     * Get remote ETag
     * @returns {string}
     */
    get eTag(): string;
}
