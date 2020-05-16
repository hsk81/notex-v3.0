import GoogleApi from "./google-api";

export class BloggerApi {
    public static get me(this: any): BloggerApi {
        if (this['_me'] === undefined) {
            this['_me'] = new BloggerApi();
        }
        return this['_me'];
    }

    public constructor() {
        this._options = {
            client_id: '284730785285-47g372rrd92mbv201ppb8spmj6kff18m',
            scope: 'https://www.googleapis.com/auth/blogger'
        };
    }

    public get(callback: Function, ms: number = 2048, n: number = 2) {
        GoogleApi.me.get((gapi: any) => {
            if (gapi) {
                const timeout_id1 = setTimeout(() => {
                    if (n - 1 > 0) {
                        this.get(callback, ms, n - 1);
                    } else {
                        callback(false);
                    }
                }, ms);
                const on_fail = (res: any) => {
                    if (timeout_id1) clearTimeout(timeout_id1);
                    console.error('[with:google-api/fail]', res);
                    callback(false);
                };
                const on_done = (res: any) => {
                    if (timeout_id1) {
                        clearTimeout(timeout_id1);
                    }
                    if (res.error) switch (res.error) {
                        case 'immediate_failed':
                            const opts = $.extend(
                                {}, this._options, { immediate: false });
                            gapi.auth.authorize(
                                opts, on_done, on_fail);
                            callback(false);
                            break;
                        default:
                            console.error('[with:google-api/done]', res);
                            callback(false);
                            return;
                    } else if (gapi.client.blogger === undefined) {
                        const timeout_id2 = setTimeout(() => {
                            if (n - 1 > 0) {
                                this.get(callback, ms, n - 1);
                            } else {
                                callback(false);
                            }
                        }, ms);
                        gapi.client.load('blogger', 'v3').then(() => {
                            if (timeout_id2) clearTimeout(timeout_id2);
                            callback(gapi.client.blogger, this._options);
                        });
                    } else {
                        callback(gapi.client.blogger, this._options);
                    }
                };
                const opts = $.extend(
                    {}, this._options, { immediate: true }
                );
                gapi.auth.authorize(
                    opts, on_done, on_fail
                );
            } else {
                callback(false);
            }
        });
    }
    private _options: any;
}

export default BloggerApi;
