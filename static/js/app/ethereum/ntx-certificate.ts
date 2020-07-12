import { Contract } from '@npm/web3-eth-contract';
import { PromiEvent } from '@npm/web3-core';
import { TransactionReceipt } from '@npm/web3-core';
export { TransactionReceipt };

import { MyWeb3 } from "./my-web3";

export class NtxCertificate {
    public static address(chain_id: string) {
        if (chain_id) switch (chain_id.toLowerCase()) {
            case '0x1': // ETH Mainnet
                return '0x3db17b20d4f4313248f004dbfce2c8e5e8517b18';
            case '0x2a': // ETH Kovan
                return '0x436e85c85600a9060456610f679543eaafe59f1f';
            case '0xa866': // AVA Denali
                return '0x9c77a6268b31fa482aabccdd53931d5ad91460d7';
            default:
                return undefined;
        }
    }
    public static explorer(address: string) {
        if (address) switch (address.toLowerCase()) {
            case '0x3db17b20d4f4313248f004dbfce2c8e5e8517b18': // ETH Mainnet
                return 'https://etherscan.io';
            case '0x436e85c85600a9060456610f679543eaafe59f1f': // ETH Kovan
                return 'https://kovan.etherscan.io';
            case '0x9c77a6268b31fa482aabccdd53931d5ad91460d7': // AVA Denali
                return 'http://cchain.avaexplorer.com';
            default:
                return undefined;
        }
    }
    public constructor(chain_id: string) {
        this._chain_id = chain_id;
    }
    public async publish(author: string, uri: string) {
        if (author && uri) {
            const contract = await this.contract();
            if (contract) {
                const tx = contract.methods.publish(author, uri).send({
                    from: author
                });
                return tx as PromiEvent<TransactionReceipt>;
            }
        }
    }
    private async contract() {
        if (this._contract === undefined) {
            const eth = await this.eth;
            if (eth) {
                const abi = await NtxCertificate.abi();
                if (abi) {
                    const address = NtxCertificate.address(this._chain_id);
                    if (address) {
                        this._contract = new eth.Contract(abi, address);
                    }
                }
            }
        }
        return this._contract;
    }
    private get eth() {
        return MyWeb3.me.eth;
    }
    private static async abi() {
        if (this._abi === undefined) {
            const url = '/static/js/app/ethereum/ntx-certificate.abi.json';
            this._abi = await fetch(url).then((res) => res.json());
        }
        return this._abi;
    }
    private _contract?: Contract;
    private _chain_id: string;
    private static _abi: any;
};
export default NtxCertificate;
