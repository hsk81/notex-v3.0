define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:google-api.ts]');
    var GoogleApi = (function () {
        function GoogleApi() {
            this.loadUrlTpl = 'https://apis.google.com/js/client.js?onload={0}';
        }
        Object.defineProperty(GoogleApi, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new GoogleApi();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        GoogleApi.prototype.get = function (callback, ms, n) {
            var _this = this;
            if (ms === void 0) { ms = 2048; }
            if (n === void 0) { n = 2; }
            if (typeof window.gapi !== 'undefined') {
                callback(window.gapi);
            }
            else {
                var timeout_id_1 = setTimeout(function () {
                    if (n - 1 > 0) {
                        _this.get(callback, ms, n - 1);
                    }
                    else {
                        callback(false);
                    }
                }, ms);
                window.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                    if (timeout_id_1) {
                        clearTimeout(timeout_id_1);
                    }
                    if (typeof window.gapi !== 'undefined') {
                        callback(window.gapi);
                    }
                    else {
                        callback(false);
                    }
                };
                $('body').append($('<script>', {
                    src: this.loadUrlTpl.replace('{0}', window.onGoogleApiClientLoad.name)
                }));
            }
        };
        return GoogleApi;
    }());
    exports.GoogleApi = GoogleApi;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GoogleApi;
});
//# sourceMappingURL=google-api.js.map