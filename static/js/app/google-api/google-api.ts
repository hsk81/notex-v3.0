export class GoogleApi {
    public static get me() {
        if (window.GOOGLE_API === undefined) {
            window.GOOGLE_API = new GoogleApi();
        }
        return window.GOOGLE_API;
    }
    public constructor() {
        this._loadUrlTpl = 'https://apis.google.com/js/client.js?onload={0}';
    }
    public get(callback: Function, ms: number = 2048, n: number = 2) {
        if (typeof window.gapi !== 'undefined') {
            callback(window.gapi);
        } else {
            const timeout_id = setTimeout(() => {
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
                src: this._loadUrlTpl.replace(
                    '{0}', window.onGoogleApiClientLoad.name
                )
            }));
        }
    }
    private _loadUrlTpl: string;
}
export default GoogleApi;
