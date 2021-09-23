"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoFolderNest = void 0;
const folderNest_1 = require("./folderNest");
const fs = require("fs"), tmp = require("tmp"), path_mod = require("path");
/**
 * An auto managed folder nest used for temporarily storing _files.
 */
class AutoFolderNest extends folderNest_1.FolderNest {
    constructor(e, hierarchy) {
        if (!e.autoManagedFolderDirectory) {
            throw "Option auto_managed_folder_directory must be set to use auto managed folders.";
        }
        let cleanDirSegment = function (name) {
            name = name.replace(/\s+/gi, "-"); // Replace white space with dash
            return name.replace(/[^a-zA-Z0-9\-\_\.]/gi, ""); // Strip any special charactere
        };
        /**
         * Creates the hierarchy string used for the auto managed _path.
         * @param hierarchy
         */
        let getHierarchyString = (hierarchy) => {
            let hierarchyString = "";
            if (typeof (hierarchy) === "string") {
                hierarchyString = cleanDirSegment(hierarchy.toString());
            }
            else if (hierarchy instanceof Array) {
                hierarchy.forEach((pi) => {
                    hierarchyString += path_mod.sep + cleanDirSegment(pi);
                });
            }
            else {
                throw `Path should be a string or array, ${typeof (hierarchy)} found.`;
            }
            if (hierarchyString.charAt(0) !== path_mod.sep) {
                hierarchyString = path_mod.sep + hierarchyString;
            }
            return hierarchyString;
        };
        let path = e.autoManagedFolderDirectory + getHierarchyString(hierarchy);
        super(e, path, true);
        this.hierarchy = hierarchy;
        this.hierarchyString = getHierarchyString(hierarchy);
    }
}
exports.AutoFolderNest = AutoFolderNest;
//# sourceMappingURL=autoFolderNest.js.map