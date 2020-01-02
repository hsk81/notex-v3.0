import { buffered } from "../decorator/buffered";
import { traceable } from "../decorator/trace";
import { trace } from "../decorator/trace";
import { cookie } from "../cookie/cookie";

import { DownloadManager } from "./download-manager";
import { MarkdownIt } from "../markdown-it/markdown-it";

import { ILingua } from "../spell-checker/spell-checker";
import { IOverlay } from "../spell-checker/spell-checker";
import { SpellChecker } from "../spell-checker/spell-checker";

import { Ipfs, Buffer } from "../ipfs/index";

import * as snabbdom from '@npm/snabbdom';
import * as snabbdom_attrs from '@npm/snabbdom/modules/attributes';
import * as snabbdom_class from '@npm/snabbdom/modules/class';
import * as snabbdom_event from '@npm/snabbdom/modules/eventlisteners';
import * as snabbdom_props from '@npm/snabbdom/modules/props';
import * as snabbdom_style from '@npm/snabbdom/modules/style';

import { toVNode } from '@npm/snabbdom/tovnode';
import { VNode } from "@npm/snabbdom/vnode";

window['VDOM'] = snabbdom;
window['VDOM_TO_VNODE'] = toVNode;

import "./md-editor-mode";

declare const $: JQueryStatic;
declare const CodeMirror: {
    fromTextArea: (
        host: HTMLTextAreaElement,
        options?: CodeMirror.EditorConfiguration
    ) => CodeMirror.EditorFromTextArea
};

