var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../cookie/cookie', '../google-api/blogger-api', '../markdown-it/markdown-it', '../function/after', '../function/assert', '../function/before', '../decorator/named', '../decorator/trace'], function (require, exports, cookie_1, blogger_api_1, markdown_it_1, after_1, assert_1, before_1, named_1, trace_1) {
    "use strict";
    console.debug('[import:app/ui/publish-dialog.ts]');
    var PublishDialog = (function () {
        function PublishDialog() {
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
        Object.defineProperty(PublishDialog.prototype, "blogUrl", {
            get: function () {
                return cookie_1.default.get('blog-url');
            },
            set: function (value) {
                cookie_1.default.set('blog-url', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "scripts", {
            get: function () {
                return localStorage.getItem('post-scripts');
            },
            set: function (value) {
                localStorage.setItem('post-scripts', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "scriptsFlag", {
            get: function () {
                return cookie_1.default.get('post-scripts-flag', true);
            },
            set: function (value) {
                cookie_1.default.set('post-scripts-flag', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "styles", {
            get: function () {
                return localStorage.getItem('post-styles');
            },
            set: function (value) {
                localStorage.setItem('post-styles', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "stylesFlag", {
            get: function () {
                return cookie_1.default.get('post-styles-flag', true);
            },
            set: function (value) {
                cookie_1.default.set('post-styles-flag', value);
            },
            enumerable: true,
            configurable: true
        });
        PublishDialog.prototype.onBsModalShow = function () {
            var $blog_url = this.$blog_url, $blog_url_ig = $blog_url.parent('.input-group');
            var $post_title = this.$post_title, $post_title_ig = $post_title.parent('.input-group');
            var $post_settings = this.$post_settings, $post_scripts_chk = this.$post_scripts_checkbox, $post_scripts_ta = this.$post_scripts_textarea, $post_styles_chk = this.$post_styles_checkbox, $post_styles_ta = this.$post_styles_textarea;
            $blog_url_ig.removeClass('has-error');
            $post_title_ig.removeClass('has-error');
            $post_title_ig.find('[type=checkbox]').prop('checked', true);
            var blog_url = this.blogUrl;
            if (blog_url && typeof blog_url === 'string') {
                $blog_url.val(blog_url);
            }
            var headers = this.$mdOut.find(':header'), title = $(headers[0]).text();
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
            $(this).find('[data-toggle="tooltip"]').tooltip();
            $(this).find('[data-toggle="popover"]').popover();
            this.$primary.attr('disabled', false);
            this.$primary.removeClass('btn-success');
            this.$primary.removeClass('btn-warning');
            this.$primary.removeClass('btn-danger');
            this.$primary.button('reset');
        };
        PublishDialog.prototype.onBsModalShown = function () {
            if (this.blogUrl) {
                this.$post_title.focus();
            }
            else {
                this.$blog_url.focus();
            }
        };
        PublishDialog.prototype.onBsModalHide = function () {
            var $expand = this.$expand, $glyphicon = this.$expand.find('.glyphicon'), $post_settings = this.$post_settings;
            $expand.data('state', 'collapsed');
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
            $post_settings.hide();
        };
        PublishDialog.prototype.onBsModalHidden = function () {
            var _this = this;
            setTimeout(function () {
                _this.$mdInp.focus();
            }, 1);
        };
        PublishDialog.prototype.onExpandClick = function () {
            var $glyphicon = this.$expand.find('.glyphicon'), $settings = this.$post_settings;
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
            }
            else {
                $glyphicon.removeClass('glyphicon-chevron-up');
                $glyphicon.addClass('glyphicon-chevron-down');
                $settings.hide();
            }
        };
        PublishDialog.prototype.onScriptsNavClick = function () {
            this.$post_styles_nav.removeClass('active');
            this.$post_styles.hide();
            this.$post_scripts_nav.addClass('active');
            this.$post_scripts.show();
        };
        PublishDialog.prototype.onScriptsCheckboxClick = function (ev) {
            this.scriptsFlag = $(ev.target).prop('checked');
        };
        PublishDialog.prototype.onStylesNavClick = function () {
            this.$post_scripts_nav.removeClass('active');
            this.$post_scripts.hide();
            this.$post_styles_nav.addClass('active');
            this.$post_styles.show();
        };
        PublishDialog.prototype.onStylesCheckboxClick = function (ev) {
            this.stylesFlag = $(ev.target).prop('checked');
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
                        var blog = assert_1.assert(res && res.result), update = $post_title_cb.prop('checked');
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
                        url_request.then(after_1.after(on_done, function () {
                            _this.scripts = _this.$post_scripts_textarea.val();
                            _this.styles = _this.$post_styles_textarea.val();
                            _this.blogUrl = url;
                            _this.$primary.attr('disabled', false);
                            _this.$primary.addClass('btn-success');
                            _this.$primary.button('published');
                            setTimeout(function () {
                                setTimeout(function () {
                                    _this.$primary.button('reset');
                                }, 600);
                                $('#publish-dlg').modal('hide');
                            }, 600);
                        }), before_1.before(on_fail, function () {
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
                var url = assert_1.assert(res.result.url), id = assert_1.assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined)
                    tab.focus();
            };
            var on_fail = function (res) {
                console.error('[on:blogger.posts.insert]', res);
            };
            var insert_req = blogger.posts.insert({
                blogId: assert_1.assert(blog.id),
                content: this.content(),
                fields: 'id,url,title',
                title: assert_1.assert(title)
            });
            insert_req.then(on_done, on_fail);
        };
        PublishDialog.prototype.doUpdate = function (blogger, blog, post) {
            var on_done = function (res) {
                var url = assert_1.assert(res.result.url), id = assert_1.assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined)
                    tab.focus();
            };
            var on_fail = function (res) {
                console.error('[on:blogger.posts.update]', res);
            };
            var update_req = blogger.posts.update({
                blogId: assert_1.assert(blog.id),
                content: this.content(),
                fields: 'id,url,title',
                postId: assert_1.assert(post.id),
                title: assert_1.assert(post.title)
            });
            update_req.then(on_done, on_fail);
        };
        PublishDialog.prototype.content = function () {
            return this.toHtml(this.$mdInp.val())
                + this.withScripts()
                + this.withStyles();
        };
        PublishDialog.prototype.withScripts = function () {
            var $checkbox = this.$post_scripts_checkbox;
            if ($checkbox.prop('checked')) {
                return this.$post_scripts_textarea.val();
            }
            else {
                return '';
            }
        };
        PublishDialog.prototype.withStyles = function () {
            var $checkbox = this.$post_styles_checkbox;
            if ($checkbox.prop('checked')) {
                return this.$post_styles_textarea.val();
            }
            else {
                return '';
            }
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
                return this.$dialog.find('#blog-url');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_title", {
            get: function () {
                return this.$dialog.find('#post-title');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_settings", {
            get: function () {
                return this.$dialog.find('.post-settings');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_settings_nav", {
            get: function () {
                return this.$dialog.find('.post-settings.nav');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_scripts", {
            get: function () {
                return this.$dialog.find('.post-settings.scripts');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_scripts_nav", {
            get: function () {
                return this.$post_settings_nav.find('.scripts');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_scripts_checkbox", {
            get: function () {
                return this.$post_scripts.find('[type=checkbox]');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_scripts_textarea", {
            get: function () {
                return this.$post_scripts.find('textarea');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_styles", {
            get: function () {
                return this.$dialog.find('.post-settings.styles');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_styles_nav", {
            get: function () {
                return this.$post_settings_nav.find('.styles');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_styles_checkbox", {
            get: function () {
                return this.$post_styles.find('[type=checkbox]');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$post_styles_textarea", {
            get: function () {
                return this.$post_styles.find('textarea');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$expand", {
            get: function () {
                return this.$dialog.find('#expand');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublishDialog.prototype, "$primary", {
            get: function () {
                return this.$dialog.find('.btn-primary');
            },
            enumerable: true,
            configurable: true
        });
        PublishDialog = __decorate([
            trace_1.trace,
            named_1.named('PublishDialog'), 
            __metadata('design:paramtypes', [])
        ], PublishDialog);
        return PublishDialog;
    }());
    exports.PublishDialog = PublishDialog;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PublishDialog;
});
//# sourceMappingURL=publish-dialog.js.map