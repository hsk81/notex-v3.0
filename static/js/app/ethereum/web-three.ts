declare const require: Function;
import Web3 from '@npm/web3';

export class WebThree {
    public static get me() {
        if (this._me === undefined && window.ethereum) {
            this._me = new WebThree(window.ethereum);
        }
        return this._me;
    }
    private constructor(provider: any) {
        this._provider = provider;
    }
    public get eth() {
        return this.fetch().then((web3) => web3.eth);
    }
    private fetch() {
        return new Promise<Web3>((resolve) => {
            require(['@npm/web3.min.js'], (Web3: any) => {
                resolve(new Web3(this._provider));
            });
        });
    }
    private _provider: any;
    private static _me: WebThree;
};
export default WebThree;
