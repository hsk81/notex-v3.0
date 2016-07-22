define(["require", "exports", '../cookie/cookie', '../google-api/blogger-api', '../markdown-it/markdown-it', '../function/after', '../function/assert', '../function/before'], function (require, exports, cookie_1, blogger_api_1, markdown_it_1, after_1, assert_1, before_1) {
    "use strict";
    console.debug('[import:ui/publish-dialog.ts]');
    var PublishDialog = (function () {
        function PublishDialog() {
            var _this = this;
            this.$dialog.on('show.bs.modal', this.onBsModalShow.bind(this));
            this.$dialog.on('shown.bs.modal', this.onBsModalShown.bind(this));
            this.$dialog.on('hide.bs.modal', this.onBsModalHide.bind(this));
            this.$dialog.on('hidden.bs.modal', this.onBsModalHidden.bind(this));
            this.$primary.on('click', this.onPrimaryClick.bind(this));
            this.$expand.on('click', function () {
                var $post_scripts = _this.$post_scripts, $glyphicon = _this.$expand.find('.glyphicon');
                if (_this.$expand.data('state') === 'expanded') {
                    _this.$expand.data('state', 'collapsed');
                }
                else {
                    _this.$expand.data('state', 'expanded');
                }
                if (_this.$expand.data('state') === 'expanded') {
                    $glyphicon.removeClass('glyphicon-chevron-down');
                    $glyphicon.addClass('glyphicon-chevron-up');
                    $post_scripts.show();
                }
                else {
                    $glyphicon.removeClass('glyphicon-chevron-up');
                    $glyphicon.addClass('glyphicon-chevron-down');
                    $post_scripts.hide();
                }
            });
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
            var $blog_url = this.$blog_url, $blog_url_ig = $blog_url.parent('.input-group');
            var $post_title = this.$post_title, $post_title_ig = $post_title.parent('.input-group'), $post_scripts = this.$post_scripts;
            $blog_url_ig.removeClass('has-error');
            $post_title_ig.removeClass('has-error');
            $post_title_ig.find('[type=checkbox]').prop('checked', true);
            var blog_url = cookie_1.default.get('blog-url');
            if (blog_url && typeof blog_url === 'string') {
                $blog_url.val(blog_url);
            }
            var headers = this.$mdOut.find(':header'), title = $(headers[0]).text();
            if (title && typeof title === 'string') {
                $post_title.val(title);
            }
            var base64 = $post_scripts.find('textarea').text(), script = atob(base64);
            $post_scripts.find('textarea').text(script);
            $post_scripts.hide();
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
                this.$post_title.focus();
            }
            else {
                this.$blog_url.focus();
            }
        };
        PublishDialog.prototype.onBsModalHide = function () {
            var $post_scripts = this.$post_scripts, $post_scripts_ta = $post_scripts.find('textarea');
            var script = $post_scripts.find('textarea').text(), base64 = btoa(script);
            $post_scripts_ta.text(base64);
            $post_scripts.hide();
            var $expand = this.$expand, $glyphicon = this.$expand.find('.glyphicon');
            $expand.data('state', 'collapsed');
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
        };
        PublishDialog.prototype.onBsModalHidden = function () {
            var _this = this;
            setTimeout(function () {
                _this.$mdInp.focus();
            }, 1);
        };
        PublishDialog.prototype.onPrimaryClick = function () {
            var _this = this;
            var $blog_url = this.$blog_url, $blog_url_ig = $blog_url.parent('.input-group');
            var $post_title = this.$post_title, $post_title_ig = $post_title.parent('.input-group'), $post_title_cb = $post_title_ig.find('[type=checkbox]');
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
                            var on_done_1 = function (res) {
                                var posts = res.result && res.result.items || [], post = posts.find(function (p) {
                                    return p.title === title;
                                });
                                if (post !== undefined) {
                                    _this.doUpdate(blogger, blog, post);
                                }
                                else {
                                    _this.doInsert(blogger, blog, title);
                                }
                            };
                            var on_fail_1 = function (res) {
                                console.error('[on:blogger.posts.list]', res);
                            };
                            var all_request = blogger.posts.list({
                                blogId: blog.id, fields: 'items(id,title)',
                                orderBy: 'published'
                            });
                            all_request.then(on_done_1, on_fail_1);
                        }
                        else {
                            _this.doInsert(blogger, blog, title);
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
        };
        PublishDialog.prototype.doInsert = function (blogger, blog, title) {
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
                content: this.getContent(),
                fields: 'id,url,title',
                title: assert_1.default(title)
            });
            insert_req.then(on_done, on_fail);
        };
        PublishDialog.prototype.doUpdate = function (blogger, blog, post) {
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
                blogId: assert_1.default(blog.id),
                content: this.getContent(),
                fields: 'id,url,title',
                postId: assert_1.default(post.id),
                title: assert_1.default(post.title)
            });
            update_req.then(on_done, on_fail);
        };
        PublishDialog.prototype.getContent = function () {
            return this.toHtml(this.$mdInp.val()) + this.getScripts();
        };
        PublishDialog.prototype.toHtml = function (md_content, with_header) {
            var $content = $('<div>', {
                html: markdown_it_1.default.me.render(md_content)
            });
            if (!with_header) {
                $content.find(':header:first-of-type').remove();
            }
            return $content.html();
        };
        PublishDialog.prototype.getScripts = function () {
            var $post_scripts = this.$post_scripts, $checkbox = $post_scripts.find('[type=checkbox]');
            if ($checkbox.prop('checked')) {
                return $post_scripts.find('textarea').val();
            }
            else {
                return '';
            }
        };
        Object.defineProperty(PublishDialog.prototype, "$mdOut", {
            get: function () {
                return $('#md-out');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$mdInp", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$dialog", {
            get: function () {
                return $('#publish-dlg');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$blog_url", {
            get: function () {
                return $('#blog-url');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_title", {
            get: function () {
                return $('#post-title');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_scripts", {
            get: function () {
                return $('.post-scripts');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$expand", {
            get: function () {
                return $('button#expand');
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