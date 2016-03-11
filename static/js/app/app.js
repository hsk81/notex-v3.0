(function () {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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
            $a.attr("href", window.URL.createObjectURL(
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
                       $('#md-inp').val(progress_ev.target.result)
                                   .trigger('change');
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
        if (window.gapi === undefined) {
            window.onGoogleApiClientLoad = function onGoogleApiClientLoad() {
                if (typeof callback === 'function') {
                    callback(assert(window.gapi));
                }
            };

            var $script = $('<script>', {
                src: 'https://apis.google.com/js/client.js?onload={0}'.replace(
                    '{0}', window.onGoogleApiClientLoad.name
                )
            });

            $('body').append($script);
        } else {
            callback(window.gapi);
        }
    };

    $('[name=publish]').on('click', function () {
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
                }

                else gapi.client.load('blogger', 'v3').then(function () {
                    var html = md.render($('#md-inp').val()),
                        title = $(html.split('\n').slice(0,1).join('')).text(),
                        content = html.split('\n').slice(1).join('\n');

                    var req = gapi.client.blogger.posts.insert({
                        blogId:'4754003765758243534',
                        content: content,
                        title: title
                    });
                    req.then(function (res) {
                        console.log('[on:posts.insert]', arguments);
                    });
                });
            };

            gapi.auth.authorize($.extend(
                {}, params, {immediate: true}), on_authorization);
        });
    });
}());