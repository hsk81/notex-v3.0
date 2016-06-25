define(["require", "exports", './download-manager', '../markdown-it/markdown-it', '../function/buffered'], function (require, exports, download_manager_1, markdown_it_1, buffered_1) {
    "use strict";
    console.debug('[import:ui/markdown-editor.ts]');
    var MarkdownEditor = (function () {
        function MarkdownEditor() {
            var _this = this;
            this.$mdInp.on('keypress', function () {
                if (_this.timeoutId !== undefined) {
                    clearTimeout(_this.timeoutId);
                    _this.timeoutId = undefined;
                }
            });
            this.$mdInp.on('change keyup paste', buffered_1.default(function (ev) {
                var $md_inp = $(ev.target), $md_out = _this.$mdOut, $md_tmp;
                var md_new = $md_inp.val();
                if (md_new !== _this.mdOld) {
                    _this.mdOld = md_new;
                    if (_this.timeoutId !== undefined) {
                        clearTimeout(_this.timeoutId);
                        _this.timeoutId = undefined;
                    }
                    _this.timeoutId = setTimeout(function () {
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
                    var $h = $md_out.find(':header');
                    download_manager_1.default.me.title = ($h.length > 0 ?
                        $($h[0]).text() : new Date().toISOString()) + '.md';
                    download_manager_1.default.me.content = md_new;
                }
            }, 600));
        }
        Object.defineProperty(MarkdownEditor, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MarkdownEditor();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MarkdownEditor.prototype, "$mdInp", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MarkdownEditor.prototype, "$mdOut", {
            get: function () {
                return $('#md-out');
            },
            enumerable: true,
            configurable: true
        });
        return MarkdownEditor;
    }());
    exports.MarkdownEditor = MarkdownEditor;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MarkdownEditor;
});
//# sourceMappingURL=markdown-editor.js.map