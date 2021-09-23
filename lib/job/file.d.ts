import { Environment } from "../environment/environment";
export declare class File {
    protected _path: string;
    protected _dirname: string;
    protected _basename: string;
    protected _contentType: string;
    protected _extension: string;
    protected _sizeBytes: number;
    protected e: Environment;
    /**
     * File constructor
     * @param e
     * @param path
     */
    constructor(e: Environment, path: string);
    /**
     * Refresh the file statistics after a rename or modification.
     */
    protected getStatistics(): void;
    /**
     * Get the _basename.
     * @returns {string}
     */
    get name(): string;
    /**
     * Set a new file _name.
     * @param filename
     */
    set name(filename: string);
    /**
     * Get the file _name of the job without the file extension.
     * @returns {string}
     */
    get nameProper(): any;
    /**
     * Get the top level directory _name.
     * @returns {string}
     */
    get dirname(): string;
    /**
     * Get the complete directory _path.
     * @returns {string}
     */
    get path(): string;
    /**
     * Set the complete directory _path.
     * @param path
     */
    set path(path: string);
    /**
     * Get the content-type of the file.
     * @returns {string}
     */
    get contentType(): string;
    /**
     * Get the file extension.
     * @returns {string}
     */
    get extension(): string;
    /**
     * Get the _basename.
     * @returns {string}
     */
    get basename(): string;
    get sizeBytes(): number;
    get size(): any;
    /**
     * Renames the local job file to the current _name.
     */
    renameLocal(): void;
    /**
     * Deletes the local file.
     * @returns {boolean}
     */
    removeLocal(): boolean;
}
