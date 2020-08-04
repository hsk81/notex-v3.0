import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { gateway, html } from "../ipfs/index";
import { IPFS, Buffer } from "../ipfs/index";
import { trace } from "../decorator/trace";

@trace
export class PublishBlog implements Command {
    constructor({ ctrlKey, metaKey }: {
        ctrlKey: boolean, metaKey: boolean
    }) {
        this.ctrlKey = ctrlKey;
        this.metaKey = metaKey;
    }
    public async redo() {
        if ((this.ctrlKey || this.metaKey)) {
            const $contents = this.ui.$viewer.contents();
            const head = this.template_dlg.getHead({ title: this.ed.title });
            const body = $contents.find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (const item of ipfs.add(buffer)) {
                    const url = `${gateway.get()}/${item.cid}`;
                    const tab = window.open(url, '_same');
                    if (tab && tab.focus) tab.focus();
                }
            });
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
    private ctrlKey: boolean;
    private metaKey: boolean;
}
export default PublishBlog;
