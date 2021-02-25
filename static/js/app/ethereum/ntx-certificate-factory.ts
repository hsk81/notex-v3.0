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
                return '0x5B6c68D3d11A74c243c464E617D269CD792E60e8' as string;
            case '0x2a': // ETH Kovan
                return '0x5B6c68D3d11A74c243c464E617D269CD792E60e8' as string;
            case '0xa86a': // AVA Mainnet
                return '0x5B6c68D3d11A74c243c464E617D269CD792E60e8' as string;
            case '0xa869': // AVA Fuji
                return '0x5B6c68D3d11A74c243c464E617D269CD792E60e8' as string;
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
