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
            var on_done = (res) => {
                if (res.error) switch (res.error) {
                    case 'immediate_failed':
                        gapi.auth.authorize($.extend(
                            {}, this.options, {immediate: false}),
                            on_done, on_fail);
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
            var on_fail = (res) => {
                if (typeof callback === 'function') {
                    callback(false);
                }
                console.error('[with:google-api/fail]', res);
            };
            gapi.auth.authorize($.extend(
                {}, this.options, {immediate: true}), on_done, on_fail);
        });
    }

    private options:any;
}

///////////////////////////////////////////////////////////////////////////////

export default BloggerApi;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
