///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/publish-dialog.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import cookie from '../cookie/cookie';
import BloggerApi from '../google-api/blogger-api';
import MarkdownIt from '../markdown-it/markdown-it';

import {after} from '../function/after';
import {assert} from '../function/assert';
import {before} from '../function/before';
import {named} from '../decorator/named';
import {trace} from '../decorator/trace';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('PublishDialog')
export class PublishDialog {
    public static get me():PublishDialog {
        if (this['_me'] === undefined) {
            this['_me'] = new PublishDialog();
        }
        return this['_me'];
    }

    private get blogUrl():string {
        return cookie.get<string>('blog-url');
    }

    private set blogUrl(value:string) {
        cookie.set<string>('blog-url', value);
    }

    private get scripts():string {
        return localStorage.getItem('post-scripts');
    }

    private set scripts(value:string) {
        localStorage.setItem('post-scripts', value);
    }

    private get scriptsFlag():boolean {
        return cookie.get<boolean>('post-scripts-flag', true);
    }

    private set scriptsFlag(value:boolean) {
        cookie.set<boolean>('post-scripts-flag', value);
    }

    private get styles():string {
        return localStorage.getItem('post-styles');
    }

    private set styles(value:string) {
        localStorage.setItem('post-styles', value);
    }

    private get stylesFlag():boolean {
        return cookie.get<boolean>('post-styles-flag', true);
    }

    private set stylesFlag(value:boolean) {
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
        let $blog_url = this.$blog_url,
            $blog_url_ig = $blog_url.parent('.input-group');
        let $post_title = this.$post_title,
            $post_title_ig = $post_title.parent('.input-group');
        let $post_settings = this.$post_settings,
            $post_scripts_chk = this.$post_scripts_checkbox,
            $post_scripts_ta = this.$post_scripts_textarea,
            $post_styles_chk = this.$post_styles_checkbox,
            $post_styles_ta = this.$post_styles_textarea;

        $blog_url_ig.removeClass('has-error');
        $post_title_ig.removeClass('has-error');
        $post_title_ig.find('[type=checkbox]').prop('checked', true);

        let blog_url = this.blogUrl;
        if (blog_url && typeof blog_url === 'string') {
            $blog_url.val(blog_url);
        }

        let $headers = this.$mdOut.find(':header'),
            title = $headers.first().text();
        if (title && typeof title === 'string') {
            $post_title.val(title.replace('¶', '').trim());
        }

        $post_settings.hide();
        $post_scripts_chk.prop('checked', this.scriptsFlag);
        if (this.scripts) $post_scripts_ta.val(this.scripts);
        $post_styles_chk.prop('checked', this.stylesFlag);
        if (this.styles) $post_styles_ta.val(this.styles);

        $(this).find('[data-toggle="tooltip"]').tooltip();
        $(this).find('[data-toggle="popover"]').popover();

        this.$primary.attr('disabled', false);
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
        let $expand = this.$expand,
            $glyphicon = this.$expand.find('.glyphicon'),
            $post_settings = this.$post_settings;

        $expand.data('state', 'collapsed');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
        $post_settings.hide();
    }

    private onBsModalHidden() {
        setTimeout(() => {
            this.$mdInp.focus();
        }, 1);
    }

