import { PdfCertificateMeta } from "../components/pdf-certificate/index";
import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { CertifyBlog } from "./certify-blog";
import { Command, Commands } from "./index";
import { Ui } from "../ui/index";

import { gateway, html } from "../ipfs/index";
import { IPFS } from "../ipfs/index";

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
            const ipfs = await IPFS.me();
            const head = this.template_dlg.getHead({ title: this.ed.title });
            const body = this.ui.$viewer.contents().find('body').html();
            const item = await ipfs.add({ content: await html(head, body) });
            if (this.meta) {
                const command = new CertifyBlog({
                    item, meta: this.meta
                });
                $(command).on(
                    'certifying', (ev) => $(this).trigger('certifying'));
                $(command).on(
                    'certified', (ev, data) => $(this).trigger('certified', data));
                $(command).on(
                    'rejected', (ev) => $(this).trigger('rejected'));
                Commands.me.run(command);
            } else {
                $(this).trigger('published');
            }
            const post_url = `${gateway.get()}/${item.cid}`;
            const tab = window.open(post_url, '_same');
            if (tab && tab.focus) tab.focus();
        } else {
            this.ui.$publishDialog.modal();
        }
        return this;
    }
    private get template_dlg() {
        return TemplateDialog.me;
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
