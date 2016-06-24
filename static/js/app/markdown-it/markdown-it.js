define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:markdown-it.ts]');
    var MarkdownIt = (function () {
        function MarkdownIt() {
            this.mdi = new markdownit({
                highlight: function (text, language) {
                    if (language && hljs.getLanguage(language)) {
                        try {
                            return hljs.highlight(language, text).value;
                        }
                        catch (ex) {
                            console.error('[on:markdown-it.highlight]', ex);
                        }
                    }
                    else {
                        try {
                            return hljs.highlightAuto(text).value;
                        }
                        catch (ex) {
                            console.error('[on:markdown-it.highlight]', ex);
                        }
                    }
                    return null;
                },
                html: true, linkify: true, typographer: true
            });
            this.mdi.use(markdownitAbbr);
            this.mdi.use(markdownitAnchor);
            this.mdi.use(markdownitCentertext);
            this.mdi.use(markdownitDecorate);
            this.mdi.use(markdownitEmoji);
            this.mdi.use(markdownitFigure, {
                dataType: true,
                figcaption: true
            });
            this.mdi.use(markdownitFootnote);
            this.mdi.use(markdownitMark);
            this.mdi.use(markdownitMath, {
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
            this.mdi.use(markdownitSub);
            this.mdi.use(markdownitSup);
            this.mdi.use(markdownitToc);
            this.mdi.use(markdownitVideo);
        }
        MarkdownIt.prototype.render = function (src, env) {
            return this.mdi.render(src, env);
        };
        return MarkdownIt;
    }());
    exports.MarkdownIt = MarkdownIt;
    exports.__esModule = true;
    exports["default"] = MarkdownIt;
});
//# sourceMappingURL=markdown-it.js.map