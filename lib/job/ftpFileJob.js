"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpFileJob = void 0;
const fileJob_1 = require("./fileJob");
const tmp = require("tmp");
class FtpFileJob extends fileJob_1.FileJob {
    constructor(e, basename) {
        // Create temp file
        let tmpobj = tmp.fileSync();
        super(e, tmpobj.name);
        this.rename(basename);
        this.locallyAvailable = false;
    }
}
exports.FtpFileJob = FtpFileJob;
//# sourceMappingURL=ftpFileJob.js.map