"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tunnel_1 = require("./tunnel/tunnel");
const ftpNest_1 = require("./nest/ftpNest");
const folderNest_1 = require("./nest/folderNest");
const environment_1 = require("./environment/environment");
const webhookNest_1 = require("./nest/webhookNest");
const autoFolderNest_1 = require("./nest/autoFolderNest");
const s3Nest_1 = require("./nest/s3Nest");
/**
 * Expose `Antfarm`.
 */
class Antfarm {
    /**
     * Antfarm constructor
     * @param options   Antfarm options
     */
    constructor(options) {
        this.e = new environment_1.Environment(options);
        this.e.log(1, "Started antfarm", this);
    }
    version() {
        return "0.0.1";
    }
    /**
     * Factory method which returns a Tunnel.
     * @param name
     * @returns {Tunnel}
     */
    createTunnel(name) {
        let a = this;
        return new tunnel_1.Tunnel(a.e, name);
    }
    /**
     * Factory method which returns a FolderNest.
     * @param path          Path of the folder.
     * @param allowCreate   Optional boolean flag to allow creation of folder if it does not exist.
     * @returns {FolderNest}
     * #### Example
     * ```js
     * var out_folder = af.createFolderNest("/Users/dominick/Desktop/My Folder/");
     * ```
     */
    createFolderNest(path, allowCreate = false) {
        return new folderNest_1.FolderNest(this.e, path, allowCreate);
    }
    /**
     * Factory method which returns an AutoFolderNest. If the auto managed directory does not exist, it is created.
     * @param hierarchy     Path of the folder as a string or an array of strings as _path segments.
     * @returns {AutoFolderNest}
     *
     * #### Example
     * ```js
     * af.createAutoFolderNest("outfolder")
     * // /Users/dominick/My Automanaged Directory/outfolder
     * ```
     * #### Example
     * ```js
     * af.createAutoFolderNest(["proofing", "others"])
     * // /Users/dominick/My Automanaged Directory/proofing/others
     * ```
     */
    createAutoFolderNest(hierarchy) {
        return new autoFolderNest_1.AutoFolderNest(this.e, hierarchy);
    }
    /**
     * Factory method which returns an FtpNest.
     * @param host          Hostname or IP address of the FTP server.
     * @param port          Port number of the FTP server.
     * @param username      FTP account username.
     * @param password      FTP account password.
     * @param checkEvery    Frequency of re-checking FTP in minutes.
     * @returns {FtpNest}
     * #### Example
     * ```js
     * // Check FTP directory every 2 minutes
     * var my_ftp = af.createFtpNest("ftp.example.com", 21, "", "", 2);
     * ```
     */
    createFtpNest(host, port = 21, username = "", password = "", checkEvery = 10) {
        return new ftpNest_1.FtpNest(this.e, host, port, username, password, checkEvery);
    }
    /**
     * Factory method to create and return an S3 nest.
     * @param bucket
     * @param keyPrefix
     * @param checkEvery
     * @param allowCreation
     * @returns {S3Nest}
     * ```js
     * var bucket = af.createS3Nest("my-bucket-_name", "", 1, true);
     * ```
     */
    createS3Nest(bucket, keyPrefix, checkEvery = 5, allowCreation = false) {
        return new s3Nest_1.S3Nest(this.e, bucket, keyPrefix, checkEvery, allowCreation);
    }
    /**
     * Factory method which returns a WebhookNest.
     * @param path              The _path which is generated in the webhook's route. You can supply a string or array of strings.
     * @param httpMethod        HTTP method for this webhook. Choose "all" for any HTTP method.
     * @param handleRequest     Optional callback function to handle the request, for sending a custom response.
     * @returns {WebhookNest}
     *
     * #### Example
     * ```js
     * var webhook = af.createWebhookNest(["proof", "create"], "post");
     * ```
     *
     * #### Example returning custom response
     * ```js
     * var webhook = af.createWebhookNest(["proof", "create"], "post", function(req, res, job, nest){
     *     res.setHeader("Content-Type", "application/json; charset=utf-8");
     *     res.end(JSON.stringify({
     *          job_name: job.getName(),
     *          job_id: job.getId(),
     *          message: "Proof created!"
     *     }));
     * });
     * ```
     */
    createWebhookNest(path, httpMethod = "all", handleRequest) {
        return new webhookNest_1.WebhookNest(this.e, path, httpMethod, handleRequest);
    }
    /**
     * Load an entire directory of workflow modules.
     * @param directory     Path to the workflow modules.
     * #### Example
     * ```js
     * af.loadDir("./workflows");
     * ```
     */
    loadDir(directory) {
        let af = this;
        let workflows = require("require-dir-all")(directory, {
            _parentsToSkip: 1,
            indexAsParent: true,
            throwNoDir: true
        });
        let loaded_counter = 0;
        for (let workflow in workflows) {
            try {
                new workflows[workflow](af);
                loaded_counter++;
            }
            catch (e) {
                af.e.log(3, `Couldn't load workflow module "${workflow}". ${e}`, af);
            }
        }
        af.e.log(1, `Loaded ${loaded_counter} workflows.`, af);
    }
    /**
     * Log messages into the antfarm logger.
     * @param type {number}         The log level. 0 = debug, 1 = info, 2 = warning, 3 = error
     * @param message {string}       Log message.
     * @param actor  {any}           Instance which triggers the action being logged.
     * @param instances {any[]}      Array of of other involved instances.
     * #### Example
     * ```js
     * job.e.log(1, `Transferred to Tunnel "${tunnel.getName()}".`, job, [oldTunnel]);
     * ```
     */
    log(type, message, actor, instances = []) {
        let af = this;
        af.e.log(type, message, actor, instances);
    }
}
exports.default = Antfarm;
//# sourceMappingURL=antfarm.js.map