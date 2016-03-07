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
        inlineOpen: '$$',
        inlineClose: '$$',
        inlineRenderer: function (string) {
            return '$$' + string + '$$';
        },
        blockOpen: '$$$',
        blockClose: '$$$',
        blockRenderer: function (string) {
            return '$$$' + string + '$$$';
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
}());