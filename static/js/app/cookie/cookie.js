define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/cookie/cookie.ts]');
    var Cookie = (function () {
        function Cookie() {
        }
        Cookie.set = function (name, value, expiry_ms) {
            var json = JSON.stringify(value);
            if (expiry_ms === undefined) {
                document.cookie = name + '=' + json;
            }
            else {
                var date = new Date();
                date.setTime(date.getTime() + expiry_ms);
                var expires = 'expires=' + date.toUTCString();
                document.cookie = name + '=' + json + '; ' + expires;
            }
            return value;
        };
        Cookie.prototype.set = function (name, value, expiry_ms) {
            return Cookie.set(name, value, expiry_ms);
        };
        Cookie.get = function (name, value) {
            var cookies = document.cookie.split(';'), cookie_name = name + '=', string;
            for (var i = 0; i < cookies.length; i++) {
                var cookie_1 = cookies[i];
                while (cookie_1.charAt(0) === ' ') {
                    cookie_1 = cookie_1.substring(1);
                }
                if (cookie_1.indexOf(cookie_name) === 0) {
                    string = cookie_1.substring(cookie_name.length, cookie_1.length);
                    break;
                }
            }
            if (string !== undefined)
                try {
                    return JSON.parse(string);
                }
                catch (ex) {
                    return value;
                }
            else {
                return value;
            }
        };
        Cookie.prototype.get = function (name, value) {
            return Cookie.get(name, value);
        };
        return Cookie;
    }());
    exports.cookie = new Cookie();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.cookie;
});
//# sourceMappingURL=cookie.js.map