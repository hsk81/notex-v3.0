declare let markdownit: any;
declare let markdownitAbbr: () => void;
declare let markdownitAnchor: () => void;
declare let markdownitCentertext: () => void;
declare let markdownitDecorate: () => void;
declare let markdownitEmoji: () => void;
declare let markdownitFigure: () => void;
declare let markdownitFootnote: () => void;
declare let markdownitMark: () => void;
declare let markdownitMath: () => void;
declare let markdownitSub: () => void;
declare let markdownitSup: () => void;
declare let markdownitVideo: () => void;

declare let hljs: any;

/**
 * @see: https://markdown-it.github.io/markdown-it/
 */
export class MarkdownIt {
    public static get me(this: any): MarkdownIt {
        if (this['_me'] === undefined) {
            this['_me'] = window['MARKDOWN_IT'] =new MarkdownIt();
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
            inlineRenderer: function (string: string) {
                return '$' + string + '$';
            },
            blockOpen: '$$',
            blockClose: '$$',
            blockRenderer: function (string: string) {
                return '$$' + string + '$$';
            }
        });
        this._mdi.use(markdownitSub);
        this._mdi.use(markdownitSup);
        this._mdi.use(markdownitVideo);
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
