import detectProvider from '@metamask/detect-provider';
import { providers } from 'ethers';
import { EventEmitter } from 'events';
import { Chain, ChainId } from './chain';
import { NtxCertificateFactory } from './ntx-certificate-factory';

export type Provider
    = providers.ExternalProvider & EventEmitter;

export class Ethereum {
    public static get me() {
        if (this._me === undefined && window.ethereum) {
            this._me = window.ETHEREUM = new Ethereum(detectProvider());
        }
        return this._me;
    }
    private constructor(provider: Promise<Provider | null>) {
        provider.then(
            (p) => p?.on('chainChanged', this.onChainChanged.bind(this))
        );
        provider.then(
            (p) => p?.on('accountsChanged', this.onAccountsChanged.bind(this))
        );
        this._provider = provider;
    }
    private onAccountsChanged(accounts: string[]) {
        if (!accounts || !accounts.length) {
            $(this).trigger('disconnected', true);
        }
        window.location.reload();
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
                    const ava = new Chain(ChainId.AVALANCHE_MAINNET);
                    await this.provider.then((p) => p?.request?.({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: ava.id,
                            chainName: ava.name,
                            nativeCurrency: ava.currency,
                            rpcUrls: ava.rpcUrls,
                            blockExplorerUrls: ava.explorerUrls
                        }]
                    }));
                } catch (ex) {
                    await this.suggest('avalanche', false);
                    console.error(ex);
                }
                try {
                    const accounts = await this.provider.then(
                        (p) => p?.request?.({ method: 'eth_requestAccounts' })
                    );
                    if (accounts && accounts.length && !this._enabled) {
                        $(this).trigger('connected', this._enabled = true);
                    }
                    if (accounts && accounts.length) {
                        resolve(accounts[0]);
                    } else {
                        resolve(undefined);
                    }
                } catch (ex) {
                    resolve(undefined);
                    console.error(ex);
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
    public get chain() {
        return new Promise<Chain | undefined>(async (resolve) => {
            if (this.provider) try {
                const chain_id = await this.provider.then(
                    (p) => p?.request?.({ method: 'eth_chainId' })
                );
                if (typeof chain_id === 'string') {
                    return resolve(new Chain(chain_id));
                }
            } catch (ex) {
                console.error(ex);
            }
            resolve(undefined);
        });
    }
    public get chainId(): Promise<ChainId | undefined> {
        return this.chain.then((c) => c?.id);
    }
    public get address() {
        return new Promise<string | undefined>(async (resolve) => {
            if (this.provider) try {
                const accounts = await this.provider.then(
                    (p) => p?.request?.({ method: 'eth_accounts' })
                );
                if (accounts && accounts.length) {
                    return resolve(accounts[0]);
                }
            } catch (ex) {
                console.error(ex);
            }
            resolve(undefined);
        });
    }
    public get supported(): Promise<boolean> {
        return this.chain.then((c) => Boolean(c?.id));
    }
    public get explorer(): Promise<string | undefined> {
        return this.chain.then((c) => c?.explorerUrls[0]);
    }
    public tokenUrl(id: number) {
        return new Promise<string | undefined>(async (resolve) => {
            const chain_id = await this.chainId;
            if (chain_id) {
                const contract = NtxCertificateFactory.contract(chain_id);
                resolve(`${await this.explorer}/token/${contract}?a=${id}`);
            } else {
                resolve(undefined);
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
        return this.chainId.then((id) =>
            id === ChainId.AVALANCHE_MAINNET ||
            id === ChainId.AVALANCHE_FUJI
        );
    }
    private get isEthereum() {
        return this.chainId.then((id) =>
            id === ChainId.ETHEREUM_MAINNET ||
            id === ChainId.ETHEREUM_GOERLI
        );
    }
    public get provider() {
        return this._provider;
    }
    private _enabled = false;
    private static _me: Ethereum;
    private _provider: Promise<Provider | null>;
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