export type Position = number | CodeMirror.Position;
export enum UiMode {
    simple = 'ui-simple',
    mirror = 'ui-mirror'
}
@trace
export class MdEditor {
    public static get me(this: any): MdEditor {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR'] = new MdEditor();
        }
        return this['_me'];
    }
    public constructor() {
        this.patch = snabbdom.init([
            snabbdom_attrs.default,
            snabbdom_class.default,
            snabbdom_props.default,
            snabbdom_style.default,
            snabbdom_event.default
        ]);
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
        this.events();
    }
    public toMirror(): any {
        let ta = document.getElementById('input') as HTMLTextAreaElement;
        let mirror = this.mirror;
        if (mirror === undefined) {
            mirror = CodeMirror.fromTextArea(ta, {
                addModeClass: true,
                lineWrapping: true,
                lineNumbers: true,
                matchBrackets: true,
                mode: 'notex-md',
                styleActiveLine: true,
                undoDepth: 4096
            } as any);
            mirror.setOption('extraKeys', {
                'Tab': (cm: any) => {
                    cm.execCommand('indentMore');
                },
                'Shift-Tab': (cm: any) => {
                    cm.execCommand('indentLess');
                }
            });
            mirror.on(
                'change', this.onEditorChange.bind(this)
            );
            this.setMirror(mirror);
        }
        if (this.spellCheckerOverlay) {
            mirror.removeOverlay(this.spellCheckerOverlay);
            mirror.addOverlay(this.spellCheckerOverlay);
        }
        this.simple = false;
        this.$input.hide();
        return this.mirror;
    }
    public toInput(options: {
        footer: boolean, toolbar: boolean
    }): any {
        let mirror = this.mirror as CodeMirror.EditorFromTextArea;
        if (mirror) {
            if (this.spellCheckerOverlay) {
                mirror.removeOverlay(this.spellCheckerOverlay);
            }
            mirror.toTextArea();
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
    public render(force = false) {
        const $output = $('#output');
        const $cached = $('#cached');
        if (!this._mdOld || this._mdOld.length === 0) {
            $output.empty();
        }
        const value = this.getValue();
        if (value.length === 0) {
            $.get(
                '/editor/0200-center/0222-rhs.output-placeholder.html'
            ).done((html) => {
                $output.html(html);
                $output.find('>*').hide().fadeIn('fast');
                this.vnode = undefined;
            });
        }
        if (value.length > 0 && value.length !== this._mdOld.length ||
            value.length > 0 && value !== this._mdOld ||
            value.length > 0 && force
        ) {
            const render = () => {
                const new_vnode = snabbdom.h(
                    'div#output', toVNode($cached[0]).children
                );
                const old_vnode = (
                    this.vnode ? this.vnode : $output[0]
                );
                this.vnode = this.patch(old_vnode, new_vnode);
            };
            $cached.html(MarkdownIt.me.render(value));
            if (typeof MathJax !== 'undefined') try {
                const math_jax = MathJax as any;
                math_jax.Hub.Queue([
                    'resetEquationNumbers', math_jax.InputJax.TeX
                ], [
                    'Typeset', math_jax.Hub, 'cached', render
                ]);
            } catch (ex) {
                render();
            } else {
                render();
            }
        }
        if (value.length > 0 && value.length !== this._mdOld.length ||
            value.length > 0 && value !== this._mdOld
        ) {
            const $header = $cached.find(':header');
            DownloadManager.me.title = $header.length === 0
                ? `${new Date().toISOString()}.md`
                : `${$($header[0]).text()}.md`;
            DownloadManager.me.content = value;
        }
        this._mdOld = value;
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
    public clear() {
        if (this.mirror) {
            return this.mirror.setValue('');
        } else {
            this.$input.val('');
            this.$input.trigger('change');
        }
    }
    public get empty() {
        return !this.getValue();
    }
    @traceable(false)
    public getValue(): string {
        if (this.mirror) {
            return this.mirror.getValue();
        } else {
            return this.$input.val() as string;
        }
    }
    @traceable(false)
    public setValue(value: string) {
        let inp = this.$input[0] as HTMLInputElement;
        if (this.mirror) {
            return this.mirror.setValue(value);
        } else {
            inp.select();
            if (!document.execCommand('insertText', false, value)) {
                this.$input.val(value);
            }
            inp.setSelectionRange(0, 0);
            this.$input.trigger('change');
        }
    }
    public getRange(lhs: Position, rhs?: Position): string {
        if (rhs === undefined) {
            rhs = lhs;
        }
        if (this.mirror) {
            return this.mirror.getRange(
                lhs as CodeMirror.Position,
                rhs as CodeMirror.Position
            );
        } else {
            let inp = this.$input[0] as HTMLInputElement;
            return inp.value.substring(lhs as number, rhs as number);
        }
    }
    public getSelection(): {
        lhs: Position, rhs: Position, value: string
    } {
        if (this.mirror) {
            let lhs = this.mirror.getCursor('from');
            let rhs = this.mirror.getCursor('to');
            return {
                lhs, rhs, value: this.mirror.getSelection()
            };
        } else {
            let inp = this.$input[0] as HTMLInputElement;
            let lhs = inp.selectionStart as number;
            let rhs = inp.selectionEnd as number;
            return {
                lhs, rhs, value: inp.value.substring(lhs, rhs)
            };
        }
    }
    public setSelection(lhs: Position, rhs: Position) {
        if (this.mirror) {
            this.mirror.setSelection(
                lhs as CodeMirror.Position,
                rhs as CodeMirror.Position
            );
        } else {
            let inp = this.$input[0] as HTMLInputElement;
            inp.setSelectionRange(lhs as number, rhs as number);
        }
    }
    private events() {
        this.dnd();
    }
    public dnd() {
        this.$doc.on('dragenter dragover dragleave drop', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.$lhs.on('dragenter dragleave', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.$lhs.on('dragover', (ev) => {
            const event = ev.originalEvent as DragEvent;
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.$lhs.on('drop', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.$lhs.on('drop', (event) => {
            const ev = event.originalEvent as DragEvent;
            if (!ev) {
                return;
            }
            const ev_dataTransfer = ev.dataTransfer;
            if (!ev_dataTransfer) {
                return;
            }
            const ev_files = ev_dataTransfer.files;
            if (!ev_files || !ev_files.length) {
                return;
            }
            const insert_image = (
                name: string, hash: string,
                gateway = 'https://cloudflare-ipfs.com'
            ) => {
                this.insert(`![${name||''}](${gateway}/ipfs/${hash})\n`);
            };
            Ipfs.me.then((ipfs: any) => {
                for (let i = 0; i < ev_files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const buffer = Buffer.from(reader.result);
                        ipfs.add(buffer, (e: any, files: any) => {
                            if (e) return console.error(e);
                            insert_image(ev_files[i].name, files[0].hash);
                        });
                    };
                    reader.readAsArrayBuffer(ev_files[i]);
                }
            }).catch((e) => {
                console.error(e);
            });
        });
    }
    private insert(text: string) {
        if (this.mirror) {
            this.mirror.replaceSelection(text);
        } else {
            try {
                document.execCommand('insertText', false, text);
            } catch (ex) {
                console.error(ex);
            }
            this.$input.trigger('change');
        }
        this.focus();
    }
    private onEditorChange() {
        setTimeout(() => {
            $(this).trigger('change');
        }, 0);
        if (typeof MathJax === 'undefined') try {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.mathjaxUrl;
            script.async = true;
            const head = document.getElementsByTagName('head');
            head[0].appendChild(script);
        } catch (ex) {
            console.error(ex);
        }
        this.render();
    }
    private get mathjaxUrl(): string {
        return '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js'
             + '?config=TeX-MML-AM_CHTML';
    }
    public get $input() {
        return $('#input');
    }
    public get $footer() {
        return this.$input.siblings('.footer');
    }
    public get mirror(): CodeMirror.Editor | undefined {
        return window['CODE_MIRROR'];
    }
    private setMirror(
        value: CodeMirror.Editor | undefined
    ) {
        window['CODE_MIRROR'] = value;
    }
    public get mobile(): boolean {
        return $('.lhs').is(':hidden') && !window.debug;
    }
    private get simple(): boolean {
        const value = cookie.get<boolean>('simple-flag');
        if (value === undefined) {
            cookie.set<boolean>('simple-flag', false);
            return false;
        }
        return value;
    }
    private set simple(value: boolean) {
        cookie.set<boolean>('simple-flag', value);
        $(this).trigger('ui-mode', {
            value: value ? UiMode.simple : UiMode.mirror
        });
    }
    public get uiMode(): UiMode {
        const value = cookie.get<boolean>('simple-flag');
        return value ? UiMode.simple : UiMode.mirror;
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
    private get patch(): any {
        return window['VDOM_PATCH'];
    }
    private set patch(value: any) {
        window['VDOM_PATCH'] = value;
    }
    private get vnode(): VNode | undefined {
        return window['VDOM_VNODE'] as VNode;
    }
    private set vnode(value: VNode | undefined) {
        window['VDOM_VNODE'] = value;
    }
    private get $doc() {
        return $(document);
    }
    private get $lhs() {
        return $('.lhs');
    }
    private get $rhs() {
        return $('.rhs');
    }
    private _spellCheckerOverlay: IOverlay | undefined;
    private _spellChecker: SpellChecker | undefined;
    private _searchOverlay: IOverlay | undefined;
    private _mdOld: string = '';
}
export default MdEditor;
