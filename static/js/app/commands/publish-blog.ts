import { PdfCertificateMeta } from "../components/pdf-certificate/index";
import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Ethereum } from "../ethereum/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { gateway, html } from "../ipfs/index";
import { IPFS, Buffer } from "../ipfs/index";
import { QRCode } from "../qr-code";

export class PublishBlog implements Command {
    constructor({ altKey, meta }: {
        altKey?: boolean, meta?: PdfCertificateMeta
    }) {
        this.altKey = altKey;
        this.meta = meta;
    }
    public async redo() {
        if (this.altKey || this.meta) {
            $(this).trigger('publishing');
        }
        if (this.altKey || this.meta) {
            const head = this.template_dlg.getHead({ title: this.ed.title });
            const body = this.ui.$viewer.contents().find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (
                    const item of ipfs.add(buffer)
                ) {
                    if (this.certifiable && this.meta) {
                        this.certify(
                            `${gateway.get()}`, `${item.cid}`, this.meta
                        ).then(({
                            tx, cert
                        }) => {
                            $(this).trigger('certified', {
                                tx, cert, post_url
                            });
                        }).catch((ex) => {
                            $(this).trigger('rejected');
                            console.error('[nft]', ex);
                        });
                    } else {
                        $(this).trigger('published');
                    }
                    const post_url = `${gateway.get()}/${item.cid}`;
                    const tab = window.open(post_url, '_same');
                    if (tab && tab.focus) tab.focus();
                }
            });
        } else {
            this.ui.$publishDialog.modal();
        }
        return this;
    }
    private async certify(
        ipfs_gateway: string, cid: string, meta: PdfCertificateMeta
    ) {
        $(this).trigger('certifying');
        const content_url = `${ipfs_gateway}/${cid}`;
        meta.content = content_url;
        meta.image = await this.image_url(ipfs_gateway, content_url);
        const buffer = Buffer.from(JSON.stringify(meta, null, 2));
        return IPFS.me().then(async (ipfs: any) => {
            for await (const item of ipfs.add(buffer)) {
                const cert_url = `${ipfs_gateway}/${item.cid}`;
                const tx = await this.eth.nft(cert_url);
                if (tx) return {
                    cert: { meta: meta, url: cert_url }, tx
                };
            }
            throw null;
        });
    }
    private image_url(
        ipfs_gateway: string, ipfs_url: string
    ) {
        return new Promise<string>((resolve) => {
            QRCode(ipfs_url).then((svg) => {
                const buffer = Buffer.from(svg);
                IPFS.me().then(async (ipfs: any) => {
                    for await (const item of ipfs.add(buffer)) {
                        resolve(`${ipfs_gateway}/${item.cid}`);
                    }
                });
            });
        });
    }
    private get certifiable() {
        return this.eth && this.eth.enabled && this.eth.supported;
    }
    private get template_dlg() {
        return TemplateDialog.me;
    }
    private get eth() {
        return Ethereum.me;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private altKey?: boolean;
    private meta?: PdfCertificateMeta;
}
export default PublishBlog;
