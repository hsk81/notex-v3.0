import { NtxCertificateFactory } from './ntx-certificate-factory';
export { TransactionReceipt } from '@npm/web3-core';
import { Blockchain } from './blockchain';

export class Ethereum {
    public static get me() {
        if (this._me === undefined && window.ethereum) {
            this._me = window.ETHEREUM = new Ethereum(Blockchain.provider);
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
    private onChainChanged() {
        window.location.reload();
    }
    public get enabled(): boolean {
        return this._enabled;
    }
    public enable() {
        return new Promise(async (resolve) => {
            if (this.provider) {
                DocTitle.reuseOriginal();
                if (await this.suggest('avalanche')) try {
                    await this.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xa86a',
                            chainName: 'Avalanche Mainnet',
                            nativeCurrency: {
                                name: 'AVAX',
                                symbol: 'AVAX',
                                decimals: 18
                            },
                            rpcUrls: [
                                'https://api.avax.network/ext/bc/C/rpc'
                            ],
                            blockExplorerUrls: [
                                'https://snowtrace.io/'
                            ]
                        }]
                    });
                } catch (ex) {
                    await this.suggest('avalanche', false);
                    console.error(ex);
                }
                try {
                    const accounts = await this.provider.request({
                        method: 'eth_requestAccounts'
                    });
                    if (accounts && accounts.length) {
                        if (!this._enabled) {
                            this._enabled = true;
                            $(this).trigger('connected', true);
                        }
                        resolve(accounts[0]);
                    } else {
                        resolve(undefined);
                    }
                } catch (ex) {
                    resolve(undefined);
                }
                DocTitle.reuseCurrent();
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
        return new Promise<string | undefined>(async (resolve) => {
            if (this.provider) try {
                const chain_id = await this.provider.request({
                    method: 'eth_chainId'
                });
                if (chain_id && chain_id.length) {
                    resolve(`0x${parseInt(chain_id).toString(16)}`);
                } else {
                    resolve(undefined);
                }
            } catch (ex) {
                resolve(undefined);
            } else {
                resolve(undefined);
            }
        });
    }
    public get address() {
        return new Promise<string | undefined>(async (resolve) => {
            if (this.provider) try {
                const accounts = await this.provider.request({
                    method: 'eth_accounts'
                });
                if (accounts && accounts.length) {
                    resolve(accounts[0]);
                } else {
                    resolve(undefined);
                }
            } catch (ex) {
                resolve(undefined);
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
                        return resolve('https://snowtrace.io');
                    case '0xa869': // AVA Fuji
                        return resolve('https://testnet.snowtrace.io');
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
                        return resolve(`${explorer}/token/${contract}?a=${id}`);
                    case '0xa869': // AVA Fuji
                        return resolve(`${explorer}/token/${contract}?a=${id}`);
                    default:
                        return resolve(undefined);
                }
            } else {
                resolve(undefined);
                return;
            }
        });
    }
    private async suggest(
        network: 'avalanche' | 'ethereum', value?: boolean
    ) {
        window.SUGGEST = { ...window.SUGGEST };
        if (typeof value === 'boolean') {
            return window.SUGGEST[network] = value;
        }
        if (typeof window.SUGGEST[network] === 'boolean') {
            return window.SUGGEST[network];
        };
        switch (network) {
            case 'avalanche':
                value = await this.isAvalanche === false;
                break;
            case 'ethereum':
                value = await this.isEthereum === false;
                break;
        }
        return window.SUGGEST[network] = value;
    }
    private get isAvalanche() {
        return this.chainId.then((id) => id === '0xa86a' || id === '0xa869');
    }
    private get isEthereum() {
        return this.chainId.then((id) => id === '0x1' || id === '0x2a');
    }
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
