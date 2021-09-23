import { Environment } from "../environment/environment";
import { Job } from "./job";
import { File } from "./file";
import { Nest } from "../nest/nest";
export declare class FileJob extends Job {
    protected _file: File;
    /**
     * FileJob constructor.
     * @param e
     * @param path
     */
    constructor(e: Environment, path: string);
    /**
     * Get the file object.
     * @returns {File}
     */
    get file(): File;
    /**
     * Get the file _name.
     * @returns {string}
     */
    get name(): string;
    /**
     * Get the file _name proper.
     * @returns {string}
     */
    get nameProper(): any;
    /**
     * Get the file directory _name.
     * @returns {string}
     */
    get dirname(): string;
    /**
     * Get the file _path.
     * @returns {string}
     */
    get path(): string;
    /**
     * Set a new file _path.
     * @param path
     */
    set path(path: string);
    /**
     * Set a new file _name.
     * @param filename
     */
    set name(filename: string);
    /**
     * Get the file content type.
     * @returns {string}
     */
    get contentType(): string;
    /**
     * Get the file extension.
     * @returns {string}
     */
    get extension(): string;
    /**
     * Get the file _basename.
     * @returns {string}
     */
    get basename(): string;
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
     * Moves a file to a nest. This is an asynchronous method which provides a callback on completion.
     *
     * @param destinationNest       The nest object the job will be sent to.
     *
     * @param callback              The callback provides the updated instance of the job. Depending on the nest it was sent to, it may have been cast to a new job type. This is helpful in case you need the remote path to the job once it has been uploaded to S3, for example.
     *
     * #### Example
     * ```js
     * tunnel.run((job, nest) => {
     *      console.log("Found job " + job.name);
     *      job.move(my_s3_bucket, (s3_job) => {
     *          // Uploaded
     *          console.log("Uploaded to " + s3_job.path); // https://mybucket.s3.amazonaws.com/myfile.pdf
     *      });
     * });
     * ```
     */
    move(destinationNest: Nest, callback: (job: Job) => void): void;
    /**
     * Rename the job file to a new _name.
     * @param newName
     */
    rename(newName: string): void;
    /**
     * Deletes the local file.
     */
    remove(): boolean;
    get size(): any;
    get sizeBytes(): number;
}
