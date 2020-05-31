import { cookie } from "../cookie/cookie";
import * as Ipfs from '@npm/ipfs';
export const Buffer = Ipfs.Buffer;

export const html = async (head: string, body: string) => {
    const link_1 = /<link\s+rel="icon"\s+href(="")?\s*\/?>/gi;
    const link_2 = /<link\s+href(="")?\s+rel="icon"\s*\/?>/gi;
    {
        const icon = async function (
            path = '/static/ico/favicon.ico'
        ) {
            return await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function () {
                    resolve(reader.result as string);
                };
                fetch(path)
                    .then((res) => res.blob())
                    .then((blob) => reader.readAsDataURL(blob));
            })
        };
        if (head.match(link_1)) head = head.replace(
            link_1, `<link rel="icon" href="${await icon()}"/>`
        );
        if (head.match(link_2)) head = head.replace(
            link_2, `<link href="${await icon()}" rel="icon"/>`
        );
    }
    return `<!DOCTYPE html>`
        + `<html>`
        + `<head>${head}</head>`
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
