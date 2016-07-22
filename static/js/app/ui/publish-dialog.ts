///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:ui/publish-dialog.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import cookie from '../cookie/cookie';
import BloggerApi from '../google-api/blogger-api';
import MarkdownIt from '../markdown-it/markdown-it';

import after from '../function/after';
import assert from '../function/assert';
import before from '../function/before';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class PublishDialog {
    static get me():PublishDialog {
        if (this['_me'] === undefined) {
            this['_me'] = new PublishDialog();
        }
        return this['_me'];
    }

    constructor() {
        this.$dialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.$dialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.$dialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.$dialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));

        this.$primary.on(
            'click', this.onPrimaryClick.bind(this));
        this.$expand.on(
            'click', this.onExpandClick.bind(this));
    }

    onBsModalShow() {
        let $blog_url = this.$blog_url,
            $blog_url_ig = $blog_url.parent('.input-group');
        let $post_title = this.$post_title,
            $post_title_ig = $post_title.parent('.input-group'),
            $post_scripts = this.$post_scripts;

        $blog_url_ig.removeClass('has-error');
        $post_title_ig.removeClass('has-error');
        $post_title_ig.find('[type=checkbox]').prop('checked', true);

        let blog_url = cookie.get('blog-url');
        if (blog_url && typeof blog_url === 'string') {
            $blog_url.val(blog_url);
        }

        let headers = this.$mdOut.find(':header'),
            title = $(headers[0]).text();
        if (title && typeof title === 'string') {
            $post_title.val(title);
        }

        let base64 = $post_scripts.find('textarea').text(),
            script = atob(base64);
        $post_scripts.find('textarea').text(script);
        $post_scripts.hide();

        $(this).find('[data-toggle="tooltip"]').tooltip();
        $(this).find('[data-toggle="popover"]').popover();

        this.$primary.attr('disabled', false);
        this.$primary.removeClass('btn-success');
        this.$primary.removeClass('btn-warning');
        this.$primary.removeClass('btn-danger');
        this.$primary.button('reset');
    }

    onBsModalShown() {
        let blog_url = cookie.get('blog-url');
        if (blog_url) {
            this.$post_title.focus();
        } else {
            this.$blog_url.focus();
        }
    }

    onBsModalHide() {
        let $post_scripts = this.$post_scripts,
            $post_scripts_ta = $post_scripts.find('textarea');
        let script = $post_scripts.find('textarea').text(),
            base64 = btoa(script);

        $post_scripts_ta.text(base64);
        $post_scripts.hide();

        let $expand = this.$expand,
            $glyphicon = this.$expand.find('.glyphicon');

        $expand.data('state', 'collapsed');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
    }

    onBsModalHidden() {
        setTimeout(() => {
            this.$mdInp.focus();
        }, 1);
    }

    onExpandClick() {
        let $post_scripts = this.$post_scripts,
            $glyphicon = this.$expand.find('.glyphicon');

        if (this.$expand.data('state') === 'expanded') {
            this.$expand.data('state', 'collapsed');
        } else {
            this.$expand.data('state', 'expanded');
        }

        if (this.$expand.data('state') === 'expanded') {
            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
            $post_scripts.show();
        } else {
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $post_scripts.hide();
        }
    }

    onPrimaryClick() {
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
                            cookie.set('blog-url', url);

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

    doInsert(blogger, blog, title) {
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

    doUpdate(blogger, blog, post) {
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

    content():string {
        return this.toHtml(this.$mdInp.val()) + this.withScripts();
    }

    toHtml(md_content, with_header?) {
        let $content = $('<div>', {
            html: MarkdownIt.me.render(md_content)
        });
        if (!with_header) {
            $content.find(':header:first-of-type').remove();
        }
        return $content.html();
    }

    withScripts() {
        let $post_scripts = this.$post_scripts,
            $checkbox = $post_scripts.find('[type=checkbox]');
        if ($checkbox.prop('checked')) {
            return $post_scripts.find('textarea').val();
        } else {
            return '';
        }
    }

    get $mdOut():any {
        return $('#md-out');
    }

    get $mdInp():any {
        return $('#md-inp');
    }

    get $dialog():any {
        return $('#publish-dlg');
    }

    get $blog_url():any {
        return this.$dialog.find('#blog-url');
    }

    get $post_title():any {
        return this.$dialog.find('#post-title');
    }

    get $post_scripts():any {
        return this.$dialog.find('.post-scripts');
    }

    get $expand():any {
        return this.$dialog.find('#expand');
    }

    get $primary():any {
        return this.$dialog.find('.btn-primary');
    }
}

///////////////////////////////////////////////////////////////////////////////

export default PublishDialog;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
