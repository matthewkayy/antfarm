"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const webhookJob_1 = require("../job/webhookJob");
const express = require("express");
const cors = require("cors"), multer = require("multer"), path = require("path"), tmp = require("tmp"), async = require("async");
/**
 * Webhook and logging server.
 */
class Server {
    constructor(e) {
        this.hookRoutes = [];
        this.hookInterfaceRoutes = [];
        this.config = {
            hooks_prefix: "/hooks",
            hooks_ui_prefix: "/hooks-ui",
            log_prefix: "/log"
        };
        /**
         * Handles request and response of the web hook interface.
         * @param im {InterfaceManager}
         * @param req {express.Request}
         * @param res {express.Response}
         * @param customHandler             Custom request handler.
         */
        this.handleHookInterfaceRequest = function (im, req, res, customHandler) {
            let s = this;
            // Job arrive
            let job = new webhookJob_1.WebhookJob(s.e, req, res);
            // Fill in default values
            let params = job.getQueryStringValues();
            // If session not set, return a fresh ui somehow
            let sessionId = params["sessionId"] || job.getFormDataValue("sessionId");
            let ui = im.getInterface(sessionId);
            if (ui.sessionId === sessionId) {
                // Fill in default values
                ui.fields.forEach(field => {
                    if (field.id in params && params[field.id] !== "undefined") {
                        field.value = params[field.id];
                    }
                });
                // Do steps
                async.each(ui.steps, (step, cb) => {
                    s.e.log(0, `Running UI step "${step.name}".`, s);
                    step.callback(job, ui, step, () => {
                        cb();
                    });
                }, (err) => {
                    if (err) {
                        s.e.log(3, `Error running UI steps. ${err}`, s);
                    }
                    else {
                        s.e.log(0, `Done running all UI steps.`, s);
                    }
                    if (customHandler) {
                        customHandler(req, res, ui);
                    }
                    else {
                        res.json(ui.getTransportInterface());
                    }
                });
            }
            else {
                if (customHandler) {
                    customHandler(req, res, ui);
                }
                else {
                    res.json(ui.getTransportInterface());
                }
            }
        };
        let s = this;
        s.e = e;
        s.server = express();
        s.createServer();
        // let tmpDir = tmp.dirSync()._name;
        let tmpDir = "./example";
        s.upload = multer({
            destination: tmpDir,
            storage: multer.diskStorage({
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + "-" + Date.now());
                }
            })
        });
    }
    /**
     * Creates the server.
     */
    createServer() {
        let s = this;
        let port = s.e.options.port;
        s.server.use(cors());
        // Add index routes
        s.server.get(s.config.hooks_prefix, function (req, res) {
            res.json(s.hookRoutes);
        });
        s.server.get(s.config.hooks_ui_prefix, function (req, res) {
            res.json(s.hookInterfaceRoutes);
        });
        // Prevent duplicate listening for tests
        // if (!module.parent) {
        //     s.server.listen(port, () => s.e.log(1, `Server up and listening on port ${port}.`, s));
        // }
        s.server.listen(port, () => s.e.log(1, `Server up and listening on port ${port}.`, s))
            .on("error", (err) => {
            s.e.log(3, `Server listen error: "${err.message}".`, s);
        });
    }
    createLogServer(logger) {
        let s = this;
        let options = {
            order: "desc",
            fields: ["message"]
        };
        // Add index routes
        s.server.get(s.config.log_prefix, (req, res) => {
            logger.query(options, results => {
                res.json(results);
            });
        });
    }
    /**
     * Log _name
     * @returns {string}
     */
    toString() {
        return "Server";
    }
    /**
     * Adds a webhook to the server.
     * @param nest {WebhookNest}
     */
    addWebhook(nest) {
        let s = this;
        let e = s.e;
        let httpMethod = nest.httpMethod;
        let hook_path = s.config.hooks_prefix + nest.path;
        let hook_ui_path;
        let im = nest.interfaceManager;
        let wi = im.getInterface();
        hook_ui_path = s.config.hooks_ui_prefix + im.path;
        s.e.log(1, `Watching webhook ${httpMethod.toUpperCase()} ${hook_path}`, s);
        s.hookRoutes.push({
            id: nest.id,
            path: hook_path,
            nest: nest.name,
            tunnel: nest.tunnel.name,
            method: httpMethod,
            interface_path: hook_ui_path
        });
        s.server[httpMethod](hook_path, s.upload.any(), function (req, res) {
            let customHandler = nest.customHandleRequest;
            s.handleHookRequest(nest, req, res, customHandler);
        });
    }
    /**
     * Handles request and response of the web hook, creates a new job, as well as calling the nest's arrive.
     * @param nest {WebhookNest}
     * @param req {express.Request}
     * @param res {express.Response}
     * @param customHandler     Custom request handler.
     */
    handleHookRequest(nest, req, res, customHandler) {
        let s = this;
        // Job arrive
        let job = new webhookJob_1.WebhookJob(s.e, req, res);
        nest.arrive(job);
        s.sendHookResponse(nest.holdResponse, job, nest, req, res, customHandler);
    }
    ;
    /**
     * Sends the actual hook response.
     * @param holdResponse      Flag to bypass sending now for held responses.
     * @param job               Webhook job
     * @param nest              Webhook nest
     * @param req
     * @param res
     * @param customHandler
     * @param message
     */
    sendHookResponse(holdResponse, job, nest, req, res, customHandler, message) {
        if (holdResponse === true) {
            // do nothing
        }
        else if (customHandler) {
            job.responseSent = true;
            customHandler(req, res, job, nest);
        }
        else {
            job.responseSent = true;
            let response = {
                message: message || `Job ${job.id} was created!`,
                job: {
                    id: job.id,
                    name: job.name
                },
                nest: {
                    name: nest.name
                }
            };
            res.json(response);
        }
    }
    /**
     * Adds a webhook interface to the webhook server.
     * @param im {InterfaceManager}
     */
    addWebhookInterface(im) {
        let s = this;
        let nest = im.nest;
        let hook_path = s.config.hooks_prefix + nest.path;
        let hook_ui_path = s.config.hooks_ui_prefix + im.path;
        s.e.log(1, `Watching webhook interface GET ${hook_ui_path}`, s);
        this.hookInterfaceRoutes.push({
            id: nest.id,
            path: hook_ui_path,
            nest: nest.name,
            target: hook_path
            // tunnel: nest.getTunnel().name
        });
        s.server.get(hook_ui_path, function (req, res) {
            let customHandler = im.customHandleRequest;
            s.handleHookInterfaceRequest(im, req, res, customHandler);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map