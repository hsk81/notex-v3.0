(function () {
    var timeout_id, md_old, md = new Remarkable('commonmark', {
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

    $('#md-inp').on('keypress', function (ev) {
        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }
    });
    $('#md-inp').on('change keyup paste', buffered(function (ev) {
        var $md_inp = $(ev.target),
            $md_out = $('#md-out');

        var md_new = $md_inp.val();
        if (md_new !== md_old) {
            md_old = md_new;

            if (timeout_id !== undefined) {
                clearTimeout(timeout_id);
                timeout_id = undefined;
            }

            timeout_id = setTimeout(function () {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "md-out"]);
                }
            }, 600);

            $md_out.html(md.render(md_new));
        }
    }, 200));
}());