import { NtxCertificateFactory } from './ntx-certificate-factory';
export { TransactionReceipt } from '@npm/web3-core';

export class Ethereum {
    public static get me() {
        if (this._me === undefined && window.ethereum) {
            this._me = window.ETHEREUM = new Ethereum(window.ethereum);
        }
        return this._me;
    }
    private constructor(provider: any) {
        provider.on('chainChanged', this.onChainChanged.bind(this));
        provider.on('accountsChanged', this.onAccountsChanged.bind(this));
        this._provider = provider;
    }
    private onAccountsChanged(accounts: string[]) {
        if (!accounts || !accounts.length) {
            $(this).trigger('disconnected', true);
        }
    }
    private onChainChanged(chain_id: string) {
        window.location.reload();
    }
    public get enabled(): boolean {
        return this._enabled;
    }
    public enable() {
        return new Promise((resolve) => {
            if (this.provider) {
                DocTitle.reuseOriginal();
                this.provider.sendAsync({
                    method: 'eth_requestAccounts'
                }, (
                    error: any, rpc: any
                ) => {
                    if (rpc && rpc.result && rpc.result.length) {
                        if (!this._enabled) {
                            this._enabled = true;
                            $(this).trigger('connected', true);
                        }
                        resolve(rpc.result[0]);
                    } else {
                        resolve(undefined);
                    }
                    DocTitle.reuseCurrent();
                });
            } else {
                resolve(undefined);
            }
        });
    }
    public disable() {
        if (this._enabled) {
            this._enabled = false;
            $(this).trigger('disconnected', true);
        }
    }
    public get chainId() {
        return new Promise<string | undefined>((resolve) => {
            if (this.provider) {
                this.provider.sendAsync({
                    method: 'eth_chainId'
                }, (
                    error: any, rpc: any
                ) => {
                    if (rpc && rpc.result && rpc.result.length) {
                        resolve(`0x${parseInt(rpc.result).toString(16)}`);
                    } else {
                        resolve(undefined);
                    }
                });
            } else {
                resolve(undefined);
            }
        });
    }
    public get address() {
        return new Promise<string | undefined>((resolve) => {
            if (this.provider) {
                this.provider.sendAsync({
                    method: 'eth_accounts'
                }, (
                    error: any, rpc: any
                ) => {
                    if (rpc && rpc.result && rpc.result.length) {
                        resolve(rpc.result[0]);
                    } else {
                        resolve(undefined);
                    }
                });
            } else {
                resolve(undefined);
            }
        });
    }
    public get supported() {
        return this.chainId.then((chain_id) => {
            switch (chain_id) {
                case '0x1':
                    return true; // ETH Mainnet
                case '0x2a':
                    return true; // ETH Kovan
                case '0xa86a':
                    return true; // AVA Mainnet
                case '0xa869':
                    return true; // AVA Fuji
                default:
                    return false;
            }
        });
    }
    public get explorer() {
        return new Promise<string | undefined>(async (resolve) => {
            const chain_id = await this.chainId;
            if (chain_id) {
                switch (chain_id.toLowerCase()) {
                    case '0x1': // ETH Mainnet
                        return resolve('https://etherscan.io');
                    case '0x2a': // ETH Kovan
                        return resolve('https://kovan.etherscan.io');
                    case '0xa86a': // AVA Mainnet
                        return resolve('https://cchain.explorer.avax.network');
                    case '0xa869': // AVA Fuji
                        return resolve('https://cchain.explorer.avax-test.network');
                    default:
                        return resolve(undefined);
                }
            } else {
                return resolve(undefined);
            }
        });
    }
    public tokenUrl(id: string) {
        return new Promise<string | undefined>(async (resolve) => {
            const chain_id = await this.chainId;
            if (chain_id) {
                const contract = NtxCertificateFactory.contract(chain_id);
                const explorer = await this.explorer;
                switch (chain_id.toLowerCase()) {
                    case '0x1': // ETH Mainnet
                        return resolve(`${explorer}/token/${contract}?a=${id}`);
                    case '0x2a': // ETH Kovan
                        return resolve(`${explorer}/token/${contract}?a=${id}`);
                    case '0xa86a': // AVA Mainnet
                        return resolve(`${explorer}/tokens/${contract}/instance/${id}`);
                    case '0xa869': // AVA Fuji
                        return resolve(`${explorer}/tokens/${contract}/instance/${id}`);
                    default:
                        return resolve(undefined);
                }
            } else {
                resolve(undefined);
                return;
            }
        });
    }
    // public logs(address: string) {
    //     window.SUBSCRIPTION = this.eth.then((eth) => eth.subscribe(
    //             'logs', { address }, (error: any, result: any) => {
    //                 console.log('[logs]', error, result);
    //             }
    //         )
    //         .on('data', (log) => {
    //             console.log('[logs:data]', log);
    //         })
    //         .on('changed', (log) => {
    //             console.log('[logs:changed]', log);
    //         })
    //     );
    // }
    // public sogl() {
    //     if (window.SUBSCRIPTION !== undefined) {
    //         window.SUBSCRIPTION.unsubscribe((
    //             error: any, success: boolean
    //         ) => {
    //             if (success) console.log('[=ok=]');
    //         })
    //     }
    // }
    private get provider() {
        return this._provider;
    }
    private _enabled = false;
    private _provider: any;
    private static _me: Ethereum;
}
class DocTitle {
    public static reuseOriginal() {
        this._title_previous = document.title;
        document.title = this._title_original;
    }
    public static reuseCurrent() {
        document.title = this._title_previous;
    }
    private static _title_original = document.title;
    private static _title_previous: string;
}
export default Ethereum;
