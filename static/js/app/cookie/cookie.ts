interface ICookie {
    set:<T>(name:string, value:T, expiry_ms?:number)=> T;
    get:<T>(name:string, value?:T)=> T;
}

interface Window {
    cookie:ICookie;
}

window.cookie = class Cookie implements ICookie {
    static set<T>(name:string, value:T, expiry_ms?:number):T {
        let json = JSON.stringify(value);
        if (expiry_ms === undefined) {
            document.cookie = name + '=' + json;
        } else {
            let date = new Date();
            date.setTime(date.getTime() + expiry_ms);
            let expires = 'expires=' + date.toUTCString();
            document.cookie = name + '=' + json + '; ' + expires;
        }
        return value;
    }
    set<T>(name:string, value:T, expiry_ms?:number):T {
        return Cookie.set(name, value, expiry_ms);
    }

    static get<T>(name:string, value?:T):T {
        let cookies = document.cookie.split(';'),
            cookie_name = name + '=',
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
    get<T>(name:string, value?:T):T {
        return Cookie.get(name, value);
    }
};
