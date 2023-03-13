import { BigNumber, Contract, ContractInterface, Event, providers, Transaction } from 'ethers';
import { Ethereum } from './ethereum';

export type OnTransfer = (
    from: string,
    to: string,
    id: BigNumber,
    ev: Event
) => void;

export class NtxCertificate {
    public constructor(address: string) {
        this._address = address;
    }
    public async publish(token_uri: string, from: string): Promise<bigint | undefined> {
        const contract = await this.contract();
        if (contract) return new Promise(async (resolve) => {
            const on_transfer: OnTransfer = (
                from, to, id, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                console.debug('[on:transfer]', from, to, id, ev)
                resolve(id.toBigInt());
            };
            contract.on('Transfer', on_transfer);
            let tx: Transaction | undefined;
            try {
                tx = await contract.publish(from, token_uri) as Transaction;
                console.debug('[publish]', tx);
            } catch (ex) {
                resolve(undefined);
                console.error(ex);
            }
        });
    }
    public async burn(token_id: string): Promise<Transaction | undefined> {
        const contract = await this.contract();
        if (contract) {
            const on_transfer: OnTransfer = (
                from, to, id, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                console.debug('[on:transfer]', from, to, id, ev)
            };
            contract.on('Transfer', on_transfer);
            let tx: Transaction | undefined;
            try {
                tx = await contract.burn(token_id);
                console.debug('[burn]', tx);
            } catch (ex) {
                console.error(ex);
            }
            return tx;
        }
    }
    public async balanceOf(address: string): Promise<bigint | undefined> {
        const contract = await this.contract();
        if (contract) {
            return contract.balanceOf(address).then((bn: BigNumber) => bn.toBigInt());
        }
    }
    public async tokenByIndex(index: number): Promise<bigint | undefined> {
        const contract = await this.contract();
        if (contract) {
            return contract.tokenOfOwnerByIndex(index).then(
                (bn: BigNumber) => bn.toBigInt()
            );
        }
    }
    public async tokenOfOwnerByIndex(owner: string, index: number): Promise<bigint | undefined> {
        const contract = await this.contract();
        if (contract) {
            return contract.tokenOfOwnerByIndex(owner, index).then(
                (bn: BigNumber) => bn.toBigInt()
            )
        }
    }
    public async tokens(owner: string, options?: {
        page?: number, page_size?: number
    }): Promise<bigint[]> {
        const balance = await this.balanceOf(owner);
        if (balance !== undefined) {
            const indices = this.indices({
                ...options, length: Number(balance)
            });
            const tokens = await Promise.all(indices.map(
                (index) => this.tokenOfOwnerByIndex(owner, index)
            ));
            return tokens.filter((t) => t !== undefined).map((t) => t!)
        };
        return await Promise.all([]);
    }
    public async tokenURI(token_id: bigint): Promise<string | undefined> {
        const contract = await this.contract();
        if (contract) {
            const uri = await contract.tokenURI(`${token_id}`);
            if (typeof uri === 'string') {
                return uri;
            }
        }
    }
    public async tokenURIs(owner: string, options?: {
        page?: number, page_size?: number
    }): Promise<{ id: bigint, value: string }[]> {
        const tokens = await this.tokens(owner, options);
        if (tokens) {
            const uris = await Promise.all(tokens
                .filter((id) => id !== undefined)
                .map((id) => this.tokenURI(id!))
            );
            return uris.map((u, i) => ({
                id: tokens[i]!, value: u!
            }));
        }
        return [];
    }
    private indices(options: {
        page?: number, page_size?: number, length: number
    }): number[] {
        const {
            length, page, page_size
        } = {
            length: options.length,
            page: options.page ?? 0,
            page_size: options.page_size ?? options.length,
        };
        const [start, end] = [
            page_size * page, page_size * (page + 1)
        ];
        const array = Array<number>(
            start < length ? page_size : 0
        );
        return [...array.keys()]
            .map((index) => start + index)
            .slice(0, end <= length ? end : length % page_size);
    }
    private async contract() {
        if (this._contract === undefined) {
            const address = this._address;
            if (address) {
                const abi = await this.abi();
                if (abi) {
                    const contract = window.CONTRACT = new Contract(
                        this._address, abi
                    );
                    const provider = await this.provider;
                    if (provider) {
                        const w3p = new providers.Web3Provider(provider);
                        this._contract = contract.connect(w3p.getSigner());
                    } else {
                        this._contract = contract;
                    }
                }
            }
        }
        return this._contract;
    }
    private get provider() {
        return Ethereum.me.provider;
    }
    private async abi() {
        if (this._abi === undefined) {
            const url = '/static/js/app/ethereum/ntx-certificate.abi.json';
            this._abi = await fetch(url).then((res) => res.json());
        }
        return this._abi;
    }
    private _abi?: ContractInterface;
    private _contract?: Contract;
    private _address: string;
};
export default NtxCertificate;
