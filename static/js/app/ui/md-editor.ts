import { cookie } from "../cookie/cookie";

import { buffered } from "../decorator/buffered";
import { named } from "../decorator/named";
import { traceable } from "../decorator/trace";
import { trace } from "../decorator/trace";

import DownloadManager from "./download-manager";
import MarkdownIt from "../markdown-it/markdown-it";
import SpellChecker from "../spell-checker/spell-checker";

import { ILingua } from "../spell-checker/spell-checker";
import { IOverlay } from "../spell-checker/spell-checker";

import "./md-editor-mode";

declare const CodeMirror: {
    fromTextArea: (
        host: HTMLTextAreaElement,
        options?: CodeMirror.EditorConfiguration
    ) => CodeMirror.EditorFromTextArea
};

declare const $: JQueryStatic;

@trace
@named('MdEditor')
export class MdEditor {
    public static get me(this: any): MdEditor {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR'] = new MdEditor();
        }
        return this['_me'];
    }

    public constructor() {
        if (this.mobile) {
            this.toInput({
                footer: false, toolbar: false
            });
        } else if (this.simple) {
            this.toInput({
                footer: true, toolbar: true
            });
        } else {
            this.toMirror();
        }
    }

    public toMirror(): any {
        if (!this.mirror) {
            this.setMirror(CodeMirror.fromTextArea(
                document.getElementById('input') as HTMLTextAreaElement, {
                    addModeClass: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: 'notex-md',
                    styleActiveLine: true,
                    undoDepth: 4096
                } as any
            ));
            this.mirror.setOption('extraKeys', {
                'Tab': (cm: any) => {
                    cm.execCommand('indentMore');
                },
                'Shift-Tab': (cm: any) => {
                    cm.execCommand('indentLess');
                }
            });
            this.mirror
                .on('change', this.onEditorChange.bind(this));
        }

        if (this.spellCheckerOverlay) {
            this.mirror.removeOverlay(this.spellCheckerOverlay);
            this.mirror.addOverlay(this.spellCheckerOverlay);
        }

        this.simple = false;
        this.$input.hide();
        return this.mirror;
    }

    public toInput(options: {
        footer: boolean, toolbar: boolean
    }): any {
        if (this.mirror) {
            if (this.spellCheckerOverlay) {
                this.mirror.removeOverlay(this.spellCheckerOverlay);
            }
            this.mirror.toTextArea();
            this.setMirror(undefined);
        }

        this.$input
            .off('keyup change paste')
            .on('keyup change paste', this.onEditorChange.bind(this))
            .show();

        if (options.toolbar) {
            this.$input.css('width', 'calc(100% - 48px)');
        } else {
            this.$input.css('width', '100% ');
        }

        if (options.footer) {
            this.$footer.show();
            this.$input.css('height', 'calc(100% - 47px)');
        } else {
            this.$footer.hide();
            this.$input.css('height', '100%');
        }

        this.simple = true;
        return this.$input;
    }

    @buffered(600)
    public render() {
        let $output = $('#output'),
            $cached: JQuery<HTMLElement>;

        let value = this.getValue();
        if (value !== this._mdOld) {
            this._mdOld = value;

            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
                this._timeoutId = undefined;
            }

            this._timeoutId = setTimeout(() => {
                if (typeof MathJax !== 'undefined') {
                    (MathJax as any).Hub.Queue([
                        'resetEquationNumbers', (MathJax as any).InputJax.TeX
                    ], [
                            'Typeset', MathJax.Hub, 'output', () => {
                                $output.css('visibility', 'visible');
                                $cached.remove();

                                if (value.length === 0) {
                                    $.get(
                                        '/static/html/output-placeholder.html'
                                    ).done((html) => {
                                        $output.html(html);
                                        $output.find('>*').hide().fadeIn('fast');
                                        MathJax.Hub.Queue([
                                            'Typeset', MathJax.Hub, 'output'
                                        ]);
                                    });
                                }
                            }
                        ]);
                } else {
                    $output.css('visibility', 'visible');
                    $cached.remove();

                    if (value.length === 0) {
                        $.get(
                            '/static/html/output-placeholder.html'
                        ).done((html) => {
                            $output.html(html);
                            $output.find('>*').hide().fadeIn('fast');
                        });
                    }
                }
            }, 0) as any;

            $cached = $('#cached');
            $cached.remove();
            $cached = $output.clone();
            $cached.prop('id', 'cached');
            $cached.insertBefore($output);
            $cached.scrollTop($output.scrollTop());

            $output.css('visibility', 'hidden');
            $output.html(MarkdownIt.me.render(value));

            let $h = $output.find(':header');
            DownloadManager.me.title = ($h.length > 0 ?
                $($h[0]).text() : new Date().toISOString()) + '.md';
            DownloadManager.me.content = value;
        }
    }

    public refresh() {
        if (this.mirror) {
            this.mirror.refresh();
        }
    }

    public focus() {
        if (this.mirror) {
            this.mirror.focus();
        } else {
            this.$input.focus();
        }
    }

    @traceable(false)
    public getValue() {
        if (this.mirror) {
            return this.mirror.getValue();
        } else {
            return this.$input.val();
        }
    }

    @traceable(false)
    public setValue(value: string) {
        if (this.mirror) {
            return this.mirror.setValue(value);
        } else {
            (this.$input[0] as HTMLInputElement)
                .setSelectionRange(0, (this.$input.val() as string).length);
            if (!document.execCommand('insertText', false, value)) {
                this.$input.val(value);
            }

            (this.$input[0] as HTMLInputElement)
                .setSelectionRange(0, 0);
            this.$input.trigger('change');
        }
    }

    public getSelection(): string {
        if (this.mirror) {
            return this.mirror.getSelection();
        } else {
            let inp = this.$input[0] as HTMLInputElement,
                beg = inp.selectionStart as number,
                end = inp.selectionEnd as number;

            return inp.value.substring(beg, end);
        }
    }

    private onEditorChange() {
        if (typeof MathJax === 'undefined') try {
            let script = document.createElement('script'),
                head = document.getElementsByTagName('head');
            script.type = 'text/javascript';
            script.src = this.mathjaxUrl;
            script.async = true;
            head[0].appendChild(script);
        } catch (ex) {
            console.error(ex);
        }
        this.render();
    }

    private get mathjaxUrl(): string {
        return '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML';
    }

    public get $input() {
        return $('#input');
    }

    public get $footer() {
        return this.$input.siblings('.footer');
    }

    public get mirror(): any {
        return window['CODE_MIRROR'];
    }

    private setMirror(value: any) {
        window['CODE_MIRROR'] = value;
    }

    public get mobile(): boolean {
        return $('.lhs').is(':hidden') && !window.debug;
    }

    public get simple(): boolean {
        return cookie.get<boolean>('simple', false) as boolean;
    }

    public set simple(value: boolean) {
        cookie.set<boolean>('simple', value);
    }

    private set spellChecker(value: SpellChecker | undefined) {
        this._spellChecker = value;
    }

    private get spellCheckerOverlay(): IOverlay | undefined {
        return this._spellCheckerOverlay;
    }

    private set spellCheckerOverlay(value: IOverlay | undefined) {
        this._spellCheckerOverlay = value;
    }

    public spellCheck(
        lingua: ILingua, callback: (error: boolean) => void
    ) {
        if (lingua.code) {
            this.spellChecker = new SpellChecker(lingua, (overlay) => {
                if (this.mirror) {
                    this.mirror.removeOverlay('spell-checker');
                }
                if (overlay) {
                    this.spellCheckerOverlay = $.extend(overlay, {
                        name: 'spell-checker'
                    });
                    if (this.mirror) {
                        this.mirror.addOverlay(this.spellCheckerOverlay);
                    }
                }
                if (callback) {
                    callback(!overlay);
                }
            });
        } else {
            this.spellChecker = undefined;
            this.spellCheckerOverlay = undefined;
            if (this.mirror) {
                this.mirror.removeOverlay('spell-checker');
            }
            if (callback) {
                callback(false);
            }
        }
    }

    private getSearchOverlay(query: any) {
        if (typeof query === 'string') {
            if (query === query.toLowerCase()) {
                query = new RegExp(query.replace(
                    /[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'gi');
            } else {
                query = new RegExp(query.replace(
                    /[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'g');
            }
        } else {
            if (query.flags.indexOf('g') < 0) {
                query = new RegExp(query.source, query.flags + 'g');
            } else {
                query = new RegExp(query.source, query.flags);
            }
        }
        return {
            token: function (stream: any) {
                query.lastIndex = stream.pos;
                let match = query.exec(stream.string);
                if (match && match.index == stream.pos) {
                    stream.pos += match[0].length || 1;
                    return 'searching';
                } else if (match) {
                    stream.pos = match.index;
                } else {
                    stream.skipToEnd();
                }
            }
        };
    };

    private get searchOverlay(): IOverlay | undefined {
        return this._searchOverlay;
    }

    private set searchOverlay(value: IOverlay | undefined) {
        this._searchOverlay = value;
    }

    public search(query: any) {
        if (this.mirror) {
            if (this.searchOverlay) {
                this.mirror.removeOverlay('search')
            }
            if (query.length > 1 || query.source && query.source.length > 1) {
                this.searchOverlay = $.extend(this.getSearchOverlay(query), {
                    name: 'search'
                });
                this.mirror.addOverlay(this.searchOverlay);
            }
        }
    }

    private _spellCheckerOverlay: IOverlay | undefined;
    private _spellChecker: SpellChecker | undefined;
    private _searchOverlay: IOverlay | undefined;
    private _timeoutId: number | undefined;
    private _mdOld: string | undefined;
}

export default MdEditor;
