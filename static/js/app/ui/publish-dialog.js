define(["require", "exports", '../cookie/cookie', '../google-api/blogger-api', '../markdown-it/markdown-it', '../function/after', '../function/assert', '../function/before'], function (require, exports, cookie_1, blogger_api_1, markdown_it_1, after_1, assert_1, before_1) {
    "use strict";
    console.debug('[import:ui/publish-dialog.ts]');
    var PublishDialog = (function () {
        function PublishDialog() {
            this.$dialog.on('show.bs.modal', this.onBsModalShow.bind(this));
            this.$dialog.on('shown.bs.modal', this.onBsModalShown.bind(this));
            this.$dialog.on('hide.bs.modal', this.onBsModalHide.bind(this));
            this.$dialog.on('hidden.bs.modal', this.onBsModalHidden.bind(this));
            this.$primary.on('click', this.onPrimaryClick.bind(this));
        }
        Object.defineProperty(PublishDialog, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new PublishDialog();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        PublishDialog.prototype.onBsModalShow = function () {
            console.debug('[on:bs-modal-show');
            var $blog_url = $('#blog-url'), $blog_url_ig = $blog_url.parent('.input-group');
            var $post_title = $('#post-title'), $post_title_ig = $post_title.parent('.input-group');
            $blog_url_ig.removeClass('has-error');
            $post_title_ig.removeClass('has-error');
            $post_title_ig.find('[type=checkbox]').prop('checked', true);
            var blog_url = cookie_1.default.get('blog-url');
            if (blog_url && typeof blog_url === 'string') {
                $blog_url.val(blog_url);
            }
            var headers = $('#md-out').find(':header'), title = $(headers[0]).text();
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
        };
        PublishDialog.prototype.onBsModalShown = function () {
            var blog_url = cookie_1.default.get('blog-url');
            if (blog_url) {
                $('#post-title').focus();
            }
            else {
                $('#blog-url').focus();
            }
        };
        PublishDialog.prototype.onBsModalHide = function () {
        };
        PublishDialog.prototype.onBsModalHidden = function () {
            setTimeout(function () {
                $('#md-inp').focus();
            }, 1);
        };
        PublishDialog.prototype.onPrimaryClick = function () {
            var _this = this;
            var $blog_url = $('#blog-url'), $blog_url_ig = $blog_url.parent('.input-group');
            var $post_title = $('#post-title'), $post_title_ig = $post_title.parent('.input-group'), $post_title_cb = $post_title_ig.find('[type=checkbox]');
            var url = $blog_url.val();
            if (!url) {
                $blog_url_ig.addClass('has-error');
                $blog_url.focus().off('blur').on('blur', function () {
                    var url = $blog_url.val();
                    if (url)
                        $blog_url_ig.removeClass('has-error');
                });
            }
            var title = $post_title.val();
            if (!title) {
                $post_title_ig.addClass('has-error');
                $post_title.focus().off('blur').on('blur', function () {
                    var title = $post_title.val();
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
                blogger_api_1.default.me.get(function (blogger) {
                    var on_done = function (res) {
                        var blog = assert_1.default(res && res.result), update = $post_title_cb.prop('checked');
                        if (update && blog.posts.totalItems > 0) {
                            var on_done = function (res) {
                                var posts = res.result && res.result.items || [], post = posts.find(function (p) {
                                    return p.title === title;
                                });
                                if (post !== undefined) {
                                    do_update(blogger, blog, post);
                                }
                                else {
                                    do_insert(blogger, blog);
                                }
                            };
                            var on_fail = function (res) {
                                console.error('[on:blogger.posts.list]', res);
                            };
                            var all_request = blogger.posts.list({
                                blogId: blog.id, fields: 'items(id,title)',
                                orderBy: 'published'
                            });
                            all_request.then(on_done, on_fail);
                        }
                        else {
                            do_insert(blogger, blog);
                        }
                    };
                    var on_fail = function (res) {
                        $blog_url_ig.addClass('has-error');
                        $blog_url.focus().off('blur').on('blur', function () {
                            var url = $blog_url.val();
                            if (url)
                                $blog_url_ig.removeClass('has-error');
                        });
                        console.error('[on:blogger.blogs.get-by-url]', res);
                    };
                    if (blogger) {
                        var url_request = blogger.blogs.getByUrl({
                            url: url, fields: 'id,posts(totalItems)'
                        });
                        url_request.then(after_1.default(on_done, function () {
                            cookie_1.default.set('blog-url', url);
                            _this.$primary.attr('disabled', false);
                            _this.$primary.addClass('btn-success');
                            _this.$primary.button('published');
                            setTimeout(function () {
                                setTimeout(function () {
                                    _this.$primary.button('reset');
                                }, 600);
                                $('#publish-dlg').modal('hide');
                            }, 600);
                        }), before_1.default(on_fail, function () {
                            _this.$primary.attr('disabled', false);
                            _this.$primary.addClass('btn-danger');
                            _this.$primary.button('reset');
                        }));
                    }
                    else {
                        _this.$primary.attr('disabled', false);
                        _this.$primary.addClass('btn-danger');
                        _this.$primary.button('reset');
                    }
                });
                this.$primary.attr('disabled', true);
                this.$primary.removeClass('btn-success');
                this.$primary.removeClass('btn-warning');
                this.$primary.removeClass('btn-danger');
                this.$primary.button('publishing');
            }
            function do_insert(blogger, blog) {
                var on_done = function (res) {
                    var url = assert_1.default(res.result.url), id = assert_1.default(res.result.id);
                    var tab = open(url, 'post:' + id);
                    if (tab !== undefined)
                        tab.focus();
                };
                var on_fail = function (res) {
                    console.error('[on:blogger.posts.insert]', res);
                };
                var insert_req = blogger.posts.insert({
                    blogId: assert_1.default(blog.id),
                    content: md2html($('#md-inp').val()),
                    fields: 'id,url,title', title: assert_1.default(title)
                });
                insert_req.then(on_done, on_fail);
            }
            function do_update(blogger, blog, post) {
                var on_done = function (res) {
                    var url = assert_1.default(res.result.url), id = assert_1.default(res.result.id);
                    var tab = open(url, 'post:' + id);
                    if (tab !== undefined)
                        tab.focus();
                };
                var on_fail = function (res) {
                    console.error('[on:blogger.posts.update]', res);
                };
                var update_req = blogger.posts.update({
                    blogId: assert_1.default(blog.id), postId: assert_1.default(post.id),
                    content: md2html($('#md-inp').val()),
                    fields: 'id,url,title', title: assert_1.default(post.title)
                });
                update_req.then(on_done, on_fail);
            }
            function md2html(md_content, with_header) {
                var $content = $('<div>', {
                    html: markdown_it_1.default.me.render(md_content)
                });
                if (!with_header) {
                    $content.find(':header:first-of-type').remove();
                }
                return $content.html();
            }
        };
        Object.defineProperty(PublishDialog.prototype, "$dialog", {
            get: function () {
                return $('#publish-dlg');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$primary", {
            get: function () {
                return $('#publish-dlg').find('.btn-primary');
            },
            enumerable: true,
            configurable: true
        });
        return PublishDialog;
    }());
    exports.PublishDialog = PublishDialog;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PublishDialog;
});
//# sourceMappingURL=publish-dialog.js.map