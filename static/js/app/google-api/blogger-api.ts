import GoogleApi from "./google-api";

export class BloggerApi {
    public static get me() {
        if (window.BLOGGER_API === undefined) {
            window.BLOGGER_API = new BloggerApi();
        }
        return window.BLOGGER_API;
    }
    public constructor() {
        this._options = {
            client_id: '451381712046-9tihtvejim1r84uld3i3igu3983p0qvi.apps.googleusercontent.com',
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
