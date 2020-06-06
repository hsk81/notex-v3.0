import { PublishBlogManager } from "./manager-publish-blog";
import { PublishIpfsManager } from "./manager-publish-ipfs";
import { MdEditor } from "./md-editor";
import { Ui } from "./ui";

import { trace } from "../decorator/trace";

@trace
export class PublishManager {
    public static get me() {
        if (window.PUBLISH_MANAGER === undefined) {
            window.PUBLISH_MANAGER = new PublishManager();
        }
        return window.PUBLISH_MANAGER;
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
        this.ui.$publishDialogIpfsNav.on(
            'click', this.onIpfsNavClick.bind(this));
        this.ui.$publishDialogBlogNav.on(
            'click', this.onBlogNavClick.bind(this));
    }
    private onBsModalShow() {
        // this.ui.$publishDialog.find('[data-toggle="tooltip"]').tooltip();
        // this.ui.$publishDialog.find('[data-toggle="popover"]').popover();
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
        this.ui.$publishDialogBlogNav.removeClass('active');
        this.ui.$publishDialogBlogTab.hide();
        this.ui.$publishDialogIpfsNav.addClass('active');
        this.ui.$publishDialogIpfsTab.show();
    }
    private onBlogNavClick() {
        this.ui.$publishDialogExpand.prop('disabled', false);
        this.ui.$publishDialogIpfsNav.removeClass('active');
        this.ui.$publishDialogIpfsTab.hide();
        this.ui.$publishDialogBlogNav.addClass('active');
        this.ui.$publishDialogBlogTab.show();
    }
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private readonly _manager_blog_publish = PublishBlogManager.me;
    private readonly _manager_ipfs_publish = PublishIpfsManager.me;
}
export default PublishManager;
