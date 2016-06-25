///////////////////////////////////////////////////////////////////////////////
///<reference path="../../global/global.d.ts"/>

console.debug('[import:ui/publish-dialog.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import cookie from '../../cookie/cookie';
import BloggerApi from '../../google-api/blogger-api';
import MarkdownIt from '../../markdown-it/markdown-it';

import after from '../../function/after';
import assert from '../../function/assert';
import before from '../../function/before';

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
    }

    onBsModalShow() {
        console.debug('[on:bs-modal-show');
        var $blog_url = $('#blog-url'),
            $blog_url_ig = $blog_url.parent('.input-group');
        var $post_title = $('#post-title'),
            $post_title_ig = $post_title.parent('.input-group');

        $blog_url_ig.removeClass('has-error');
        $post_title_ig.removeClass('has-error');
        $post_title_ig.find('[type=checkbox]').prop('checked', true);

        var blog_url = cookie.get('blog-url');
        if (blog_url && typeof blog_url === 'string') {
            $blog_url.val(blog_url);
        }

        var headers = $('#md-out').find(':header'),
            title = $(headers[0]).text();
        if (title && typeof title === 'string') {
            $post_title.val(title);
        }

        $(this).find('[data-toggle="tooltip"]').tooltip();
        $(this).find('[data-toggle="popover"]').popover();

        this.$primary.attr('disabled', false);
        this.$primary.removeClass('btn-success');
        this.$primary.removeClass('btn-warning');
        this.$primary.removeClass('btn-danger');
        this.$primary.button('reset');
    }

    onBsModalShown() {
        var blog_url = cookie.get('blog-url');
        if (blog_url) {
            $('#post-title').focus();
        } else {
            $('#blog-url').focus();
        }
    }

    onBsModalHide() {
    }

    onBsModalHidden() {
        setTimeout(() => {
            $('#md-inp').focus();
        }, 1);
    }

    onPrimaryClick() {
        var $blog_url = $('#blog-url'),
            $blog_url_ig = $blog_url.parent('.input-group');
        var $post_title = $('#post-title'),
            $post_title_ig = $post_title.parent('.input-group'),
            $post_title_cb = $post_title_ig.find('[type=checkbox]');

        var url = $blog_url.val();
        if (!url) {
            $blog_url_ig.addClass('has-error');
            $blog_url.focus().off('blur').on('blur', () => {
                var url = $blog_url.val();
                if (url) $blog_url_ig.removeClass('has-error');
            });
        }
        var title = $post_title.val();
        if (!title) {
            $post_title_ig.addClass('has-error');
            $post_title.focus().off('blur').on('blur', () => {
                var title = $post_title.val();
                if (title) $post_title_ig.removeClass('has-error');
            });
        }

        if ($blog_url_ig.hasClass('has-error')) {
            $blog_url.focus();
        } else if ($post_title_ig.hasClass('has-error')) {
            $post_title.focus();
        } else {
            BloggerApi.me.get((blogger) => {
                var on_done = (res) => {
                    var blog = assert(res && res.result),
                        update = $post_title_cb.prop('checked');
                    if (update && blog.posts.totalItems > 0) {
                        var on_done = (res) => {
                            var posts = res.result && res.result.items || [],
                                post = posts.find((p) => {
                                    return p.title === title;
                                });
                            if (post !== undefined) {
                                do_update(blogger, blog, post);
                            } else {
                                do_insert(blogger, blog);
                            }
                        };
                        var on_fail = (res) => {
                            console.error('[on:blogger.posts.list]', res);
                        };
                        var all_request = blogger.posts.list({
                            blogId: blog.id, fields: 'items(id,title)',
                            orderBy: 'published'
                        });
                        all_request.then(on_done, on_fail);
                    } else {
                        do_insert(blogger, blog);
                    }
                };
                var on_fail = (res) => {
                    $blog_url_ig.addClass('has-error');
                    $blog_url.focus().off('blur').on('blur', () => {
                        var url = $blog_url.val();
                        if (url) $blog_url_ig.removeClass('has-error');
                    });
                    console.error('[on:blogger.blogs.get-by-url]', res);
                };
                if (blogger) {
                    var url_request = blogger.blogs.getByUrl({
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

        function do_insert(blogger, blog) {
            var on_done = (res) => {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = (res) => {
                console.error('[on:blogger.posts.insert]', res);
            };
            var insert_req = blogger.posts.insert({
                blogId: assert(blog.id),
                content: md2html($('#md-inp').val()),
                fields: 'id,url,title', title: assert(title)
            });
            insert_req.then(on_done, on_fail);
        }

        function do_update(blogger, blog, post) {
            var on_done = (res) => {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = (res) => {
                console.error('[on:blogger.posts.update]', res);
            };
            var update_req = blogger.posts.update({
                blogId: assert(blog.id), postId: assert(post.id),
                content: md2html($('#md-inp').val()),
                fields: 'id,url,title', title: assert(post.title)
            });
            update_req.then(on_done, on_fail);
        }

        function md2html(md_content, with_header?) {
            var $content = $('<div>', {
                html: MarkdownIt.me.render(md_content)
            });
            if (!with_header) {
                $content.find(':header:first-of-type').remove();
            }
            return $content.html();
        }
    }

    get $dialog():any {
        return $('#publish-dlg');
    }

    get $primary():any {
        return $('#publish-dlg').find('.btn-primary');
    }
}

///////////////////////////////////////////////////////////////////////////////

export default PublishDialog;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
