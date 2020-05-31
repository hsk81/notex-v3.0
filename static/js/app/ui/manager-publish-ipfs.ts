import { TemplateManager } from "./manager-template";
import { MdEditor } from "./md-editor";

import { trace } from "../decorator/trace";
import { IPFS, Buffer } from "../ipfs/index";
import { gateway, html } from "../ipfs/index";

type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
declare const $: JQueryStatic;

@trace
export class PublishIpfsManager {
    public static get me(): PublishIpfsManager {
        if (window.PUBLISH_IPFS_MANAGER === undefined) {
            window.PUBLISH_IPFS_MANAGER = new PublishIpfsManager();
        }
        return window.PUBLISH_IPFS_MANAGER;
    }
    private get ipfs_gateway(): string {
        return gateway.get() as string;
    }
    private set ipfs_gateway(value: string) {
        gateway.set(value);
    }
    public constructor() {
        this.$dialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.$dialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.$dialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.$dialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.$primary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    private onBsModalShow() {
        if (this.ipfs_gateway) {
            this.$ipfs_gateway.val(this.ipfs_gateway);
        } else {
            this.$ipfs_gateway.val('');
        }
        this.$ipfs_gateway_ig.removeClass('has-error');
    }
    private onBsModalShown() {
        if (!this.ipfs_gateway) {
            this.$ipfs_gateway.focus();
        } else {
            this.$primary.focus();
        }
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
    }
    private async onPrimaryClick() {
        const $ipfs_nav = this.$dialog.find('.nav-ipfs');
        if (!$ipfs_nav.hasClass('active')) {
            return;
        }
        const gateway = this.$ipfs_gateway.val() as string;
        if (!gateway) {
            this.$ipfs_gateway_ig.addClass('has-error');
            this.$ipfs_gateway.focus().off('blur').on('blur', () => {
                if (this.$ipfs_gateway.val()) {
                    this.$ipfs_gateway_ig.removeClass('has-error');
                }
            });
        }
        if (!this.$ipfs_gateway_ig.hasClass('has-error')) {
            const head = TemplateManager.me.head({ title: this.editor.title });
            const body = this.$contents.find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (const item of ipfs.add(buffer)) {
                    const url = `${gateway}/${item.cid}`;
                    const tab = window.open(url, '_black');
                    if (tab) tab.focus();
                    this.ipfs_gateway = gateway;
                    this.$primary.prop('disabled', false);
                    this.$primary.addClass('btn-success');
                    this.$primary.button('published');
                    setTimeout(() => {
                        $('#publish-dlg').modal('hide');
                        this.$primary.button('reset');
                    }, 600);
                }
            });
            this.$primary.prop('disabled', true);
            this.$primary.removeClass('btn-success');
            this.$primary.removeClass('btn-warning');
            this.$primary.removeClass('btn-danger');
            this.$primary.button('publishing');
        }
    }
    private get $contents() {
        return this.editor.$viewer.contents();
    }
    private get $dialog() {
        return $('#publish-dlg');
    }
    private get $ipfs_gateway() {
        return this.$dialog.find('#ipfs-gateway');
    }
    private get $ipfs_gateway_ig() {
        return this.$ipfs_gateway.parent('.input-group');
    }
    private get $primary() {
        return this.$dialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    private get editor() {
        return MdEditor.me;
    }
}
export default PublishIpfsManager;
