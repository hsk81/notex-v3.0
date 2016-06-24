///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:markdown-it.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

declare let markdownit:(any:any)=> void;
declare let markdownitAbbr:()=> void;
declare let markdownitAnchor:()=> void;
declare let markdownitCentertext:()=> void;
declare let markdownitDecorate:()=> void;
declare let markdownitEmoji:()=> void;
declare let markdownitFigure:()=> void;
declare let markdownitFootnote:()=> void;
declare let markdownitMark:()=> void;
declare let markdownitMath:()=> void;
declare let markdownitSub:()=> void;
declare let markdownitSup:()=> void;
declare let markdownitToc:()=> void;
declare let markdownitVideo:()=> void;

///////////////////////////////////////////////////////////////////////////////

declare let hljs:any;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * @see: https://markdown-it.github.io/markdown-it/
 */
export class MarkdownIt {

    constructor() {
        this.mdi = new markdownit({
            highlight: function (text, language) {
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

    /**
     * @see: See: https://markdown-it.github.io/markdown-it/#MarkdownIt.render
     */
    render(src:string, env?:any):string {
        return this.mdi.render(src, env);
    }

    private mdi:any;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default MarkdownIt;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

