define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @see: https://markdown-it.github.io/markdown-it/
     */
    var MarkdownIt = /** @class */ (function () {
        function MarkdownIt() {
            this._mdi = new markdownit({
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
                    return null; // escape HTML
                },
                html: true, linkify: true, typographer: true
            });
            this._mdi.use(markdownitAbbr);
            this._mdi.use(markdownitAnchor, {
                level: 2,
                permalink: true
            });
            this._mdi.use(markdownitCentertext);
            this._mdi.use(markdownitDecorate);
            this._mdi.use(markdownitEmoji);
            this._mdi.use(markdownitFigure, {
                dataType: true,
                figcaption: true
            });
            this._mdi.use(markdownitFootnote);
            this._mdi.use(markdownitMark);
            this._mdi.use(markdownitMath, {
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
            this._mdi.use(markdownitSub);
            this._mdi.use(markdownitSup);
            this._mdi.use(markdownitVideo);
        }
        Object.defineProperty(MarkdownIt, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MarkdownIt();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @see: See: https://markdown-it.github.io/markdown-it/#MarkdownIt.render
         */
        MarkdownIt.prototype.render = function (src, env) {
            return this._mdi.render(src, env);
        };
        return MarkdownIt;
    }());
    exports.MarkdownIt = MarkdownIt;
    exports.default = MarkdownIt;
});
//# sourceMappingURL=markdown-it.js.map