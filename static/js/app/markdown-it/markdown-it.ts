import * as markdownit from '@npm/markdown-it';
import * as markdownitAbbr from '@npm/markdown-it-abbr';
import * as markdownitAnchor from '@npm/markdown-it-anchor';
import * as markdownitDecorate from '@npm/markdown-it-decorate';
import * as markdownitEmoji from '@npm/markdown-it-emoji';
import * as markdownitFigure from '@npm/markdown-it-figure';
import * as markdownitFootnote from '@npm/markdown-it-footnote';
import * as markdownitMark from '@npm/markdown-it-mark';
import * as markdownitMath from '@npm/markdown-it-math';
import * as markdownitSub from '@npm/markdown-it-sub';
import * as markdownitSup from '@npm/markdown-it-sup';
import * as markdownitVideo from '@npm/markdown-it-video';

declare let hljs: any;

/**
 * @see: https://markdown-it.github.io/markdown-it/
 */
export class MarkdownIt {
    public static get me(this: any): MarkdownIt {
        if (this['_me'] === undefined) {
            this['_me'] = window['MARKDOWN_IT'] = new MarkdownIt();
        }
        return this['_me'];
    }

    public constructor() {
        this._mdi = new markdownit({
            highlight: function (text: any, language: any) {
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
        if (markdownitAbbr) {
            this._mdi.use(markdownitAbbr);
        }
        if (markdownitAnchor) {
            this._mdi.use(markdownitAnchor, {
                level: 2, permalink: true
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
