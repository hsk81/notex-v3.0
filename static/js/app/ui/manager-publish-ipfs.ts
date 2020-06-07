import { TemplateManager } from "./manager-template";
import { MdEditor } from "./md-editor";
import { Ui } from "./ui";

import { gateway, html } from "../ipfs/index";
import { IPFS, Buffer } from "../ipfs/index";
import { trace } from "../decorator/trace";

declare const $: JQueryStatic;

@trace
export class PublishIpfsManager {
    public static get me() {
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
        this.ui.$publishDialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.ui.$publishDialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.ui.$publishDialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.ui.$publishDialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.ui.$publishDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    private onBsModalShow() {
        if (this.ipfs_gateway) {
            this.ui.$publishDialogIpfsGateway.val(this.ipfs_gateway);
        } else {
            this.ui.$publishDialogIpfsGateway.val('');
        }
        this.ui.$publishDialogIpfsGatewayInputGroup.removeClass('has-error');
    }
    private onBsModalShown() {
        if (!this.ipfs_gateway) {
            this.ui.$publishDialogIpfsGateway.focus();
        } else {
            this.ui.$publishDialogPrimary.focus();
        }
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
    }
    private async onPrimaryClick() {
        const $nav = this.ui.$publishDialogIpfsNav;
        if (!$nav.find('a').hasClass('active')) {
            return;
        }
        const gateway = this.ui.$publishDialogIpfsGateway.val() as string;
        if (!gateway) {
            this.ui.$publishDialogIpfsGatewayInputGroup.addClass('has-error');
            this.ui.$publishDialogIpfsGateway.focus().off('blur').on('blur', () => {
                if (this.ui.$publishDialogIpfsGateway.val()) {
                    this.ui.$publishDialogIpfsGatewayInputGroup.removeClass('has-error');
                }
            });
        }
        if (!this.ui.$publishDialogIpfsGatewayInputGroup.hasClass('has-error')) {
            const head = TemplateManager.me.head({ title: this.ed.title });
            const body = this.ui.$viewer.contents().find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (const item of ipfs.add(buffer)) {
                    const url = `${gateway}/${item.cid}`;
                    const tab = window.open(url, '_black');
                    if (tab) tab.focus();
                    this.ipfs_gateway = gateway;
                    this.ui.$publishDialogPrimary.prop('disabled', false);
                    this.ui.$publishDialogPrimary.addClass('btn-success');
                    setTimeout(() => {
                        this.ui.$publishDialog.modal('hide');
                    }, 600);
                }
            });
            this.ui.$publishDialogPrimary.prop('disabled', true);
            this.ui.$publishDialogPrimary.removeClass('btn-success');
            this.ui.$publishDialogPrimary.removeClass('btn-warning');
            this.ui.$publishDialogPrimary.removeClass('btn-danger');
        }
    }
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default PublishIpfsManager;
