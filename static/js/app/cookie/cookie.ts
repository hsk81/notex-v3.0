class Cookie {
    static set(name:string, value:any, expiry_ms?:number):void {
        let json = JSON.stringify(value);
        if (expiry_ms === undefined) {
            document.cookie = name + '=' + json;
        } else {
            let date = new Date();
            date.setTime(date.getTime() + expiry_ms);
            let expires = 'expires=' + date.toUTCString();
            document.cookie = name + '=' + json + '; ' + expires;
        }
    }

    static get(name:string, value:any):any {
        let cookie_name = name + '=',
            cookies = document.cookie.split(';'),
            string;

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

        if (string !== undefined) try {
            return JSON.parse(string);
        } catch (ex) {
            return value;
        } else {
            return value;
        }
    }
}

interface Window {
    cookie:Cookie;
}

window.cookie = Cookie;
