define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GoogleApi {
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = new GoogleApi();
            }
            return this['_me'];
        }
        constructor() {
            this._loadUrlTpl = 'https://apis.google.com/js/client.js?onload={0}';
        }
        get(callback, ms = 2048, n = 2) {
            if (typeof window.gapi !== 'undefined') {
                callback(window.gapi);
            }
            else {
                let timeout_id = setTimeout(() => {
                    if (n - 1 > 0) {
                        this.get(callback, ms, n - 1);
                    }
                    else {
                        callback(false);
                    }
                }, ms);
                window.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                    if (timeout_id) {
                        clearTimeout(timeout_id);
                    }
                    if (typeof window.gapi !== 'undefined') {
                        callback(window.gapi);
                    }
                    else {
                        callback(false);
                    }
                };
                $('body').append($('<script>', {
                    src: this._loadUrlTpl.replace('{0}', window.onGoogleApiClientLoad.name)
                }));
            }
        }
    }
    exports.GoogleApi = GoogleApi;
    exports.default = GoogleApi;
});
//# sourceMappingURL=google-api.js.map