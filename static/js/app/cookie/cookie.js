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
    };
    Cookie.get = function (name, value) {
        var cookie_name = name + '=', cookies = document.cookie.split(';'), string;
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
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
    };
    return Cookie;
}());
window.cookie = Cookie;
//# sourceMappingURL=cookie.js.map