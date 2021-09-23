"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Nest = void 0;
const nest_1 = require("./nest");
const s3FileJob_1 = require("../job/s3FileJob");
const AWS = require("aws-sdk"), _ = require("lodash"), async = require("async"), fs = require("fs");
class S3Nest extends nest_1.Nest {
    /**
     * Constructor
     * @param e
     * @param bucket            AWS S3 bucket to watch.
     * @param keyPrefix         Optional key prefix (sub-directory) to watch.
     * @param checkEvery        Frequency of bucket checking, in minutes.
     * @param allowCreation     Create the bucket:prefix if it does not exist.
     */
    constructor(e, bucket, keyPrefix, checkEvery = 5, allowCreation = false) {
        super(e, "An S3 bucket");
        let sn = this;
        sn.s3 = new AWS.S3();
        sn.bucket = bucket;
        sn.keyPrefix = keyPrefix;
        sn.checkEvery = checkEvery;
        sn.checkEveryMs = checkEvery * 60000;
        sn.allowCreation = allowCreation;
        sn.verifyBucket();
    }
    /**
     * Set hard-coded AWS credentials.
     * @param accessKeyId
     * @param secretAccessKey
     */
    setCredentials(accessKeyId, secretAccessKey) {
        AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });
    }
    /**
     * Verify bucket and handle creation of bucket if need be.
     */
    verifyBucket() {
        let sn = this;
        sn.headBucket(headSuccess => {
            if (!headSuccess) {
                if (sn.allowCreation) {
                    sn.createBucket(createSuccess => {
                        if (!createSuccess) {
                            sn.e.log(3, `Bucket "${sn.bucket}" could not be created.`, sn);
                        }
                    });
                }
                else {
                    sn.e.log(3, `Bucket "${sn.bucket}" does not exist and allowCreation is set to false.`, sn);
                }
            }
        });
    }
    /**
     * Verify that the bucket is available and exists
     * @param callback
     */
    headBucket(callback) {
        let sn = this;
        let params = { Bucket: sn.bucket };
        sn.s3.headBucket(params, (err, data) => {
            if (err) {
                sn.e.log(2, `headBucket error: ${err}`, sn);
                callback(false);
            }
            else {
                // if (_.isEmpty(data)) {
                //     sn.e.log(2, `headBucket empty response`, sn);
                //     callback(true);
                // } else {
                //     sn.e.log(0, `headBucket success: ${data}`, sn);
                //     console.log(data);
                //     callback(true);
                // }
                sn.e.log(0, `Bucket "${sn.bucket}" is available.`, sn);
                callback(true);
            }
        });
    }
    createBucket(callback) {
        let sn = this;
        let params = {
            Bucket: sn.bucket, /* required */
            // ACL: 'private | public-read | public-read-write | authenticated-read',
            // CreateBucketConfiguration: {
            //     LocationConstraint: 'EU | eu-west-1 | us-west-1 | us-west-2 | ap-south-1 | ap-southeast-1 | ap-southeast-2 | ap-northeast-1 | sa-east-1 | cn-north-1 | eu-central-1'
            // },
            // GrantFullControl: 'STRING_VALUE',
            // GrantRead: 'STRING_VALUE',
            // GrantReadACP: 'STRING_VALUE',
            // GrantWrite: 'STRING_VALUE',
            // GrantWriteACP: 'STRING_VALUE'
        };
        sn.s3.createBucket(params, function (err, data) {
            if (err) {
                sn.e.log(3, `createBucket error: ${err}`, sn);
                callback(false);
            }
            else {
                if (_.isEmpty(data)) {
                    sn.e.log(2, `createBucket empty response`, sn);
                    callback(false);
                }
                else {
                    sn.e.log(0, `createBucket success: ${data}`, sn);
                    callback(true);
                }
            }
        });
    }
    load() {
        let sn = this;
        let params = {
            Bucket: sn.bucket,
            // ContinuationToken: 'STRING_VALUE',
            // Delimiter: 'STRING_VALUE',
            // EncodingType: 'url',
            // FetchOwner: true || false,
            // MaxKeys: 0,
            Prefix: sn.keyPrefix
        };
        sn.s3.listObjectsV2(params, (err, data) => {
            if (err) {
                sn.e.log(3, `listObjectsV2: ${err}`, sn);
            }
            else {
                let contents = data.Contents;
                // Download each file found
                if (contents.length > 0) {
                    sn.e.log(0, `Found ${contents.length} objects in "${sn.bucket}/${sn.keyPrefix}".`, sn);
                    async.eachSeries(contents, (object, done) => {
                        // Create temp file
                        sn.e.log(1, `S3 found file "${object.Key}".`, sn);
                        let job = new s3FileJob_1.S3FileJob(sn.e, object.Key);
                        // Download and pipe to file
                        let params = { Bucket: sn.bucket, Key: object.Key };
                        let file = require("fs").createWriteStream(job.path);
                        sn.s3.getObject(params).createReadStream().pipe(file);
                        sn.e.log(1, `Downloading "${object.Key}".`, sn);
                        file.on("close", function () {
                            // Delete object
                            sn.deleteObject(object.Key);
                            sn.arrive(job);
                            done();
                        });
                    }, err => {
                        if (err) {
                            sn.e.log(3, `Async series download error: "${err}".`, sn);
                        }
                        sn.e.log(0, `Completed ${contents.length} synchronous download(s).`, sn);
                    });
                }
            }
        });
    }
    /**
     * Removes an object from an S3 bucket.
     * @param key
     */
    deleteObject(key) {
        let sn = this;
        let params = {
            Bucket: sn.bucket,
            Key: key /* required */
        };
        sn.s3.deleteObject(params, function (err) {
            if (err) {
                sn.e.log(3, `S3 delete object error ${err}`, sn);
            }
        });
    }
    /**
     * Watch an S3 bucket.
     */
    watch() {
        let sn = this;
        if (sn.checkEvery === 0) {
            sn.e.log(3, "Cannot watch this bucket. Check every (minutes) set to 0.", sn);
        }
        else {
            sn.e.log(1, "Watching S3 bucket.", sn);
            let count = 0;
            setInterval(function () {
                count++;
                sn.e.log(1, `Re-checking S3 bucket, attempt ${count}.`, sn);
                sn.load();
            }, sn.checkEveryMs, count);
        }
    }
    /**
     * Nest arrival
     * @param job
     */
    arrive(job) {
        super.arrive(job);
    }
    /**
     * Upload a file to an S3 bucket.
     */
    take(job, callback) {
        let sn = this;
        try {
            sn.uploadFile(job, (s3Job) => {
                callback(s3Job);
            });
        }
        catch (e) {
            sn.e.log(3, "Take upload error, " + e, sn);
        }
    }
    /**
     * Calculate the percent remaining from the httpUploadProgress event values.
     * @param total
     * @param loaded
     * @param part
     * @returns {number}
     */
    calculateRemaining(total, loaded, part) {
        let sn = this;
        if (!isNaN(total) && !isNaN(loaded)) {
            let percentRemaining = Math.round((loaded / total) * 100);
            if (isNaN(percentRemaining) || percentRemaining > 100) {
                sn.e.log(3, `Error calculating percent remaining: ${percentRemaining} (${typeof percentRemaining}), total: ${total}, loaded: ${loaded}.`, sn);
                return 0;
            }
            else {
                return percentRemaining;
            }
        }
        else {
            return 0;
        }
    }
    /**
     * Upload file to S3
     * @param job {FileJob}     FileJob to be uploaded.
     * @param callback          Callback includes the S3FileJob parameter.
     */
    uploadFile(job, callback) {
        let sn = this;
        let body = fs.createReadStream(job.path);
        let params = {
            Bucket: sn.bucket,
            Key: sn.keyPrefix + job.name,
            Body: body,
            ACL: "public-read"
        };
        let percentUploaded = 0;
        sn.s3.upload(params).
            on("httpUploadProgress", function (evt) {
            // console.log("evt", evt);
            percentUploaded = sn.calculateRemaining(evt.total, evt.loaded, evt.part);
            sn.e.log(0, `Uploading "${evt.key}" - ${percentUploaded}%`, sn);
        }).
            send(function (err, data) {
            if (err) {
                sn.e.log(3, `S3 upload error: ${err}`, sn);
            }
            // Change job type to a S3FileJob
            let s3Job = job;
            s3Job.locallyAvailable = false;
            s3Job.path = data.Location;
            s3Job.bucket = data.Bucket;
            s3Job.key = data.Key;
            s3Job.eTag = data.ETag;
            callback(s3Job);
        });
    }
}
exports.S3Nest = S3Nest;
//# sourceMappingURL=s3Nest.js.map