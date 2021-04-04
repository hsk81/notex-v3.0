import { NtxCertificateFactory } from "../ethereum/ntx-certificate-factory";
import { PdfCertificateMeta } from "../components/pdf-certificate/index";
import { Ethereum } from "../ethereum/index";
import { Command } from "./index";

import { gateway } from "../ipfs/index";
import { IPFS } from "../ipfs/index";
import { QRCode } from "../qr-code/index";

export class CertifyBlog implements Command {
    constructor({ item, meta }: {
        item: { cid: string }, meta: PdfCertificateMeta
    }) {
        this.item = item;
        this.meta = meta;
    }
    public async redo() {
        $(this).trigger('certifying');
        this.certify(`${gateway.get()}`).then(({
            cert, tx
        }) => {
            $(this).trigger('certified', {
                cert, post_url: `${gateway.get()}/${this.item.cid}`, tx
            });
        }).catch((ex) => {
            $(this).trigger('rejected');
            console.error('[nft]', ex);
        });
        return this;
    }
    private async certify(
        ipfs_gateway: string
    ) {
        const content_url = `${ipfs_gateway}/${this.item.cid}`;
        this.meta.content = content_url;
        this.meta.image = await this.image_url(ipfs_gateway, content_url);
        const content = JSON.stringify(this.meta, null, 2);
        const ipfs = await IPFS.me();
        const item = await ipfs.add({ content });
        const cert_url = `${ipfs_gateway}/${item.cid}`;
        if (this.eth_supported) {
            const author = await this.eth.address;
            if (!author) throw null;
            const chain_id = await this.eth.chainId;
            if (!chain_id) throw null;
            const ntxc = NtxCertificateFactory.create(chain_id);
            if (!ntxc) throw null;
            const tx = await ntxc.publish(author, cert_url);
            if (!tx) throw null;
            return {
                cert: { meta: this.meta, url: cert_url }, tx
            };
        } else {
            return {
                cert: { meta: this.meta, url: cert_url }, tx: undefined
            };
        }
    }
    private image_url(
        ipfs_gateway: string, ipfs_url: string
    ) {
        return new Promise<string>((resolve) => {
            QRCode(ipfs_url).then(async (svg) => {
                const ipfs = await IPFS.me();
                const item = await ipfs.add({ content: svg });
                resolve(`${ipfs_gateway}/${item.cid}`);
            });
        });
    }
    private get eth_supported() {
        return this.eth && this.eth.enabled && this.eth.supported;
    }
    private get eth() {
        return Ethereum.me;
    }
    private item: { cid: string };
    private meta: PdfCertificateMeta;
}
export default CertifyBlog;