    private onExpandClick() {
        let $glyphicon = this.$expand.find('.glyphicon'),
            $settings = this.$post_settings;

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
        } else {
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $settings.hide();
        }
    }

    private onScriptsNavClick() {
        this.$post_styles_nav.removeClass('active');
        this.$post_styles.hide();
        this.$post_scripts_nav.addClass('active');
        this.$post_scripts.show();
    }

    private onScriptsCheckboxClick(ev) {
        this.scriptsFlag = $(ev.target).prop('checked');
    }

    private onStylesNavClick() {
        this.$post_scripts_nav.removeClass('active');
        this.$post_scripts.hide();
        this.$post_styles_nav.addClass('active');
        this.$post_styles.show();
    }

    private onStylesCheckboxClick(ev) {
        this.stylesFlag = $(ev.target).prop('checked');
    }

    private onPrimaryClick() {
        let $blog_url = this.$blog_url,
            $blog_url_ig = $blog_url.parent('.input-group');
        let $post_title = this.$post_title,
            $post_title_ig = $post_title.parent('.input-group'),
            $post_title_cb = $post_title_ig.find('[type=checkbox]');

        let url = $blog_url.val();
        if (!url) {
            $blog_url_ig.addClass('has-error');
            $blog_url.focus().off('blur').on('blur', () => {
                let url = $blog_url.val();
                if (url) $blog_url_ig.removeClass('has-error');
            });
        }
        let title = $post_title.val();
        if (!title) {
            $post_title_ig.addClass('has-error');
            $post_title.focus().off('blur').on('blur', () => {
                let title = $post_title.val();
                if (title) $post_title_ig.removeClass('has-error');
            });
        }

        if ($blog_url_ig.hasClass('has-error')) {
            $blog_url.focus();
        } else if ($post_title_ig.hasClass('has-error')) {
            $post_title.focus();
        } else {
            BloggerApi.me.get((blogger) => {
                let on_done = (res) => {
                    let blog = assert(res && res.result),
                        update = $post_title_cb.prop('checked');
                    if (update && blog.posts.totalItems > 0) {
                        let on_done = (res) => {
                            let posts = res.result && res.result.items || [],
                                post = posts.find((p) => {
                                    return p.title === title;
                                });
                            if (post !== undefined) {
                                this.doUpdate(blogger, blog, post);
                            } else {
                                this.doInsert(blogger, blog, title);
                            }
                        };
                        let on_fail = (res) => {
                            console.error('[on:blogger.posts.list]', res);
                        };
                        let all_request = blogger.posts.list({
                            blogId: blog.id, fields: 'items(id,title)',
                            orderBy: 'published'
                        });
                        all_request.then(on_done, on_fail);
                    } else {
                        this.doInsert(blogger, blog, title);
                    }
                };
                let on_fail = (res) => {
                    $blog_url_ig.addClass('has-error');
                    $blog_url.focus().off('blur').on('blur', () => {
                        let url = $blog_url.val();
                        if (url) $blog_url_ig.removeClass('has-error');
                    });
                    console.error('[on:blogger.blogs.get-by-url]', res);
                };
                if (blogger) {
                    let url_request = blogger.blogs.getByUrl({
                        url: url, fields: 'id,posts(totalItems)'
                    });
                    url_request.then(
                        after(on_done, () => {
                            this.scripts = this.$post_scripts_textarea.val();
                            this.styles = this.$post_styles_textarea.val();
                            this.blogUrl = url;

                            this.$primary.attr('disabled', false);
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
                            this.$primary.attr('disabled', false);
                            this.$primary.addClass('btn-danger');
                            this.$primary.button('reset');
                        })
                    );
                } else {
                    this.$primary.attr('disabled', false);
                    this.$primary.addClass('btn-danger');
                    this.$primary.button('reset');
                }
            });

            this.$primary.attr('disabled', true);
            this.$primary.removeClass('btn-success');
            this.$primary.removeClass('btn-warning');
            this.$primary.removeClass('btn-danger');
            this.$primary.button('publishing');
        }
    }

    private doInsert(blogger, blog, title) {
        let on_done = (res) => {
            let url = assert(res.result.url),
                id = assert(res.result.id);
            let tab = open(url, 'post:' + id);
            if (tab !== undefined) tab.focus();
        };
        let on_fail = (res) => {
            console.error('[on:blogger.posts.insert]', res);
        };
        let insert_req = blogger.posts.insert({
            blogId: assert(blog.id),
            content: this.content(),
            fields: 'id,url,title',
            title: assert(title)
        });
        insert_req.then(on_done, on_fail);
    }

    private doUpdate(blogger, blog, post) {
        let on_done = (res) => {
            let url = assert(res.result.url),
                id = assert(res.result.id);
            let tab = open(url, 'post:' + id);
            if (tab !== undefined) tab.focus();
        };
        let on_fail = (res) => {
            console.error('[on:blogger.posts.update]', res);
        };
        let update_req = blogger.posts.update({
            blogId: assert(blog.id),
            content: this.content(),
            fields: 'id,url,title',
            postId: assert(post.id),
            title: assert(post.title)
        });
        update_req.then(on_done, on_fail);
    }

    private content():string {
        return this.toHtml(this.$mdInp.val())
            + this.withScripts()
            + this.withStyles();
    }

    private withScripts() {
        let $checkbox = this.$post_scripts_checkbox;
        if ($checkbox.prop('checked')) {
            return this.$post_scripts_textarea.val();
        } else {
            return '';
        }
    }

    private withStyles() {
        let $checkbox = this.$post_styles_checkbox;
        if ($checkbox.prop('checked')) {
            return this.$post_styles_textarea.val();
        } else {
            return '';
        }
    }

    private toHtml(md_content, with_header?) {
        let $content = $('<div>', {
            html: MarkdownIt.me.render(md_content)
        });
        if (!with_header) {
            $content.find(':header:first-of-type').remove();
        }
        return $content.html();
    }

    private get $mdOut():any {
        return $('#md-out');
    }

    private get $mdInp():any {
        return $('#md-inp');
    }

    private get $dialog():any {
        return $('#publish-dlg');
    }

    private get $blog_url():any {
        return this.$dialog.find('#blog-url');
    }

    private get $post_title():any {
        return this.$dialog.find('#post-title');
    }

    private get $post_settings():any {
        return this.$dialog.find('.post-settings');
    }

    private get $post_settings_nav():any {
        return this.$dialog.find('.post-settings.nav');
    }

    private get $post_scripts():any {
        return this.$dialog.find('.post-settings.scripts');
    }

    private get $post_scripts_nav():any {
        return this.$post_settings_nav.find('.scripts');
    }

    private get $post_scripts_checkbox():any {
        return this.$post_scripts.find('[type=checkbox]');
    }

    private get $post_scripts_textarea():any {
        return this.$post_scripts.find('textarea');
    }

    private get $post_styles():any {
        return this.$dialog.find('.post-settings.styles');
    }

    private get $post_styles_nav():any {
        return this.$post_settings_nav.find('.styles');
    }

    private get $post_styles_checkbox():any {
        return this.$post_styles.find('[type=checkbox]');
    }

    private get $post_styles_textarea():any {
        return this.$post_styles.find('textarea');
    }

    private get $expand():any {
        return this.$dialog.find('#expand');
    }

    private get $primary():any {
        return this.$dialog.find('.btn-primary');
    }
}

///////////////////////////////////////////////////////////////////////////////

export default PublishDialog;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
