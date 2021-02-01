import { AbiItem } from "@npm/web3-utils";
import { Contract } from "@npm/web3-eth-contract";
import { PromiEvent } from "@npm/web3-core";
import { TransactionReceipt } from "@npm/web3-core";
import { WebThree } from "./web-three";

export class NtxCertificate {
    public constructor(address: string) {
        this._address = address;
    }
    public async publish(author: string, tokenURI: string) {
        const contract = await this.contract();
        if (contract) {
            const tx = await contract.methods.publish(author, tokenURI).send({
                from: author
            });
            return tx as PromiEvent<TransactionReceipt>;
        }
    }
    public async balanceOf(address: string) {
        const contract = await this.contract();
        if (contract) {
            const balance = await contract.methods.balanceOf(address).call();
            try {
                return parseInt(balance);
            } catch (ex) {
                console.warn(ex);
            }
        }
    }
    public async tokenByIndex(index: number) {
        const contract = await this.contract();
        if (contract) {
            const id = await contract.methods.tokenOfOwnerByIndex(index).call()
            if (typeof id === 'string') {
                return id;
            }
        }
    }
    public async tokenOfOwnerByIndex(owner: string, index: number) {
        const contract = await this.contract();
        if (contract) {
            const id = await contract.methods.tokenOfOwnerByIndex(owner, index).call()
            if (typeof id === 'string') {
                return id;
            }
        }
    }
    public async tokens(owner: string, options?: {
        page?: number, page_size?: number
    }) {
        const balance = await this.balanceOf(owner);
        if (typeof balance === 'number') {
            const indices = this.indices({
                ...options, length: balance
            });
            const tokens = indices.map(
                (index) => this.tokenOfOwnerByIndex(owner, index)
            );
            return await Promise.all(tokens);
        };
    }
    public async tokenURI(token_id: string) {
        const contract = await this.contract();
        if (contract) {
            const uri = await contract.methods.tokenURI(token_id).call();
            if (typeof uri === 'string') {
                return uri;
            }
        }
    }
    public async tokenURIs(owner: string, options?: {
        page?: number, page_size?: number
    }) {
        const tokens = await this.tokens(owner, options);
        if (tokens) {
            const uris = tokens.map(
                (id) => id && this.tokenURI(id)
            );
            return await Promise.all(uris);
        }
    }
    private indices(options: {
        page?: number, page_size?: number, length: number
    }) {
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
            const eth = await WebThree.me.eth;
            if (eth) {
                const abi = await this.abi();
                if (abi) {
                    const address = this._address;
                    if (address) {
                        this._contract = window.CONTRACT = new eth.Contract(
                            abi, address
                        );
                    }
                }
            }
        }
        return this._contract;
    }
    private async abi() {
        if (this._abi === undefined) {
            const url = "/static/js/app/ethereum/ntx-certificate.abi.json";
            this._abi = await fetch(url).then((res) => res.json());
        }
        return this._abi;
    }
    private _abi?: AbiItem;
    private _address: string;
    private _contract?: Contract;
};
export default NtxCertificate;
