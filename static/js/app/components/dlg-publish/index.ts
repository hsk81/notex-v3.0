import { BlogTab } from "./tab-blog/index";
import { IpfsTab } from "./tab-ipfs/index";
import { Ui, Popover } from "../../ui/index";

import { LhsEditor } from "../lhs-editor/index";
import { Ethereum } from "../../ethereum/index";
import { trace } from "../../decorator/trace";

@trace
export class PublishDialog {
    public static get me(): PublishDialog {
        if (window.PUBLISH_DIALOG === undefined) {
            window.PUBLISH_DIALOG = new PublishDialog();
        }
        return window.PUBLISH_DIALOG;
    }
    public constructor() {
        this.ui.$publishDialog.find('[data-toggle="popover"]')
            .on('blur', (ev) => {
                const button = $(ev.target).closest('button') as Popover<HTMLButtonElement>;
                button.popover('hide');
            })
            .on('click', (ev) => {
                const button = $(ev.target).closest('button') as Popover<HTMLButtonElement>;
                button.popover('toggle');
            });
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
        if (this.eth) this.eth.disable();
    }
    private onBsModalHidden() {
        $(this.blog_tab).trigger('hide', {
            expansion: true, tab: false
        });
        $(this.ipfs_tab).trigger('hide', {
            expansion: true, tab: false
        });
        setTimeout(() => this.ed.focus(), 1);
    }
    private onIpfsNavClick() {
        $(this.blog_tab).trigger('hide', {
            expansion: false, tab: true
        });
        $(this.ipfs_tab).trigger('show');
    }
    private onBlogNavClick() {
        $(this.ipfs_tab).trigger('hide', {
            expansion: false, tab: true
        });
        $(this.blog_tab).trigger('show');
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
            if (tab && tab.focus) tab.focus();
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
