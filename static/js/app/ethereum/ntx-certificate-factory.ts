import { NtxCertificate } from "./ntx-certificate";
import { Ethereum } from "./index";

export class NtxCertificateFactory {
    public static async create(chain_id: string) {
        const address = await this.address(chain_id);
        if (address) {
            return window.NTXC = new NtxCertificate(address);
        }
    }
    private static async address(chain_id: string) {
        switch (chain_id.toLowerCase()) {
            case '0x1': // ETH Mainnet
                return '0x3db17B20D4f4313248f004DbFCe2C8e5E8517B18' as string;
            case '0x2a': // ETH Kovan
                return '0x436e85c85600a9060456610f679543EAAFe59f1f' as string;
            case '0xa86a': // AVA Mainnet
                return '0x436e85c85600a9060456610f679543EAAFe59f1f' as string;
            case '0xa869': // AVA Fuji
                return '0x31d3A166E25983c81d5DD64Dc7D0B7a570Ee2Ff6' as string;
            default:
                return undefined;
        }
    }
}
(() => {
    new Promise(async (resolve) => {
        const chain_id = await Ethereum.me.chainId;
        if (chain_id) {
            resolve(await NtxCertificateFactory.create(chain_id));
        }
    });
})();
export default NtxCertificateFactory;
