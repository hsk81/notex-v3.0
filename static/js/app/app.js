define(["require", "exports", './publish-dialog/publish-dialog', './markdown-it/markdown-it', './function/buffered', './function/mine', './function/named', './function/partial', './function/with', './string/random'], function (require, exports, publish_dialog_1, markdown_it_1, buffered_1, mine_1) {
    "use strict";
    console.debug('[import:app.ts]');
    var App = (function () {
        function App() {
            this.publish_dialog = publish_dialog_1.default.me;
        }
        Object.defineProperty(App, "me", {
            get: function () {
                return new App();
            },
            enumerable: true,
            configurable: true
        });
        return App;
    }());
    window.APP = App.me;
    var timeout_id, md_old;
    $('#md-inp').on('keypress', mine_1.default(function (self, ev) {
        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }
    }));
    $('#md-inp').on('change keyup paste', buffered_1.default(mine_1.default(function (self, ev) {
        var $md_inp = $(ev.target), $md_out = $('#md-out'), $md_tmp;
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
            $md_out.html(markdown_it_1.default.me.render(md_new));
            var $a = $('a[name=save]'), $h = $md_out.find(':header');
            $a.attr("href", URL.createObjectURL(new Blob([md_new], { type: 'text/markdown' })));
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
                    var target = progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string') {
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
});
//# sourceMappingURL=app.js.map