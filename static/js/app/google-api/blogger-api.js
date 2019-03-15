define(["require", "exports", "./google-api"], function (require, exports, google_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BloggerApi = /** @class */ (function () {
        function BloggerApi() {
            this._options = {
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
        BloggerApi.prototype.get = function (callback, ms, n) {
            var _this = this;
            if (ms === void 0) { ms = 2048; }
            if (n === void 0) { n = 2; }
            google_api_1.default.me.get(function (gapi) {
                if (gapi) {
                    var timeout_id1_1 = setTimeout(function () {
                        if (n - 1 > 0) {
                            _this.get(callback, ms, n - 1);
                        }
                        else {
                            callback(false);
                        }
                    }, ms);
                    var on_fail_1 = function (res) {
                        if (timeout_id1_1)
                            clearTimeout(timeout_id1_1);
                        console.error('[with:google-api/fail]', res);
                        callback(false);
                    };
                    var on_done_1 = function (res) {
                        if (timeout_id1_1) {
                            clearTimeout(timeout_id1_1);
                        }
                        if (res.error)
                            switch (res.error) {
                                case 'immediate_failed':
                                    var opts_1 = $.extend({}, _this._options, { immediate: false });
                                    gapi.auth.authorize(opts_1, on_done_1, on_fail_1);
                                    callback(false);
                                    break;
                                default:
                                    console.error('[with:google-api/done]', res);
                                    callback(false);
                                    return;
                            }
                        else if (gapi.client.blogger === undefined) {
                            var timeout_id2_1 = setTimeout(function () {
                                if (n - 1 > 0) {
                                    _this.get(callback, ms, n - 1);
                                }
                                else {
                                    callback(false);
                                }
                            }, ms);
                            gapi.client.load('blogger', 'v3').then(function () {
                                if (timeout_id2_1)
                                    clearTimeout(timeout_id2_1);
                                callback(gapi.client.blogger, _this._options);
                            });
                        }
                        else {
                            callback(gapi.client.blogger, _this._options);
                        }
                    };
                    var opts = $.extend({}, _this._options, { immediate: true });
                    gapi.auth.authorize(opts, on_done_1, on_fail_1);
                }
                else {
                    callback(false);
                }
            });
        };
        return BloggerApi;
    }());
    exports.BloggerApi = BloggerApi;
    exports.default = BloggerApi;
});
//# sourceMappingURL=blogger-api.js.map