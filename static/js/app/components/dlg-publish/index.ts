import { BlogTab } from "./tab-blog/index";
import { IpfsTab } from "./tab-ipfs/index";
import { MdEditor } from "../../ui/md-editor";
import { Ui } from "../../ui/ui";

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
            .on('click', (ev) => $(ev.target).closest('button').popover('toggle'))
            .on('keydown', (ev) => $(ev.target).closest('button').popover('hide'))
            .on('keypress', (ev) => $(ev.target).closest('button').popover('hide'));
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
    }
    private onBsModalShow() {
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.button('reset');
    }
    private onBsModalShown() {
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
        this.ui.$publishDialogExpand.prop('disabled', true);
        this.ui.$publishDialogBlogNav.find('a').removeClass('active');
        this.ui.$publishDialogBlogTab.hide();
        this.ui.$publishDialogIpfsNav.find('a').addClass('active');
        this.ui.$publishDialogIpfsTab.show();
    }
    private onBlogNavClick() {
        this.ui.$publishDialogExpand.prop('disabled', false);
        this.ui.$publishDialogIpfsNav.find('a').removeClass('active');
        this.ui.$publishDialogIpfsTab.hide();
        this.ui.$publishDialogBlogNav.find('a').addClass('active');
        this.ui.$publishDialogBlogTab.show();
    }
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private readonly blog_tab = BlogTab.me;
    private readonly ipfs_tab = IpfsTab.me;
}
export default PublishDialog;
