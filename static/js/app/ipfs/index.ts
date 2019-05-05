import * as IPFS from '@npm/ipfs';
export const Buffer = IPFS.Buffer;

export class Ipfs {
    public static get me(this: any) {
        if (this['_me'] === undefined) {
            this['_me'] = window['IPFS'] = new IPFS({
                silent: true
            });
            return new Promise((resolve, reject) => {
                this['_me'].once('ready', () => {
                    resolve(this['_me']);
                });
                this['_me'].once('error', (e: any) => {
                    reject(e);
                });
            })
        }
        return Promise.resolve(this['_me']);
    }
}
window['Ipfs'] = Ipfs;
export default Ipfs;
