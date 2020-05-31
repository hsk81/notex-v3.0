import PublishBlogManager from "./manager-publish-blog";
import PublishIpfsManager from "./manager-publish-ipfs";
import MdEditor from "./md-editor";

import { cookie } from "../cookie/cookie";
import { trace } from "../decorator/trace";

type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
declare const $: JQueryStatic;

@trace
export class PublishManager {
    public static get me(): PublishManager {
        if (window.PUBLISH_MANAGER === undefined) {
            window.PUBLISH_MANAGER = new PublishManager();
        }
        return window.PUBLISH_MANAGER;
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
        this.$ipfs_nav.on(
            'click', this.onIpfsNavClick.bind(this));
        this.$blog_nav.on(
            'click', this.onBlogNavClick.bind(this));
    }
    private onBsModalShow() {
        this.$dialog.find('[data-toggle="tooltip"]').tooltip();
        this.$dialog.find('[data-toggle="popover"]').popover();
        this.$primary.prop('disabled', false);
        this.$primary.removeClass('btn-success');
        this.$primary.removeClass('btn-warning');
        this.$primary.removeClass('btn-danger');
        this.$primary.button('reset');
    }
    private onBsModalShown() {
    }
    private onBsModalHide() {
        const $glyphicon = this.$expand.find('.glyphicon');
        this.$expand.data('state', 'collapsed');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
    }
    private onBsModalHidden() {
        setTimeout(() => this.editor.focus(), 1);
    }
    private onIpfsNavClick() {
        this.$expand.prop('disabled', true);
        this.$blog_nav.removeClass('active');
        this.$blog_tab.hide();
        this.$ipfs_nav.addClass('active');
        this.$ipfs_tab.show();
    }
    private onBlogNavClick() {
        this.$expand.prop('disabled', false);
        this.$ipfs_nav.removeClass('active');
        this.$ipfs_tab.hide();
        this.$blog_nav.addClass('active');
        this.$blog_tab.show();
    }
    private get $dialog() {
        return $('#publish-dlg');
    }
    private get $blog_nav() {
        return this.$dialog.find('.nav-blog');
    }
    private get $ipfs_nav() {
        return this.$dialog.find('.nav-ipfs');
    }
    private get $blog_tab() {
        return this.$dialog.find('.tab-blog');
    }
    private get $ipfs_tab() {
        return this.$dialog.find('.tab-ipfs');
    }
    private get $expand() {
        return this.$dialog.find('#expand');
    }
    private get $primary() {
        return this.$dialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    private get editor() {
        return MdEditor.me;
    }
    private readonly _manager_blog_publish = PublishBlogManager.me;
    private readonly _manager_ipfs_publish = PublishIpfsManager.me;
}
export default PublishManager;
