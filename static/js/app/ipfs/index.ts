import { cookie } from "../cookie/cookie";
import * as Ipfs from '@npm/ipfs';
export const Buffer = Ipfs.Buffer;

export const html = (
    head: string, body: string
) => {
    return `<!DOCTYPE html>`
        + `<html>`
        + `<head>`
            + `<meta charset="utf-8"/>`
            + `<meta name="viewport" content="width=device-width,initial-scale=1"/>`
            + `${head}`
            + `<style>`
            + `body {`
                + `margin: 0 auto;`
                + `padding: 1em;`
                + `max-width: 768px;`
            + `}`
            + `<style>`
        + `</head>`
        + `<body>${body}</body>`
        + `</html>`;
}
export const gateway = {
    get: function (
        value = 'https://ipfs.io/ipfs'
    ) {
        const normalize = (url?: string) => {
            if (typeof url === 'string') {
                return url.replace(/\/+$/, '/');
            }
            return url;
        }
        return normalize(
            cookie.get('ipfs-gateway', value));
    },
    set: function (
        value?: string
    ) {
        cookie.set('ipfs-gateway', value);
    }
};
export class IPFS {
    public static async me(
        this: any, callback?: Function
    ) {
        if (this['_me'] === undefined) {
            this['_me'] = await Ipfs.create({
                silent: false
            });
        }
        if (callback !== undefined) {
            callback(this['_me']);
        }
        return this['_me'];
    }
}
window['IPFS'] = IPFS;
export default IPFS;
