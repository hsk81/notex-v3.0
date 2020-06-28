import { Contract } from '@npm/web3-eth-contract';
import { Transaction } from '@npm/web3-core';
import { PromiEvent } from '@npm/web3-core';
import { MyWeb3 } from "./my-web3";

export class NtxCertificate {
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
                return tx as PromiEvent<Transaction>;
            }
        }
    }
    private async contract() {
        if (this._contract === undefined) {
            const eth = await this.eth;
            if (eth) {
                const abi = await NtxCertificate.abi();
                if (abi) {
                    const address = this.address();
                    if (address) {
                        this._contract = new eth.Contract(abi, address);
                    }
                }
            }
        }
        return this._contract;
    }
    private address() {
        switch (this._chain_id) {
            case '0x1': // ETH Mainnet
                return '0x3db17B20D4f4313248f004DbFCe2C8e5E8517B18';
            case '0x2a': // ETH Kovan
                return '0x436e85c85600a9060456610f679543EAAFe59f1f';
            case '0xa866': // AVA Denali
                return '0x9C77A6268b31fA482AAbccDD53931d5ad91460D7';
            default:
                return undefined;
        }
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
