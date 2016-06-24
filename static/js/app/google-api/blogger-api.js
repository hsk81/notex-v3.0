define(["require", "exports", "./google-api"], function (require, exports, google_api_1) {
    "use strict";
    console.debug('[import:blogger-api.ts]');
    var BloggerApi = (function () {
        function BloggerApi() {
            this.options = {
                client_id: '284730785285-47g372rrd92mbv201ppb8spmj6kff18m',
                scope: 'https://www.googleapis.com/auth/blogger'
            };
        }
        Object.defineProperty(BloggerApi, "me", {
            get: function () {
                return new BloggerApi();
            },
            enumerable: true,
            configurable: true
        });
        BloggerApi.prototype.get = function (callback) {
            var _this = this;
            google_api_1.default.me.get(function (gapi) {
                var on_done = function (res) {
                    if (res.error)
                        switch (res.error) {
                            case 'immediate_failed':
                                gapi.auth.authorize($.extend({}, _this.options, { immediate: false }), on_done, on_fail);
                                break;
                            default:
                                if (typeof callback === 'function') {
                                    callback(false);
                                }
                                console.error('[with:google-api/done]', res);
                                return;
                        }
                    else if (gapi.client.blogger === undefined) {
                        gapi.client.load('blogger', 'v3').then(function () {
                            if (typeof callback === 'function') {
                                callback(gapi.client.blogger, _this.options);
                            }
                        });
                    }
                    else {
                        if (typeof callback === 'function') {
                            callback(gapi.client.blogger, _this.options);
                        }
                    }
                };
                var on_fail = function (res) {
                    if (typeof callback === 'function') {
                        callback(false);
                    }
                    console.error('[with:google-api/fail]', res);
                };
                gapi.auth.authorize($.extend({}, _this.options, { immediate: true }), on_done, on_fail);
            });
        };
        return BloggerApi;
    }());
    exports.BloggerApi = BloggerApi;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BloggerApi;
});
//# sourceMappingURL=blogger-api.js.map