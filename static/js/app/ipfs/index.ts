import * as Ipfs from '@npm/ipfs';
export const Buffer = Ipfs.Buffer;

export class IPFS {
    public static async me(this: any, callback?: Function) {
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
