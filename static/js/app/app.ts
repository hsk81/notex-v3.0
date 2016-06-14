///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

declare let $:any;
declare let gapi:any;
declare let hljs:any;
declare let onGoogleApiClientLoad:Function;
declare let MathJax:any;

declare let after:(fn:Function, callback:Function)=> Function;
declare let assert:(expression:any, message?:string)=> any;
declare let before:(fn:Function, callback:Function)=> void;
declare let buffered:(fn:Function, ms?:number)=> Function;
declare let mine:(fn:Function)=> Function;

///////////////////////////////////////////////////////////////////////////////

interface String {
    random: Function;
}

interface Function {
    name: string;
    partial:(any:any)=> Function;
    with:(...any)=> Function;
}

interface Window {
    markdownit:(any:any)=> void;
    markdownitAbbr:()=> void;
    markdownitAnchor:()=> void;
    markdownitCentertext:()=> void;
    markdownitDecorate:()=> void;
    markdownitEmoji:()=> void;
    markdownitFigure:()=> void;
    markdownitFootnote:()=> void;
    markdownitMark:()=> void;
    markdownitMath:()=> void;
    markdownitSub:()=> void;
    markdownitSup:()=> void;
    markdownitToc:()=> void;
    markdownitVideo:()=> void;
}

///////////////////////////////////////////////////////////////////////////////

interface ICookie {
    set:<T>(name:string, value:T, expiry_ms?:number)=> T;
    get:<T>(name:string, value?:T)=> T;
}

declare let cookie: ICookie;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

(function () {
    var timeout_id, md_old, md = new window.markdownit({
        highlight: function (text, language) {
            if (language && hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(language, text).value;
                } catch (ex) {
                    console.error('[on:markdown-it.highlight]', ex);
                }
            } else {
                try {
                    return hljs.highlightAuto(text).value;
                } catch (ex) {
                    console.error('[on:markdown-it.highlight]', ex);
                }
            }
            return null; // escape HTML
        },
        html: true, linkify: true, typographer: true
    });

    md.use(window.markdownitAbbr);
    md.use(window.markdownitAnchor);
    md.use(window.markdownitCentertext);
    md.use(window.markdownitDecorate);
    md.use(window.markdownitEmoji);
    md.use(window.markdownitFigure, {
        dataType: true,
        figcaption: true
    });
    md.use(window.markdownitFootnote);
    md.use(window.markdownitMark);
    md.use(window.markdownitMath, {
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
    md.use(window.markdownitSub);
    md.use(window.markdownitSup);
    md.use(window.markdownitToc);
    md.use(window.markdownitVideo);

    $('#md-inp').on('keypress', mine(function (self, ev) {
        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }
    }));

    $('#md-inp').on('change keyup paste', buffered(mine(function (self, ev) {
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
                        "resetEquationNumbers", MathJax.InputJax.TeX
                    ], [
                        "Typeset", MathJax.Hub, 'md-out', function () {
                            $md_out.css('visibility', 'visible');
                            $md_tmp.remove();

                            if (md_new.length === 0) {
                                var path = '/static/html/md-out.html';
                                $.get(path).done(function (html) {
                                    $md_out.html(html);
                                    MathJax.Hub.Queue([
                                        "Typeset", MathJax.Hub, 'md-out'
                                    ]);
                                });
                            }
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

            $md_out.css('visibility', 'hidden');
            $md_out.html(md.render(md_new));

            var $a = $('a[name=save]'), $h = $md_out.find(':header');
            $a.attr("href", URL.createObjectURL(
                new Blob([md_new], {type: 'text/markdown'})));
            $a.attr("download", ($h.length > 0 ? $($h[0]).text() :
                    new Date().toISOString()) + '.md');
        }
    }), 600));

    $('#md-src,#md-src-mob').on('change', function (ev) {
        var files = ev.target.files;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type && files[i].type.match(/text/)) {
                var reader = new FileReader();
                reader.onload = function (progress_ev) {
                    var target = <any>progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string')
                    {
                        $('#md-inp')
                            .val(target.result).trigger('change')
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
        if (gapi === undefined) {
            onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                if (typeof callback === 'function') {
                    callback(gapi);
                }
            };
            $('body').append($('<script>', {
                src: 'https://apis.google.com/js/client.js?onload={0}'.replace(
                    '{0}', onGoogleApiClientLoad.name
                )
            }));
        } else {
            callback(gapi);
        }
    };

    var with_blogger_api = function (callback) {
        var params = {
            client_id: '284730785285-47g372rrd92mbv201ppb8spmj6kff18m',
            scope: 'https://www.googleapis.com/auth/blogger'
        };
        with_google_api(function (gapi) {
            var on_done = function (res) {
                if (res.error) switch (res.error) {
                    case 'immediate_failed':
                        gapi.auth.authorize($.extend(
                            {}, params, {immediate: false}), on_done, on_fail);
                        break;
                    default:
                        if (typeof callback === 'function') {
                            callback(false);
                        }
                        console.error('[with:google-api/done]', res);
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
            var on_fail = function (res) {
                if (typeof callback === 'function') {
                    callback(false);
                }
                console.error('[with:google-api/fail]', res);
            };
            gapi.auth.authorize($.extend(
                {}, params, {immediate: true}), on_done, on_fail);
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

        var $publish = $(this).find('.btn-primary');
        $publish.attr('disabled', false);
        $publish.removeClass('btn-success');
        $publish.removeClass('btn-warning');
        $publish.removeClass('btn-danger');
        $publish.button('reset');
    });

    $('#publish-dlg').on('shown.bs.modal', function (ev) {
        var blog_url = cookie.get('blog-url');
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
                var on_fail = function (res) {
                    $blog_url_ig.addClass('has-error');
                    $blog_url.focus().off('blur').on('blur', function () {
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
                        after(on_done, function () {
                            cookie.set('blog-url', url);

                            $publish.attr('disabled', false);
                            $publish.addClass('btn-success');
                            $publish.button('published');

                            setTimeout(function () {
                                setTimeout(function () {
                                    $publish.button('reset');
                                }, 600);
                                $('#publish-dlg').modal('hide');
                            }, 600);
                        }),
                        before(on_fail, function () {
                            $publish.attr('disabled', false);
                            $publish.addClass('btn-danger');
                            $publish.button('reset');
                        })
                    );
                } else {
                    $publish.attr('disabled', false);
                    $publish.addClass('btn-danger');
                    $publish.button('reset');
                }
            });

            $publish.attr('disabled', true);
            $publish.removeClass('btn-success');
            $publish.removeClass('btn-warning');
            $publish.removeClass('btn-danger');
            $publish.button('publishing');
        }

        function do_insert(blogger, blog) {
            var on_done = function (res) {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = function (res) {
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
            var on_done = function (res) {
                var url = assert(res.result.url),
                    id = assert(res.result.id);
                var tab = open(url, 'post:' + id);
                if (tab !== undefined) tab.focus();
            };
            var on_fail = function (res) {
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