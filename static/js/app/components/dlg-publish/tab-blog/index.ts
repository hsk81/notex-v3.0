import { BloggerApi } from "../../../google-api/blogger-api";
import { MarkdownIt } from "../../../markdown-it/markdown-it";
import { LhsEditor } from "../../lhs-editor/index";
import { Ui } from "../../../ui/ui";

import { after } from "../../../function/after";
import { assert } from "../../../function/assert";
import { before } from "../../../function/before";
import { cookie } from "../../../cookie/cookie";
import { trace } from "../../../decorator/trace";

declare const $: JQueryStatic;

@trace
export class BlogTab {
    public static get me() {
        if (window.PUBLISH_DIALOG_BLOG_TAB === undefined) {
            window.PUBLISH_DIALOG_BLOG_TAB = new BlogTab();
        }
        return window.PUBLISH_DIALOG_BLOG_TAB;
    }
    private get blog_url(): string {
        return cookie.get('blog-url') as string;
    }
    private set blog_url(value: string) {
        cookie.set('blog-url', value);
    }
    private get scripts(): string {
        return localStorage.getItem('post-scripts') as string;
    }
    private set scripts(value: string) {
        localStorage.setItem('post-scripts', value);
    }
    private get scripts_flag(): boolean {
        return cookie.get('post-scripts-flag', true) as boolean;
    }
    private set scripts_flag(value: boolean) {
        cookie.set('post-scripts-flag', value);
    }
    private get styles(): string {
        return localStorage.getItem('post-styles') as string;
    }
    private set styles(value: string) {
        localStorage.setItem('post-styles', value);
    }
    private get styles_flag(): boolean {
        return cookie.get('post-styles-flag', true) as boolean;
    }
    private set styles_flag(value: boolean) {
        cookie.set('post-styles-flag', value);
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
        this.ui.$publishDialogExpand.on(
            'click', this.onExpandClick.bind(this));
        this.ui.$publishDialogBlogScriptsNav.on(
            'click', this.onScriptsNavClick.bind(this));
        this.ui.$publishDialogBlogScriptsCheckbox.on(
            'click', this.onScriptsCheckboxClick.bind(this));
        this.ui.$publishDialogBlogStylesNav.on(
            'click', this.onStylesNavClick.bind(this));
        this.ui.$publishDialogBlogStylesCheckbox.on(
            'click', this.onStylesCheckboxClick.bind(this));
        this.ui.$publishDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    private onBsModalShow() {
        const $url = this.ui.$publishDialogBlogUrl;
        const $url_ig = this.ui.$publishDialogBlogUrlInputGroup;
        $url_ig.removeClass('has-error');
        const $title = this.ui.$publishDialogBlogTitle;
        const $title_ig = this.ui.$publishDialogBlogTitleInputGroup;
        const $title_cb = this.ui.$publishDialogBlogTitleCheckbox;
        $title_ig.removeClass('has-error');
        $title_cb.prop('checked', true);
        const blog_url = this.blog_url;
        if (blog_url && typeof blog_url === 'string') {
            $url.val(blog_url);
        }
        const title = this.ed.title;
        if (title && typeof title === 'string') {
            $title.val(title);
        }
        const $settings = this.ui.$publishDialogBlogSettings;
        $settings.hide();
        const $scripts_cb = this.ui.$publishDialogBlogScriptsCheckbox;
        $scripts_cb.prop('checked', this.scripts_flag);
        const $scripts_ta = this.ui.$publishDialogBlogScriptsTextarea;
        if (this.scripts) $scripts_ta.val(this.scripts);
        const $styles_cb = this.ui.$publishDialogBlogStylesCheckbox;
        $styles_cb.prop('checked', this.styles_flag);
        const $styles_ta = this.ui.$publishDialogBlogStylesTextarea;
        if (this.styles) $styles_ta.val(this.styles);
    }
    private onBsModalShown() {
        if (!this.ui.$publishDialogBlogUrl.val()) {
            this.ui.$publishDialogBlogUrl.focus();
        } else if (!this.ui.$publishDialogBlogTitle.val()) {
            this.ui.$publishDialogBlogTitle.focus();
        } else {
            this.ui.$publishDialogPrimary.focus();
        }
    }
    private onBsModalHide() {
        this.ui.$publishDialogBlogSettings.hide();
    }
    private onBsModalHidden() {
    }
    private onExpandClick() {
        const $expand = this.ui.$publishDialogExpand;
        const $glyphicon = $expand.find('.glyphicon');
        const $scripts_nav = this.ui.$publishDialogBlogScriptsNav;
        const $styles_nav = this.ui.$publishDialogBlogStylesNav;
        const $scripts_ta = this.ui.$publishDialogBlogScriptsTextarea;
        const $settings = this.ui.$publishDialogBlogSettings;
        const $title = this.ui.$publishDialogBlogTitle;
        if ($expand.data('state') === 'expanded') {
            $expand.data('state', 'collapsed');
        } else {
            $expand.data('state', 'expanded');
        }
        if ($expand.data('state') === 'expanded') {
            if ($scripts_nav.find('a').hasClass('active')) {
                $settings.filter(':not(.styles)').show();
            } else if ($styles_nav.find('a').hasClass('active')) {
                $settings.filter(':not(.scripts)').show();
            } else {
                $settings.show();
            }
            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
            $scripts_ta[0].setSelectionRange(0, 0);
            $scripts_ta.scrollTop(0);
            $scripts_ta.focus();
        } else {
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $settings.hide();
            $title.focus();
        }
    }
    private onScriptsNavClick() {
        this.ui.$publishDialogBlogStylesNav.find('a').removeClass('active');
        this.ui.$publishDialogBlogStyles.hide();
        this.ui.$publishDialogBlogScriptsNav.find('a').addClass('active');
        this.ui.$publishDialogBlogScripts.show();
        this.ui.$publishDialogBlogScriptsTextarea.focus();
    }
    private onScriptsCheckboxClick(ev: Event) {
        this.scripts_flag = $(ev.target as any).prop('checked');
    }
    private onStylesNavClick() {
        this.ui.$publishDialogBlogScriptsNav.find('a').removeClass('active');
        this.ui.$publishDialogBlogScripts.hide();
        this.ui.$publishDialogBlogStylesNav.find('a').addClass('active');
        this.ui.$publishDialogBlogStyles.show();
        this.ui.$publishDialogBlogStylesTextarea.focus();
    }
    private onStylesCheckboxClick(ev: Event) {
        this.styles_flag = $(ev.target as any).prop('checked');
    }
    private onPrimaryClick() {
        const $nav = this.ui.$publishDialogBlogNav;
        if (!$nav.find('a').hasClass('active')) {
            return;
        }
        const $url = this.ui.$publishDialogBlogUrl;
        const $url_ig = this.ui.$publishDialogBlogUrlInputGroup;
        const $title = this.ui.$publishDialogBlogTitle;
        const $title_ig = this.ui.$publishDialogBlogTitleInputGroup;
        const $title_cb = this.ui.$publishDialogBlogTitleCheckbox;
        const $scripts_ta = this.ui.$publishDialogBlogScriptsTextarea;
        const $styles_ta = this.ui.$publishDialogBlogStylesTextarea;
        const url = $url.val() as string;
        if (!url) {
            $url_ig.addClass('has-error');
            $url.focus().off('blur').on('blur', () => {
                if ($url.val()) $url_ig.removeClass('has-error');
            });
        }
        const title = $title.val();
        if (!title) {
            $title_ig.addClass('has-error');
            $title.focus().off('blur').on('blur', () => {
                if ($title.val()) $title_ig.removeClass('has-error');
            });
        }
        if ($url_ig.hasClass('has-error')) {
            $url.focus();
        } else if ($title_ig.hasClass('has-error')) {
            $title.focus();
        } else {
            BloggerApi.me.get((blogger: any) => {
                const on_done = (res: any) => {
                    const blog = assert(res && res.result);
                    const update = $title_cb.prop('checked');
                    if (update && blog.posts.totalItems > 0) {
                        const on_done = (res: any) => {
                            const posts = res.result && res.result.items || [];
                            const post = posts.find(
                                (p: any) => p.title === title
                            );
                            if (post !== undefined) {
                                this.doUpdate(blogger, blog, post);
                            } else {
                                this.doInsert(blogger, blog, title);
                            }
                        };
                        const on_fail = (res: any) => {
                            console.error('[on:blogger.posts.list]', res);
                        };
                        const all_request = blogger.posts.list({
                            blogId: blog.id, fields: 'items(id,title)',
                            orderBy: 'published'
                        });
                        all_request.then(on_done, on_fail);
                    } else {
                        this.doInsert(blogger, blog, title);
                    }
                };
                const on_fail = (res: any) => {
                    $url_ig.addClass('has-error');
                    $url.focus().off('blur').on('blur', () => {
                        if ($url.val()) $url_ig.removeClass('has-error');
                    });
                    console.error('[on:blogger.blogs.get-by-url]', res);
                };
                if (blogger) {
                    const url_request = blogger.blogs.getByUrl({
                        url: url, fields: 'id,posts(totalItems)'
                    });
                    url_request.then(
                        after(on_done, () => {
                            this.scripts = $scripts_ta.val() as string;
                            this.styles = $styles_ta.val() as string;
                            this.blog_url = url;
                            this.ui.$publishDialogPrimary.prop('disabled', false);
                            this.ui.$publishDialogPrimary.addClass('btn-success');
                            setTimeout(() => {
                                this.ui.$publishDialog.modal('hide');
                            }, 600);
                        }),
                        before(on_fail, () => {
                            this.ui.$publishDialogPrimary.prop('disabled', false);
                            this.ui.$publishDialogPrimary.addClass('btn-danger');
                        })
                    );
                } else {
                    this.ui.$publishDialogPrimary.prop('disabled', false);
                    this.ui.$publishDialogPrimary.addClass('btn-danger');
                }
            });
            this.ui.$publishDialogPrimary.prop('disabled', true);
            this.ui.$publishDialogPrimary.removeClass('btn-success');
            this.ui.$publishDialogPrimary.removeClass('btn-warning');
            this.ui.$publishDialogPrimary.removeClass('btn-danger');
        }
    }
    private doInsert(blogger: any, blog: any, title: any) {
        const on_done = (res: any) => {
            const url = assert(res.result.url);
            const id = assert(res.result.id);
            const tab = open(url, 'post:' + id);
            if (tab) tab.focus();
        };
        const on_fail = (res: any) => {
            console.error('[on:blogger.posts.insert]', res);
        };
        const insert_req = blogger.posts.insert({
            blogId: assert(blog.id),
            content: this.content(),
            fields: 'id,url,title',
            title: assert(title)
        });
        insert_req.then(on_done, on_fail);
    }
    private doUpdate(blogger: any, blog: any, post: any) {
        const on_done = (res: any) => {
            const url = assert(res.result.url);
            const id = assert(res.result.id);
            const tab = open(url, 'post:' + id);
            if (tab) tab.focus();
        };
        const on_fail = (res: any) => {
            console.error('[on:blogger.posts.update]', res);
        };
        const update_req = blogger.posts.update({
            blogId: assert(blog.id),
            content: this.content(),
            fields: 'id,url,title',
            postId: assert(post.id),
            title: assert(post.title)
        });
        update_req.then(on_done, on_fail);
    }
    private content(): string {
        return this.toHtml(this.ed.getValue())
            + this.withScripts()
            + this.withStyles();
    }
    private withScripts() {
        const $checkbox = this.ui.$publishDialogBlogScriptsCheckbox;
        if ($checkbox.prop('checked')) {
            return this.ui.$publishDialogBlogScriptsTextarea.val();
        } else {
            return '';
        }
    }
    private withStyles() {
        const $checkbox = this.ui.$publishDialogBlogStylesCheckbox;
        if ($checkbox.prop('checked')) {
            return this.ui.$publishDialogBlogStylesTextarea.val();
        } else {
            return '';
        }
    }
    private toHtml(md_content: any, with_header?: any) {
        const $content = $('<div>', {
            html: MarkdownIt.me.render(md_content)
        });
        if (!with_header) {
            $content.find(':header').first().remove();
        }
        return $content.html();
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default BlogTab;
