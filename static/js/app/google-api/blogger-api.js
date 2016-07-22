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
                if (this['_me'] === undefined) {
                    this['_me'] = new BloggerApi();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        BloggerApi.prototype.get = function (callback) {
            var _this = this;
            google_api_1.default.me.get(function (gapi) {
                if (timeout_id1) {
                    clearTimeout(timeout_id1);
                }
                var on_done = function (res) {
                    if (timeout_id2) {
                        clearTimeout(timeout_id2);
                    }
                    if (res.error)
                        switch (res.error) {
                            case 'immediate_failed':
                                var opts = $.extend({}, _this.options, { immediate: false });
                                gapi.auth.authorize(opts, on_done, on_fail);
                                if (typeof callback === 'function') {
                                    callback(false);
                                }
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
                    if (timeout_id2) {
                        clearTimeout(timeout_id2);
                    }
                    if (typeof callback === 'function') {
                        callback(false);
                    }
                    console.error('[with:google-api/fail]', res);
                };
                var timeout_id2 = setTimeout(function () {
                    if (typeof callback === 'function') {
                        callback(false);
                    }
                }, 4096);
                gapi.auth.authorize($.extend({}, _this.options, { immediate: true }), on_done, on_fail);
            });
            var timeout_id1 = setTimeout(function () {
                if (typeof callback === 'function') {
                    callback(false);
                }
            }, 4096);
        };
        return BloggerApi;
    }());
    exports.BloggerApi = BloggerApi;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BloggerApi;
});
//# sourceMappingURL=blogger-api.js.map