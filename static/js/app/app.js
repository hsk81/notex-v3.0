///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var global = window;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

(function () {
    var timeout_id, md_old, md = new markdownit({
        highlight: function (text, language) {
            if (language && hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(language, text).value;
                } catch (ex) {
                    console.error(ex);
                }
            } else {
                try {
                    return hljs.highlightAuto(text).value;
                } catch (ex) {
                    console.error(ex);
                }
            }
            return null; // escape HTML
        },
        html: true, linkify: true, typographer: true
    });

    md.use(markdownitAbbr);
    md.use(markdownitFootnote);
    md.use(markdownitMark);
    md.use(markdownitMath, {
        inlineOpen: '$',
        inlineClose: '$',
        inlineRenderer: function (string) {
            return '$' + string + '$';
        },
        blockOpen: '$$',
        blockClose: '$$',
        blockRenderer: function (string) {
            return '$$' + string + '$$';
        }
    });

    md.use(markdownitSub);
    md.use(markdownitSup);

    $('#md-inp').on('keypress', function (ev) {
        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }
    });

    $('#md-inp').on('change keyup paste', buffered(function (ev) {
        var $md_inp = $(ev.target),
            $md_out = $('#md-out'),
            $md_tmp;

        var md_new = $md_inp.val();
        if (md_new !== md_old) {
            md_old = md_new;

            if (timeout_id !== undefined) {
                clearTimeout(timeout_id);
                timeout_id = undefined;
            }

            timeout_id = setTimeout(function () {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue([
                        "Typeset", MathJax.Hub, 'md-out', function () {
                            $md_tmp.remove();
                            $md_out.show();
                        }
                    ]);
                }
            }, 0);

            $md_tmp = $('#md-tmp');
            $md_tmp.remove();

            $md_tmp = $md_out.clone();
            $md_tmp.prop('id', 'md-tmp');
            $md_tmp.insertBefore($md_out);
            $md_tmp.scrollTop($md_out.scrollTop());

            $md_out.hide();
            $md_out.html(md.render(md_new));

            var $a = $('a[name=save]'), $h = $md_out.find(':header');
            $a.attr("href", global.URL.createObjectURL(
                new Blob([md_new], {type: 'text/markdown'})));
            $a.attr("download", ($h.length > 0 ? $($h[0]).text() :
                    new Date ().toISOString()) + '.md');
        }
    }, 600));

    $('#md-src,#md-src-mob').on('change', function (ev) {
        var files = ev.target.files;
        for (var i=0; i<files.length; i++) {
            if (files[i].type && files[i].type.match(/text/)) {
                var reader = new FileReader();
                reader.onload = function (progress_ev) {
                   if (progress_ev.target &&
                       progress_ev.target.readyState === 2 &&
                       typeof progress_ev.target.result === 'string')
                   {
                       $('#md-inp')
                           .val(progress_ev.target.result).trigger('change')
                           .setCursorPosition(0).focus();
                   }
                };
                reader.readAsText(files[i]);
            }
        }
    });

    $('[name=swap]').on('click', function () {
       $('div.lhs').toggleClass('hidden-xs hidden-sm')
                   .toggleClass('col-xs-12 col-sm-12');
       $('div.rhs').toggleClass('hidden-xs hidden-sm')
                   .toggleClass('col-xs-12 col-sm-12');
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var with_google_api = function (callback) {
        if (global.gapi === undefined) {
            global.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                if (typeof callback === 'function') {
                    callback(global.gapi);
                }
            };
            $('body').append($('<script>', {
                src: 'https://apis.google.com/js/client.js?onload={0}'.replace(
                    '{0}', global.onGoogleApiClientLoad.name
                )
            }));
        } else {
            callback(global.gapi);
        }
    };

    var with_blogger_api = function (callback) {
        var params = {
            client_id: '284730785285-47g372rrd92mbv201ppb8spmj6kff18m',
            scope: 'https://www.googleapis.com/auth/blogger'
        };
        with_google_api(function (gapi) {
            var on_authorization = function (aaa) {
                if (aaa.error) switch (aaa.error) {
                    case 'immediate_failed':
                        gapi.auth.authorize($.extend(
                            {}, params, {immediate: false}), on_authorization);
                        break;
                    default:
                        console.error(aaa);
                        return;
                } else if (gapi.client.blogger === undefined) {
                    gapi.client.load('blogger', 'v3').then(function () {
                        if (typeof callback === 'function') {
                            callback(gapi.client.blogger, params);
                        }
                    });
                } else {
                    if (typeof callback === 'function') {
                        callback(gapi.client.blogger, params);
                    }
                }
            };
            gapi.auth.authorize($.extend(
                {}, params, {immediate: true}), on_authorization);
        });
    };

    $('#publish-dlg').on('show.bs.modal', function (ev) {
        var $blog_url = $('#blog-url'),
            $blog_url_ig = $blog_url.parent('.input-group');
        var $post_title = $('#post-title'),
            $post_title_ig = $post_title.parent('.input-group');

        $blog_url_ig.removeClass('has-error');
        $post_title_ig.removeClass('has-error');
        $post_title_ig.find('[type=checkbox]').prop('checked', true);

        var blog_url = global.cookie.get('blog-url');
        if (blog_url && typeof blog_url === 'string') {
            $blog_url.val(blog_url);
        }

        var title = $('#md-out').find(':header:first-of-type').text();
        if (title && typeof title === 'string') {
            $post_title.val(title);
        }

        $(this).find('[data-toggle="tooltip"]').tooltip();
        $(this).find('[data-toggle="popover"]').popover();
    });

    $('#publish-dlg').on('shown.bs.modal', function (ev) {
        var blog_url = global.cookie.get('blog-url');
        if (blog_url) {
            $('#post-title').focus();
        } else {
            $('#blog-url').focus();
        }
    });

    $('#publish-dlg').on('hidden.bs.modal', function (ev) {
        setTimeout(function () {
            $('#md-inp').focus();
        }, 1);
    });

    $('#publish-dlg').find('.btn-primary').on('click', function () {
        var $publish = $(this);

        var $blog_url = $('#blog-url'),
            $blog_url_ig = $blog_url.parent('.input-group');
        var $post_title = $('#post-title'),
            $post_title_ig = $post_title.parent('.input-group'),
            $post_title_cb = $post_title_ig.find('[type=checkbox]');

        var url = $blog_url.val();
        if (!url) {
            $blog_url_ig.addClass('has-error');
            $blog_url.focus().off('blur').on('blur', function () {
                var url = $blog_url.val();
                if (url) $blog_url_ig.removeClass('has-error');
            });
        }
        var title = $post_title.val();
        if (!title) {
            $post_title_ig.addClass('has-error');
            $post_title.focus().off('blur').on('blur', function () {
                var title = $post_title.val();
                if (title) $post_title_ig.removeClass('has-error');
            });
        }

        if ($blog_url_ig.hasClass('has-error')) {
            $blog_url.focus();
        } else if ($post_title_ig.hasClass('has-error')) {
            $post_title.focus();
        } else {
            with_blogger_api(function (blogger) {
                var on_done = function (res) {
                    var blog = assert(res && res.result),
                        update = $post_title_cb.prop('checked');

                    if (update && blog.posts.totalItems > 0) {
                        var on_done = function (res) {
                            var posts = res.result && res.result.items || [],
                                post = posts.find(function (p) {
                                    return p.title === title;
                                });

                            if (post !== undefined) {
                                do_update(blogger, blog, post);
                            } else {
                                do_insert(blogger, blog);
                            }
                        };
                        var on_fail = function (res) {
                            console.error('[on:list]', res);
                        };

                        var all_request = blogger.posts.list({
                            blogId: blog.id, fields: 'items(id,title)',
                            orderBy: 'published'
                        });
                        all_request.then(on_done, on_fail);
                    } else {
                        do_insert(blogger, blog);
                    }

                    global.cookie.set('blog-url', url);
                    $('#publish-dlg').modal('hide');
                };
                var on_fail = function (res) {
                    $blog_url_ig.addClass('has-error');
                    $blog_url.focus().off('blur').on('blur', function () {
                        var url = $blog_url.val();
                        if (url) $blog_url_ig.removeClass('has-error');
                    });

                    console.error('[on:get-by-url]', res);
                };

                var url_request = blogger.blogs.getByUrl({
                    url: url, fields: 'id,posts(totalItems)'
                });
                url_request.then(
                    after(on_done, function () {
                        $publish.attr('disabled', false);
                        $publish.button('reset');
                    }),
                    before(on_fail, function () {
                        $publish.attr('disabled', false);
                        $publish.button('reset');
                    })
                );
            });
            $publish.attr('disabled', true);
            $publish.button('publishing');
        }

        function do_insert (blogger, blog) {
            var on_done = function (res) {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = global.open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = function (res) {
                console.error('[on:insert]', res);
            };
            var insert_req = blogger.posts.insert({
                blogId: assert(blog.id),
                content: md2html($('#md-inp').val()),
                fields: 'id,url,title', title: assert(title)
            });
            insert_req.then(on_done, on_fail);
        }
        function do_update (blogger, blog, post) {
            var on_done = function (res) {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = global.open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = function (res) {
                console.error('[on:update]', res);
            };
            var update_req = blogger.posts.update({
                blogId: assert(blog.id), postId: assert(post.id),
                content: md2html($('#md-inp').val()),
                fields: 'id,url,title', title: assert(post.title)
            });
            update_req.then(on_done, on_fail);
        }

        function md2html (md_content, with_header) {
            var $content = $('<div>', {
                html: md.render(md_content)
            });
            if (!with_header) {
                $content.find(':header:first-of-type').remove();
            }
            return $content.html();
        }
    });
}());

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
