import { NtxCertificate } from './ntx-certificate';
import { Chain } from './chain';

export class NtxCertificateFactory {
    public static create(chain_id: string) {
        const address = this.contract(chain_id);
        if (address) {
            return window.NTXC = new NtxCertificate(address);
        }
    }
    public static contract(chain_id: string) {
        let chain: Chain | undefined = undefined;
        try {
            chain = new Chain(chain_id);
        } catch (ex) {
            console.error(ex);
            return undefined;
        }
        if (chain.id) {
            return '0x5B6c68D3d11A74c243c464E617D269CD792E60e8';
        }
    }
}
export default NtxCertificateFactory;
