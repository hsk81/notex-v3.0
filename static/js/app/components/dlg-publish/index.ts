import { BlogTab } from "./tab-blog/index";
import { IpfsTab } from "./tab-ipfs/index";
import { Ui } from "../../ui/index";

import { LhsEditor } from "../lhs-editor/index";
import { Ethereum } from "../../ethereum/index";
import { trace } from "../../decorator/trace";

@trace
export class PublishDialog {
    public static get me() {
        if (window.PUBLISH_DIALOG === undefined) {
            window.PUBLISH_DIALOG = new PublishDialog();
        }
        return window.PUBLISH_DIALOG;
    }
    public constructor() {
        this.ui.$publishDialog.find('[data-toggle="popover"]')
            .on('blur', (ev) => $(ev.target).closest('button').popover('hide'))
            .on('click', (ev) => $(ev.target).closest('button').popover('toggle'));
        this.ui.$publishDialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.ui.$publishDialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.ui.$publishDialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.ui.$publishDialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.ui.$publishDialogIpfsNav.on(
            'click', this.onIpfsNavClick.bind(this));
        this.ui.$publishDialogBlogNav.on(
            'click', this.onBlogNavClick.bind(this));
        this.ui.$publishDialogMetamask.on(
            'click', this.onMetamaskClick.bind(this));
        if (this.eth) $(this.eth).on(
            'connected', this.onEthConnected.bind(this));
        if (this.eth) $(this.eth).on(
            'disconnected', this.onEthDisconnected.bind(this));
    }
    private onBsModalShow() {
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.button('reset');
    }
    private async onBsModalShown() {
        if (this.eth) {
            if (await this.eth.supported) {
                if (this.eth.enabled) {
                    this.ui.$publishDialogMetamask.prop('title', 'Disconnect');
                    this.ui.$publishDialogMetamask.prop('disabled', false);
                } else {
                    this.ui.$publishDialogMetamask.prop('title', 'Connect');
                    this.ui.$publishDialogMetamask.prop('disabled', false);
                }
            } else {
                this.ui.$publishDialogMetamask.prop('title', 'Unsupported Network');
                this.ui.$publishDialogMetamask.prop('disabled', true);
            }
        } else {
            this.ui.$publishDialogMetamask.prop('title', 'Install');
            this.ui.$publishDialogMetamask.prop('disabled', false);
        }
    }
    private onBsModalHide() {
        const $glyphicon = this.ui.$publishDialogExpand.find('.glyphicon');
        this.ui.$publishDialogExpand.data('state', 'collapsed');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
    }
    private onBsModalHidden() {
        setTimeout(() => this.ed.focus(), 1);
    }
    private onIpfsNavClick() {
        this.ui.$publishDialogExpand.hide();
        this.ui.$publishDialogExpand.removeClass('mr-auto');
        this.ui.$publishDialogMetamask.parent().addClass('mr-auto');
        this.ui.$publishDialogMetamask.parent().show();
        this.ui.$publishDialogBlogNav.find('a').removeClass('active');
        this.ui.$publishDialogBlogTab.hide();
        this.ui.$publishDialogIpfsNav.find('a').addClass('active');
        this.ui.$publishDialogIpfsTab.show();
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.html('Publish');
    }
    private onBlogNavClick() {
        this.ui.$publishDialogMetamask.parent().hide();
        this.ui.$publishDialogMetamask.parent().removeClass('mr-auto');
        this.ui.$publishDialogExpand.addClass('mr-auto');
        this.ui.$publishDialogExpand.show();
        this.ui.$publishDialogIpfsNav.find('a').removeClass('active');
        this.ui.$publishDialogIpfsTab.hide();
        this.ui.$publishDialogBlogNav.find('a').addClass('active');
        this.ui.$publishDialogBlogTab.show();
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.html('Publish');
    }
    private onMetamaskClick() {
        if (this.eth) {
            if (this.eth.enabled) {
                this.eth.disable();
            } else {
                this.eth.enable();
            }
        } else {
            const tab = window.open('https://metamask.io/', '_black');
            if (tab) tab.focus();
        }
    }
    private onEthConnected() {
        this.ui.$publishDialogMetamask.prop('title', 'Disconnect');
        this.ui.$publishDialogMetamask.removeClass('mm-disconnected');
        if (this.eth) this.eth.enable();
    }
    private onEthDisconnected() {
        this.ui.$publishDialogMetamask.prop('title', 'Connect');
        this.ui.$publishDialogMetamask.addClass('mm-disconnected');
        if (this.eth) this.eth.disable();
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
    private readonly blog_tab = BlogTab.me;
    private readonly ipfs_tab = IpfsTab.me;
}
export default PublishDialog;
