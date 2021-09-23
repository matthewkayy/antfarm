"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpNest = void 0;
const nest_1 = require("./nest");
const ftpFileJob_1 = require("./../job/ftpFileJob");
const EasyFtp = require("easy-ftp"), tmp = require("tmp"), fs = require("fs"), async = require("async");
class FtpNest extends nest_1.Nest {
    constructor(e, host, port, username, password, checkEvery) {
        super(e, host);
        this.config = {
            host: host,
            port: port,
            username: username,
            password: password
        };
        this.checkEvery = checkEvery;
        this.checkEveryMs = this.checkEvery * 60000;
    }
    getClient() {
        return new EasyFtp();
    }
    load() {
        let ftp = this;
        try {
            let ftp_client = ftp.getClient();
            ftp_client.connect(ftp.config);
            ftp_client.ls("/", function (err, list) {
                if (err) {
                    ftp_client.close();
                }
                ftp.e.log(1, `FTP ls found ${list.length} files.`, ftp);
                async.eachSeries(list, function (file, done) {
                    // Create temp file
                    ftp.e.log(1, `FTP found file "${file.name}".`, ftp);
                    let job = new ftpFileJob_1.FtpFileJob(ftp.e, file.name);
                    // Download to the temp job location
                    ftp_client.download(file.name, job.path, function (err) {
                        if (err) {
                            ftp.e.log(3, `Download error: "${err}".`, ftp);
                            done();
                        }
                        else {
                            job.locallyAvailable = true;
                            // Delete on success
                            ftp_client.rm(file.name, function (err) {
                                if (err) {
                                    ftp.e.log(3, `Remove error: "${err}".`, ftp);
                                }
                                ftp.arrive(job);
                                done();
                            });
                        }
                    });
                }, function (err) {
                    if (err) {
                        ftp.e.log(3, `Async series download error: "${err}".`, ftp);
                    }
                    ftp.e.log(0, `Completed ${list.length} synchronous download(s).`, ftp);
                    ftp_client.close();
                });
                //
                // list.forEach(function (file, index) {
                //
                // });
            });
        }
        catch (e) {
            ftp.e.log(3, e, ftp);
        }
    }
    watch() {
        let ftp = this;
        ftp.e.log(1, "Watching FTP directory.", ftp);
        let count = 0;
        setInterval(function () {
            count++;
            ftp.e.log(1, `Re-checking FTP, attempt ${count}.`, ftp);
            ftp.load();
        }, ftp.checkEveryMs, count);
    }
    arrive(job) {
        super.arrive(job);
    }
    take(job, callback) {
        let ftp = this;
        try {
            let ftp_path = `/${job.name}`;
            let ftp_client = ftp.getClient();
            ftp_client.connect(ftp.config);
            ftp_client.upload(job.path, ftp_path, function (err) {
                if (err) {
                    ftp.e.log(3, `Error uploading ${job.name} to FTP.`, ftp);
                }
                fs.unlinkSync(job.path);
                ftp_client.close();
                let ftpJob = job;
                ftpJob.locallyAvailable = false;
                callback(ftpJob);
            });
        }
        catch (e) {
            ftp.e.log(3, "Take upload error, " + e, ftp);
        }
    }
}
exports.FtpNest = FtpNest;
//# sourceMappingURL=ftpNest.js.map