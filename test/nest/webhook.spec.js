var should = require('chai').should();
var Antfarm = require('./../../lib/antfarm').default;

describe('Nest Webhook', function() {

    var options = {log_out_level: "error"};
    var af, tunnel, tmpobj;

    beforeEach(function() {
        af = new Antfarm(options);
        tunnel = af.createTunnel("Nest testing");
    });

    describe('_path', function() {
        it('should accept a string as the _path and add a /', function() {
            var wh = af.createWebhookNest("path1");
            wh.path.should.not.be.empty;
            wh.path.should.equal("/path1");
        });
        it('should encode unsafe URI characters', function() {
            var wh = af.createWebhookNest("_path&&11 something");
            wh.path.should.equal("/_path%26%2611%20something");
        });
        it('should accept an array of URI components', function() {
            var wh = af.createWebhookNest(["path1", "path2", "_path 3"]);
            wh.path.should.equal("/path1/path2/_path%203");
        });
    });

    describe('http method', function() {
        it('should default the http method to all', function() {
            var wh = af.createWebhookNest("path1");
            wh.httpMethod.should.not.be.empty;
            wh.httpMethod.should.equal("all");
        });
        it('should be changeable in the constructor', function() {
            var wh = af.createWebhookNest("path1", "get");
            wh.httpMethod.should.equal("get");
        });
        it('should convert to lowercase', function() {
            var wh = af.createWebhookNest("path1", "POST");
            wh.httpMethod.should.equal("post");
        });
        it('should allow any valid http method', function(done) {
            var acceptableMethods = [ "get", "post", "put", "head", "delete", "options", "trace", "copy", "lock", "mkcol", "move", "purge", "propfind", "proppatch", "unlock", "report", "mkactivity", "checkout", "merge", "m-search", "notify", "subscribe", "unsubscribe", "patch", "search", "connect", "all" ];

            acceptableMethods.forEach(function(method){
                var wh = af.createWebhookNest("path1", method.toUpperCase());
                wh.httpMethod.should.equal(method);
            });
            done();
        });
    });


});

