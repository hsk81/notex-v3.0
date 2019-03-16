define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Cookie {
        static set(name, value, expiry_ms) {
            let json = JSON.stringify(value);
            if (expiry_ms === undefined) {
                document.cookie = name + '=' + json;
            }
            else {
                let date = new Date();
                date.setTime(date.getTime() + expiry_ms);
                let expires = 'expires=' + date.toUTCString();
                document.cookie = name + '=' + json + '; ' + expires;
            }
            return value;
        }
        set(name, value, expiry_ms) {
            return Cookie.set(name, value, expiry_ms);
        }
        static get(name, value) {
            let cookies = document.cookie.split(';'), cookie_name = name + '=', string;
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(cookie_name) === 0) {
                    string = cookie.substring(cookie_name.length, cookie.length);
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
        }
        get(name, value) {
            return Cookie.get(name, value);
        }
    }
    exports.cookie = new Cookie();
    exports.default = exports.cookie;
});
//# sourceMappingURL=cookie.js.map