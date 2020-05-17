import cookie from "../cookie/cookie";
import BloggerApi from "../google-api/blogger-api";
import MarkdownIt from "../markdown-it/markdown-it";
import MdEditor from "./md-editor";

import { after } from "../function/after";
import { assert } from "../function/assert";
import { before } from "../function/before";
import { trace } from "../decorator/trace";

type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
declare const $: JQueryStatic;

@trace
export class PublishManager {
    public static get me(this: any): PublishManager {
        if (this['_me'] === undefined) {
            this['_me'] = window['PUBLISH_DIALOG'] = new PublishManager();
        }
        return this['_me'];
    }
    private get blogUrl(): string {
        return cookie.get<string>('blog-url') as string;
    }
    private set blogUrl(value: string) {
        cookie.set<string>('blog-url', value);
    }
    private get scripts(): string {
        return localStorage.getItem('post-scripts') as string;
    }
    private set scripts(value: string) {
        localStorage.setItem('post-scripts', value);
    }
    private get scriptsFlag(): boolean {
        return cookie.get<boolean>('post-scripts-flag', true) as boolean;
    }
    private set scriptsFlag(value: boolean) {
        cookie.set<boolean>('post-scripts-flag', value);
    }
    private get styles(): string {
        return localStorage.getItem('post-styles') as string;
    }
    private set styles(value: string) {
        localStorage.setItem('post-styles', value);
    }
    private get stylesFlag(): boolean {
        return cookie.get<boolean>('post-styles-flag', true) as boolean;
    }
    private set stylesFlag(value: boolean) {
        cookie.set<boolean>('post-styles-flag', value);
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
        this.$expand.on(
            'click', this.onExpandClick.bind(this));
        this.$post_scripts_nav.on(
            'click', this.onScriptsNavClick.bind(this));
        this.$post_scripts_checkbox.on(
            'click', this.onScriptsCheckboxClick.bind(this));
        this.$post_styles_nav.on(
            'click', this.onStylesNavClick.bind(this));
        this.$post_styles_checkbox.on(
            'click', this.onStylesCheckboxClick.bind(this));
        this.$primary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    private onBsModalShow() {
        const $blog_url = this.$blog_url;
        const $blog_url_ig = $blog_url.parent('.input-group');
        const $post_title = this.$post_title;
        const $post_title_ig = $post_title.parent('.input-group');
        const $post_settings = this.$post_settings;
        const $post_scripts_chk = this.$post_scripts_checkbox;
        const $post_scripts_ta = this.$post_scripts_textarea;
        const $post_styles_chk = this.$post_styles_checkbox;
        const $post_styles_ta = this.$post_styles_textarea;
        $blog_url_ig.removeClass('has-error');
        $post_title_ig.removeClass('has-error');
        $post_title_ig.find('[type=checkbox]').prop('checked', true);
        const blog_url = this.blogUrl;
        if (blog_url && typeof blog_url === 'string') {
            $blog_url.val(blog_url);
        }
        const $headers = this.$viewer.find(':header');
        const title = $headers.first().text();
        if (title && typeof title === 'string') {
            $post_title.val(title.replace('¶', '').trim());
        }
        $post_settings.hide();
        $post_scripts_chk.prop('checked', this.scriptsFlag);
        if (this.scripts) $post_scripts_ta.val(this.scripts);
        $post_styles_chk.prop('checked', this.stylesFlag);
        if (this.styles) $post_styles_ta.val(this.styles);
        this.$dialog.find('[data-toggle="tooltip"]').tooltip();
        this.$dialog.find('[data-toggle="popover"]').popover();
        this.$primary.prop('disabled', false);
        this.$primary.removeClass('btn-success');
        this.$primary.removeClass('btn-warning');
        this.$primary.removeClass('btn-danger');
        this.$primary.button('reset');
    }
    private onBsModalShown() {
        if (this.blogUrl) {
            this.$post_title.focus();
        } else {
            this.$blog_url.focus();
        }
    }
    private onBsModalHide() {
        const $expand = this.$expand;
        const $glyphicon = this.$expand.find('.glyphicon');
        const $post_settings = this.$post_settings;
        $expand.data('state', 'collapsed');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
        $post_settings.hide();
    }
    private onBsModalHidden() {
        setTimeout(() => this.editor.focus(), 1);
    }
    private onExpandClick() {
        const $glyphicon = this.$expand.find('.glyphicon');
        const $textarea = this.$post_scripts_textarea;
        const $settings = this.$post_settings;
        const $title = this.$post_title;
        if (this.$expand.data('state') === 'expanded') {
            this.$expand.data('state', 'collapsed');
        } else {
            this.$expand.data('state', 'expanded');
        }
        if (this.$expand.data('state') === 'expanded') {
            if (this.$post_scripts_nav.hasClass('active')) {
                $settings.filter(':not(.styles)').show();
            } else if (this.$post_styles_nav.hasClass('active')) {
                $settings.filter(':not(.scripts)').show();
            } else {
                $settings.show();
            }
            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
            $textarea[0].setSelectionRange(0, 0);
            $textarea.scrollTop(0);
            $textarea.focus();
        } else {
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $settings.hide();
            $title.focus();
        }
    }
    private onScriptsNavClick() {
        this.$post_styles_nav.removeClass('active');
        this.$post_styles.hide();
        this.$post_scripts_nav.addClass('active');
        this.$post_scripts.show();
        this.$post_scripts_textarea.focus();
    }
    private onScriptsCheckboxClick(ev: Event) {
        this.scriptsFlag = $(ev.target as any).prop('checked');
    }
    private onStylesNavClick() {
        this.$post_scripts_nav.removeClass('active');
        this.$post_scripts.hide();
        this.$post_styles_nav.addClass('active');
        this.$post_styles.show();
        this.$post_styles_textarea.focus();
    }
    private onStylesCheckboxClick(ev: Event) {
        this.stylesFlag = $(ev.target as any).prop('checked');
    }
    private onPrimaryClick() {
        const $blog_url = this.$blog_url;
        const $blog_url_ig = $blog_url.parent('.input-group');
        const $post_title = this.$post_title;
        const $post_title_ig = $post_title.parent('.input-group');
        const $post_title_cb = $post_title_ig.find('[type=checkbox]');
        const url = $blog_url.val() as string;
        if (!url) {
            $blog_url_ig.addClass('has-error');
            $blog_url.focus().off('blur').on('blur', () => {
                const url = $blog_url.val();
                if (url) $blog_url_ig.removeClass('has-error');
            });
        }
        const title = $post_title.val();
        if (!title) {
            $post_title_ig.addClass('has-error');
            $post_title.focus().off('blur').on('blur', () => {
                const title = $post_title.val();
                if (title) $post_title_ig.removeClass('has-error');
            });
        }
        if ($blog_url_ig.hasClass('has-error')) {
            $blog_url.focus();
        } else if ($post_title_ig.hasClass('has-error')) {
            $post_title.focus();
        } else {
            BloggerApi.me.get((blogger: any) => {
                const on_done = (res: any) => {
                    const blog = assert(res && res.result),
                        update = $post_title_cb.prop('checked');
                    if (update && blog.posts.totalItems > 0) {
                        const on_done = (res: any) => {
                            const posts = res.result && res.result.items || [],
                                post = posts.find((p: any) => {
                                    return p.title === title;
                                });
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
                    $blog_url_ig.addClass('has-error');
                    $blog_url.focus().off('blur').on('blur', () => {
                        const url = $blog_url.val();
                        if (url) $blog_url_ig.removeClass('has-error');
                    });
                    console.error('[on:blogger.blogs.get-by-url]', res);
                };
                if (blogger) {
                    const url_request = blogger.blogs.getByUrl({
                        url: url, fields: 'id,posts(totalItems)'
                    });
                    url_request.then(
                        after(on_done, () => {
                            this.scripts = this.$post_scripts_textarea.val() as string;
                            this.styles = this.$post_styles_textarea.val() as string;
                            this.blogUrl = url;
                            this.$primary.prop('disabled', false);
                            this.$primary.addClass('btn-success');
                            this.$primary.button('published');
                            setTimeout(() => {
                                setTimeout(() => {
                                    this.$primary.button('reset');
                                }, 600);
                                $('#publish-dlg').modal('hide');
                            }, 600);
                        }),
                        before(on_fail, () => {
                            this.$primary.prop('disabled', false);
                            this.$primary.addClass('btn-danger');
                            this.$primary.button('reset');
                        })
                    );
                } else {
                    this.$primary.prop('disabled', false);
                    this.$primary.addClass('btn-danger');
                    this.$primary.button('reset');
                }
            });
            this.$primary.prop('disabled', true);
            this.$primary.removeClass('btn-success');
            this.$primary.removeClass('btn-warning');
            this.$primary.removeClass('btn-danger');
            this.$primary.button('publishing');
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
        return this.toHtml(this.editor.getValue())
            + this.withScripts()
            + this.withStyles();
    }
    private withScripts() {
        const $checkbox = this.$post_scripts_checkbox;
        if ($checkbox.prop('checked')) {
            return this.$post_scripts_textarea.val();
        } else {
            return '';
        }
    }
    private withStyles() {
        const $checkbox = this.$post_styles_checkbox;
        if ($checkbox.prop('checked')) {
            return this.$post_styles_textarea.val();
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
    private get $viewer() {
        return this.editor.$viewer.contents();
    }
    private get $dialog() {
        return $('#publish-dlg');
    }
    private get $blog_url() {
        return this.$dialog.find('#blog-url');
    }
    private get $post_title() {
        return this.$dialog.find('#post-title');
    }
    private get $post_settings() {
        return this.$dialog.find('.post-settings');
    }
    private get $post_settings_nav() {
        return this.$dialog.find('.post-settings.nav');
    }
    private get $post_scripts() {
        return this.$dialog.find('.post-settings.scripts');
    }
    private get $post_scripts_nav() {
        return this.$post_settings_nav.find('.scripts');
    }
    private get $post_scripts_checkbox() {
        return this.$post_scripts.find('[type=checkbox]');
    }
    private get $post_scripts_textarea() {
        return this.$post_scripts.find('textarea') as JQuery<HTMLTextAreaElement>;
    }
    private get $post_styles() {
        return this.$dialog.find('.post-settings.styles');
    }
    private get $post_styles_nav() {
        return this.$post_settings_nav.find('.styles');
    }
    private get $post_styles_checkbox() {
        return this.$post_styles.find('[type=checkbox]');
    }
    private get $post_styles_textarea() {
        return this.$post_styles.find('textarea');
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
}
export default PublishManager;
