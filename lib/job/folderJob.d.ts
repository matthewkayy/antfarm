import { Environment } from "../environment/environment";
import { Job } from "./job";
import { File } from "./file";
import { Nest } from "../nest/nest";
export declare class FolderJob extends Job {
    protected _path: string;
    protected _dirname: string;
    protected _basename: string;
    protected _files: File[];
    /**
     * FolderJob constructor
     * @param e
     * @param path
     */
    constructor(e: Environment, path: string);
    protected getStatistics(): void;
    /**
     * Creates file objects for folder contents. Async operation returns a callback on completion.
     * @param callback
     */
    createFiles(callback: () => void): void;
    /**
     * Gets the job _name.
     * @returns {string}
     */
    get name(): string;
    /**
     * Get the _basename.
     * @returns {string}
     */
    get basename(): string;
    /**
     * Get the directory _name.
     * @returns {string}
     */
    get dirname(): string;
    /**
     * Get the _path.
     * @returns {string}
     */
    get path(): string;
    /**
     * Set a new _path.
     * @param path
     */
    set path(path: string);
    /**
     * Add a file object to the job.
     * @param file
     */
    addFile(file: File): void;
    /**
     * Get a file object from the job.
     * @param index
     * @returns {File}
     */
    getFile(index: number): File;
    /**
     * Get all _files associated with the job.
     * @returns {File[]}
     */
    get files(): File[];
    /**
     * Get the number of _files in this folder.
     * @returns {number}
     */
    count(): number;
    /**
     * Get the extension.
     * @returns {null}
     */
    get extension(): any;
    /**
     * Check if job is a folder.
     * @returns {boolean}
     */
    isFolder(): boolean;
    /**
     * Check if job is a file.
     * @returns {boolean}
     */
    isFile(): boolean;
    /**
     * Moves a folder to a nest. This is an asynchronous method which provides a callback on completion.
     * @param destinationNest
     * @param callback
     */
    move(destinationNest: Nest, callback: (job?: Job) => void): void;
    /**
     * Renames the job folder, leaving its content's names alone.
     * @param newName
     */
    rename(newName: string): void;
    remove(): void;
}
