import { NtxCertificate } from './ntx-certificate';

export class NtxCertificateFactory {
    public static create(chain_id: string) {
        const contract = this.contract(chain_id);
        if (contract) {
            return window.NTXC = new NtxCertificate(contract);
        }
    }
    public static contract(chain_id: string) {
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
export default NtxCertificateFactory;
