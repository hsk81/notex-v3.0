var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../cookie/cookie", "../google-api/blogger-api", "../markdown-it/markdown-it", "./md-editor", "../function/after", "../function/assert", "../function/before", "../decorator/trace"], function (require, exports, cookie_1, blogger_api_1, markdown_it_1, md_editor_1, after_1, assert_1, before_1, trace_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PublishDialog_1;
    "use strict";
    let PublishDialog = PublishDialog_1 = class PublishDialog {
        constructor() {
            this.$dialog.on('show.bs.modal', this.onBsModalShow.bind(this));
            this.$dialog.on('shown.bs.modal', this.onBsModalShown.bind(this));
            this.$dialog.on('hide.bs.modal', this.onBsModalHide.bind(this));
            this.$dialog.on('hidden.bs.modal', this.onBsModalHidden.bind(this));
            this.$expand.on('click', this.onExpandClick.bind(this));
            this.$post_scripts_nav.on('click', this.onScriptsNavClick.bind(this));
            this.$post_scripts_checkbox.on('click', this.onScriptsCheckboxClick.bind(this));
            this.$post_styles_nav.on('click', this.onStylesNavClick.bind(this));
            this.$post_styles_checkbox.on('click', this.onStylesCheckboxClick.bind(this));
            this.$primary.on('click', this.onPrimaryClick.bind(this));
        }
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = window['PUBLISH_DIALOG'] = new PublishDialog_1();
            }
            return this['_me'];
        }
        get blogUrl() {
            return cookie_1.default.get('blog-url');
        }
        set blogUrl(value) {
            cookie_1.default.set('blog-url', value);
        }
        get scripts() {
            return localStorage.getItem('post-scripts');
        }
        set scripts(value) {
            localStorage.setItem('post-scripts', value);
        }
        get scriptsFlag() {
            return cookie_1.default.get('post-scripts-flag', true);
        }
        set scriptsFlag(value) {
            cookie_1.default.set('post-scripts-flag', value);
        }
        get styles() {
            return localStorage.getItem('post-styles');
        }
        set styles(value) {
            localStorage.setItem('post-styles', value);
        }
        get stylesFlag() {
            return cookie_1.default.get('post-styles-flag', true);
        }
        set stylesFlag(value) {
            cookie_1.default.set('post-styles-flag', value);
        }
        onBsModalShow() {
            let $blog_url = this.$blog_url, $blog_url_ig = $blog_url.parent('.input-group');
            let $post_title = this.$post_title, $post_title_ig = $post_title.parent('.input-group');
            let $post_settings = this.$post_settings, $post_scripts_chk = this.$post_scripts_checkbox, $post_scripts_ta = this.$post_scripts_textarea, $post_styles_chk = this.$post_styles_checkbox, $post_styles_ta = this.$post_styles_textarea;
            $blog_url_ig.removeClass('has-error');
            $post_title_ig.removeClass('has-error');
            $post_title_ig.find('[type=checkbox]').prop('checked', true);
            let blog_url = this.blogUrl;
            if (blog_url && typeof blog_url === 'string') {
                $blog_url.val(blog_url);
            }
            let $headers = this.$output.find(':header'), title = $headers.first().text();
            if (title && typeof title === 'string') {
                $post_title.val(title.replace('¶', '').trim());
            }
            $post_settings.hide();
            $post_scripts_chk.prop('checked', this.scriptsFlag);
            if (this.scripts)
                $post_scripts_ta.val(this.scripts);
            $post_styles_chk.prop('checked', this.stylesFlag);
            if (this.styles)
                $post_styles_ta.val(this.styles);
            this.$dialog.find('[data-toggle="tooltip"]').tooltip();
            this.$dialog.find('[data-toggle="popover"]').popover();
            this.$primary.attr('disabled', false);
            this.$primary.removeClass('btn-success');
            this.$primary.removeClass('btn-warning');
            this.$primary.removeClass('btn-danger');
            this.$primary.button('reset');
        }
        onBsModalShown() {
            if (this.blogUrl) {
                this.$post_title.focus();
            }
            else {
                this.$blog_url.focus();
            }
        }
        onBsModalHide() {
            let $expand = this.$expand, $glyphicon = this.$expand.find('.glyphicon'), $post_settings = this.$post_settings;
            $expand.data('state', 'collapsed');
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $post_settings.hide();
        }
        onBsModalHidden() {
            setTimeout(() => {
                this.editor.focus();
            }, 1);
        }
        onExpandClick() {
            let $glyphicon = this.$expand.find('.glyphicon'), $textarea = this.$post_scripts_textarea, $settings = this.$post_settings, $title = this.$post_title;
            if (this.$expand.data('state') === 'expanded') {
                this.$expand.data('state', 'collapsed');
            }
            else {
                this.$expand.data('state', 'expanded');
            }
            if (this.$expand.data('state') === 'expanded') {
                if (this.$post_scripts_nav.hasClass('active')) {
                    $settings.filter(':not(.styles)').show();
                }
                else if (this.$post_styles_nav.hasClass('active')) {
                    $settings.filter(':not(.scripts)').show();
                }
                else {
                    $settings.show();
                }
                $glyphicon.removeClass('glyphicon-chevron-down');
                $glyphicon.addClass('glyphicon-chevron-up');
                $textarea[0].setSelectionRange(0, 0);
                $textarea.scrollTop(0);
                $textarea.focus();
            }
            else {
                $glyphicon.removeClass('glyphicon-chevron-up');
                $glyphicon.addClass('glyphicon-chevron-down');
                $settings.hide();
                $title.focus();
            }
        }
        onScriptsNavClick() {
            this.$post_styles_nav.removeClass('active');
            this.$post_styles.hide();
            this.$post_scripts_nav.addClass('active');
            this.$post_scripts.show();
            this.$post_scripts_textarea.focus();
        }
        onScriptsCheckboxClick(ev) {
            this.scriptsFlag = $(ev.target).prop('checked');
        }
        onStylesNavClick() {
            this.$post_scripts_nav.removeClass('active');
            this.$post_scripts.hide();
            this.$post_styles_nav.addClass('active');
            this.$post_styles.show();
            this.$post_styles_textarea.focus();
        }
        onStylesCheckboxClick(ev) {
            this.stylesFlag = $(ev.target).prop('checked');
        }
        onPrimaryClick() {
            let $blog_url = this.$blog_url, $blog_url_ig = $blog_url.parent('.input-group');
            let $post_title = this.$post_title, $post_title_ig = $post_title.parent('.input-group'), $post_title_cb = $post_title_ig.find('[type=checkbox]');
            let url = $blog_url.val();
            if (!url) {
                $blog_url_ig.addClass('has-error');
                $blog_url.focus().off('blur').on('blur', () => {
                    let url = $blog_url.val();
                    if (url)
                        $blog_url_ig.removeClass('has-error');
                });
            }
            let title = $post_title.val();
            if (!title) {
                $post_title_ig.addClass('has-error');
                $post_title.focus().off('blur').on('blur', () => {
                    let title = $post_title.val();
                    if (title)
                        $post_title_ig.removeClass('has-error');
                });
            }
            if ($blog_url_ig.hasClass('has-error')) {
                $blog_url.focus();
            }
            else if ($post_title_ig.hasClass('has-error')) {
                $post_title.focus();
            }
            else {
                blogger_api_1.default.me.get((blogger) => {
                    let on_done = (res) => {
                        let blog = assert_1.assert(res && res.result), update = $post_title_cb.prop('checked');
                        if (update && blog.posts.totalItems > 0) {
                            let on_done = (res) => {
                                let posts = res.result && res.result.items || [], post = posts.find((p) => {
                                    return p.title === title;
                                });
                                if (post !== undefined) {
                                    this.doUpdate(blogger, blog, post);
                                }
                                else {
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
                        }
                        else {
                            this.doInsert(blogger, blog, title);
                        }
                    };
                    let on_fail = (res) => {
                        $blog_url_ig.addClass('has-error');
                        $blog_url.focus().off('blur').on('blur', () => {
                            let url = $blog_url.val();
                            if (url)
                                $blog_url_ig.removeClass('has-error');
                        });
                        console.error('[on:blogger.blogs.get-by-url]', res);
                    };
                    if (blogger) {
                        let url_request = blogger.blogs.getByUrl({
                            url: url, fields: 'id,posts(totalItems)'
                        });
                        url_request.then(after_1.after(on_done, () => {
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
                        }), before_1.before(on_fail, () => {
                            this.$primary.attr('disabled', false);
                            this.$primary.addClass('btn-danger');
                            this.$primary.button('reset');
                        }));
                    }
                    else {
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
        doInsert(blogger, blog, title) {
            let on_done = (res) => {
                let url = assert_1.assert(res.result.url), id = assert_1.assert(res.result.id);
                let tab = open(url, 'post:' + id);
                if (tab)
                    tab.focus();
            };
            let on_fail = (res) => {
                console.error('[on:blogger.posts.insert]', res);
            };
            let insert_req = blogger.posts.insert({
                blogId: assert_1.assert(blog.id),
                content: this.content(),
                fields: 'id,url,title',
                title: assert_1.assert(title)
            });
            insert_req.then(on_done, on_fail);
        }
        doUpdate(blogger, blog, post) {
            let on_done = (res) => {
                let url = assert_1.assert(res.result.url), id = assert_1.assert(res.result.id);
                let tab = open(url, 'post:' + id);
                if (tab)
                    tab.focus();
            };
            let on_fail = (res) => {
                console.error('[on:blogger.posts.update]', res);
            };
            let update_req = blogger.posts.update({
                blogId: assert_1.assert(blog.id),
                content: this.content(),
                fields: 'id,url,title',
                postId: assert_1.assert(post.id),
                title: assert_1.assert(post.title)
            });
            update_req.then(on_done, on_fail);
        }
        content() {
            return this.toHtml(this.editor.getValue())
                + this.withScripts()
                + this.withStyles();
        }
        withScripts() {
            let $checkbox = this.$post_scripts_checkbox;
            if ($checkbox.prop('checked')) {
                return this.$post_scripts_textarea.val();
            }
            else {
                return '';
            }
        }
        withStyles() {
            let $checkbox = this.$post_styles_checkbox;
            if ($checkbox.prop('checked')) {
                return this.$post_styles_textarea.val();
            }
            else {
                return '';
            }
        }
        toHtml(md_content, with_header) {
            let $content = $('<div>', {
                html: markdown_it_1.default.me.render(md_content)
            });
            if (!with_header) {
                $content.find(':header').first().remove();
            }
            return $content.html();
        }
        get $output() {
            return $('#output');
        }
        get $dialog() {
            return $('#publish-dlg');
        }
        get $blog_url() {
            return this.$dialog.find('#blog-url');
        }
        get $post_title() {
            return this.$dialog.find('#post-title');
        }
        get $post_settings() {
            return this.$dialog.find('.post-settings');
        }
        get $post_settings_nav() {
            return this.$dialog.find('.post-settings.nav');
        }
        get $post_scripts() {
            return this.$dialog.find('.post-settings.scripts');
        }
        get $post_scripts_nav() {
            return this.$post_settings_nav.find('.scripts');
        }
        get $post_scripts_checkbox() {
            return this.$post_scripts.find('[type=checkbox]');
        }
        get $post_scripts_textarea() {
            return this.$post_scripts.find('textarea');
        }
        get $post_styles() {
            return this.$dialog.find('.post-settings.styles');
        }
        get $post_styles_nav() {
            return this.$post_settings_nav.find('.styles');
        }
        get $post_styles_checkbox() {
            return this.$post_styles.find('[type=checkbox]');
        }
        get $post_styles_textarea() {
            return this.$post_styles.find('textarea');
        }
        get $expand() {
            return this.$dialog.find('#expand');
        }
        get $primary() {
            return this.$dialog.find('.btn-primary');
        }
        get editor() {
            return md_editor_1.default.me;
        }
    };
    PublishDialog = PublishDialog_1 = __decorate([
        trace_1.trace,
        __metadata("design:paramtypes", [])
    ], PublishDialog);
    exports.PublishDialog = PublishDialog;
    exports.default = PublishDialog;
});
//# sourceMappingURL=publish-dialog.js.map