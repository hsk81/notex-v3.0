///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:google-api.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import assert from "../function/assert";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

interface Window {
    onGoogleApiClientLoad:Function;
    gapi:any;
}

declare let window:Window;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class GoogleApi {
    static get me():GoogleApi {
        if (this['_me'] === undefined) {
            this['_me'] = new GoogleApi();
        }
        return this['_me'];
    }

    constructor() {
        this.loadUrlTpl = 'https://apis.google.com/js/client.js?onload={0}';
    }

    get(callback:Function, ms:number = 2048, n:number = 2) {
        if (typeof window.gapi !== 'undefined') {
            callback(window.gapi);
        } else {
            let timeout_id = setTimeout(() => {
                if (n - 1 > 0) {
                    this.get(callback, ms, n - 1);
                } else {
                    callback(false);
                }
            }, ms);
            window.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                if (timeout_id) {
                    clearTimeout(timeout_id);
                }
                if (typeof window.gapi !== 'undefined') {
                    callback(window.gapi);
                } else {
                    callback(false);
                }
            };
            $('body').append($('<script>', {
                src: this.loadUrlTpl.replace(
                    '{0}', window.onGoogleApiClientLoad.name
                )
            }));
        }
    }

    private loadUrlTpl:string;
}

///////////////////////////////////////////////////////////////////////////////

export default GoogleApi;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
