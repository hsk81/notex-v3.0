import markdownit from '@npm/markdown-it';
import markdownitAbbr from '@npm/markdown-it-abbr';
import markdownitAnchor from '@npm/markdown-it-anchor';
import markdownitDecorate from '@npm/markdown-it-decorate';
import markdownitEmoji from '@npm/markdown-it-emoji';
import markdownitFigure from '@npm/markdown-it-figure';
import markdownitFootnote from '@npm/markdown-it-footnote';
import markdownitMark from '@npm/markdown-it-mark';
import markdownitMath from '@npm/markdown-it-math';
import markdownitSub from '@npm/markdown-it-sub';
import markdownitSup from '@npm/markdown-it-sup';
import markdownitVideo from '@npm/markdown-it-video';

import markdownitTitle from './markdown-it-title';
import markdownitScript from './markdown-it-script';

declare const hljs: any;

/**
 * @see: https://markdown-it.github.io/markdown-it/
 */
export class MarkdownIt {
    public static get me(): MarkdownIt {
        if (window.MARKDOWN_IT === undefined) {
            window.MARKDOWN_IT = new MarkdownIt();
        }
        return window.MARKDOWN_IT;
    }

    public constructor() {
        this._mdi = new markdownit({
            highlight: function (text: string, language: string) {
                if (typeof hljs !== 'undefined') {
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
                }
                return null; // escape HTML
            },
            html: true, linkify: true, typographer: true
        });
        if (markdownitAbbr) {
            this._mdi.use(markdownitAbbr);
        }
        if (markdownitAnchor) {
            this._mdi.use(markdownitAnchor, {
                permalinkSymbol: '&nbsp;¶',
                permalinkSpace: false,
                permalink: true
            });
        }
        if (markdownitDecorate) {
            this._mdi.use(markdownitDecorate);
        }
        if (markdownitEmoji) {
            this._mdi.use(markdownitEmoji);
        }
        if (markdownitFigure) {
            this._mdi.use(markdownitFigure, {
                dataType: true, figcaption: true
            });
        }
        if (markdownitFootnote) {
            this._mdi.use(markdownitFootnote);
        }
        if (markdownitMark) {
            this._mdi.use(markdownitMark);
        }
        if (markdownitMath) {
            this._mdi.use(markdownitMath, {
                inlineOpen: '$',
                inlineClose: '$',
                inlineRenderer: function (string: string) {
                    return '$' + string + '$';
                },
                blockOpen: '$$',
                blockClose: '$$',
                blockRenderer: function (string: string) {
                    return '$$' + string + '$$';
                }
            });
        }
        if (markdownitSub) {
            this._mdi.use(markdownitSub);
        }
        if (markdownitSup) {
            this._mdi.use(markdownitSup);
        }
        if (markdownitVideo) {
            this._mdi.use(markdownitVideo);
        }
        if (markdownitTitle) {
            this._mdi.use(markdownitTitle);
        }
        if (markdownitScript) {
            this._mdi.use(markdownitScript);
        }
    }
    /**
     * @see: See: https://markdown-it.github.io/markdown-it/#MarkdownIt.render
     */
    public render(src: string, env?: any): string {
        return this._mdi.render(src, env);
    }
    private _mdi: any;
}
export default MarkdownIt;
