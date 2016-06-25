define(["require", "exports", "../function/assert"], function (require, exports, assert_1) {
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
        GoogleApi.prototype.get = function (callback) {
            if (typeof window.gapi === 'undefined') {
                window.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                    if (typeof callback === 'function') {
                        callback(assert_1.default(window.gapi, 'gapi'));
                    }
                };
                $('body').append($('<script>', {
                    src: this.loadUrlTpl.replace('{0}', window.onGoogleApiClientLoad.name)
                }));
            }
            else {
                callback(window.gapi);
            }
        };
        return GoogleApi;
    }());
    exports.GoogleApi = GoogleApi;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GoogleApi;
});
//# sourceMappingURL=google-api.js.map