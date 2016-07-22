///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:blogger-api.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import GoogleApi from "./google-api";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class BloggerApi {
    static get me():BloggerApi {
        if (this['_me'] === undefined) {
            this['_me'] = new BloggerApi();
        }
        return this['_me'];
    }

    constructor() {
        this.options = {
            client_id: '284730785285-47g372rrd92mbv201ppb8spmj6kff18m',
            scope: 'https://www.googleapis.com/auth/blogger'
        };
    }

    get(callback:Function) {
        GoogleApi.me.get((gapi) => {
            if (timeout_id1) {
                clearTimeout(timeout_id1);
            }
            let on_done = (res) => {
                if (timeout_id2) {
                    clearTimeout(timeout_id2);
                }
                if (res.error) switch (res.error) {
                    case 'immediate_failed':
                        let opts = $.extend(
                            {}, this.options, {immediate: false});
                        gapi.auth.authorize(
                            opts, on_done, on_fail);
                        if (typeof callback === 'function') {
                            callback(false);
                        }
                        break;
                    default:
                        if (typeof callback === 'function') {
                            callback(false);
                        }
                        console.error('[with:google-api/done]', res);
                        return;
                } else if (gapi.client.blogger === undefined) {
                    gapi.client.load('blogger', 'v3').then(() => {
                        if (typeof callback === 'function') {
                            callback(gapi.client.blogger, this.options);
                        }
                    });
                } else {
                    if (typeof callback === 'function') {
                        callback(gapi.client.blogger, this.options);
                    }
                }
            };

            let on_fail = (res) => {
                if (timeout_id2) {
                    clearTimeout(timeout_id2);
                }
                if (typeof callback === 'function') {
                    callback(false);
                }
                console.error('[with:google-api/fail]', res);
            };

            let timeout_id2 = setTimeout(() => {
                if (typeof callback === 'function') {
                    callback(false);
                }
            }, 4096);

            gapi.auth.authorize($.extend(
                {}, this.options, {immediate: true}), on_done, on_fail);
        });

        let timeout_id1 = setTimeout(() => {
            if (typeof callback === 'function') {
                callback(false);
            }
        }, 4096);
    }

    private options:any;
}

///////////////////////////////////////////////////////////////////////////////

export default BloggerApi;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
