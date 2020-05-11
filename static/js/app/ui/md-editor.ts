import { buffered } from "../decorator/buffered";
import { traceable } from "../decorator/trace";
import { trace } from "../decorator/trace";
import { cookie } from "../cookie/cookie";

import { TemplateManager } from "./manager-template";
import { DownloadManager } from "./manager-download";
import { MarkdownIt } from "../markdown-it/markdown-it";

import { ILingua } from "../spell-checker/spell-checker";
import { IOverlay } from "../spell-checker/spell-checker";
import { SpellChecker } from "../spell-checker/spell-checker";

import { IPFS, Buffer } from "../ipfs/index";
import "./md-editor-mode";

declare const morphdom: any;
declare const $: JQueryStatic;
declare const CodeMirror: {
    fromTextArea: (
        host: HTMLTextAreaElement,
        options?: CodeMirror.EditorConfiguration
    ) => CodeMirror.EditorFromTextArea
};

export class Index {
    public constructor(
        index: number | CodeMirror.Position, delta = 0
    ) {
        if (typeof index === 'number') {
            this._position = Index.asPosition(index + delta);
            this._index = index + delta;
        } else {
            this._index = Index.asNumber(index) + delta;
            if (delta !== 0) {
                this._position = Index.asPosition(this._index);
            } else {
                this._position = index;
            }
        }
    }
    public get position(): CodeMirror.Position {
        return this._position;
    }
    public static asPosition(index: number): CodeMirror.Position {
        let mirror = MdEditor.me.mirror;
        if (mirror) {
            return mirror.posFromIndex(index);
        }
        let values = this.values(index);
        return {
            ch: values[values.length - 1].length - 1,
            line: values.length
        };
    }
    public get number(): number {
        return this._index;
    }
    public static asNumber(position: CodeMirror.Position): number {
        let mirror = MdEditor.me.mirror;
        if (mirror) {
            return mirror.indexFromPos(position);
        }
        let values = this.values();
        values = values.slice(0, position.line - 1);
        let text = values.join('\n');
        text += values[position.line].slice(0, position.ch);
        return text.length;
    }
    private static values(index?: number): string[] {
        let value = MdEditor.me.getValue();
        if (index !== undefined) {
            return value.substring(0, index).split('\n');
        }
        return value.split('\n');
    }
    private _position: CodeMirror.Position;
    private _index: number;
}
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
        $.get(this.placeholder).done((html) => {
            this.$cached_body.html(html).find('>*').hide().fadeIn('fast');
            this.$output_body.html(html).find('>*').hide().fadeIn('fast');
        });
        if (this.$cached[0].contentWindow) {
            this.$cached[0].contentWindow.PATCH = () => this.patch();
        }
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
            mirror.on(
                'scroll', (cm: CodeMirror.Editor) => {
                    this.onScroll(cm.getScrollerElement());
                }
            )
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
            .off('scroll')
            .on('scroll', (ev: JQueryEventObject) => {
                this.onScroll(ev.target as HTMLElement)
            })
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
    public onScroll(e: HTMLElement) {
        const synchronize = ($body: JQuery<HTMLElement>) => {
            const q = e.scrollTop / e.scrollHeight;
            const h = $body[0].scrollHeight;
            const c = $body[0].clientHeight;
            $body.scrollTop(q*h+q*c);
        };
        synchronize(this.$cached_body);
        synchronize(this.$output_body);
    }
    @buffered(40)
    public render(force = false) {
        const value = this.getValue();
        if (force) {
            this.$output_body.html('');
        }
        if (value.length === 0) {
            $.get(this.placeholder).done((html) => {
                this.$cached_body.hide().html(html);
                this.$cached_body.delay(200).fadeIn('fast');
                this.$output_body.hide().html(html);
                this.$output_body.delay(200).fadeIn('fast');
            });
        }
        this.$cached_body.html(
            MarkdownIt.me.render(
                TemplateManager.me.apply(value), {
                    document: this.$cached.contents()[0] as Document
                }
            )
        );
        if (value.length > 0) {
            const $header = this.$cached_body.find(':header');
            DownloadManager.me.title = $header.length === 0
                ? `${new Date().toISOString()}.md`
                : `${$($header[0]).text().slice(0,-2)}.md`;
            DownloadManager.me.content = value;
        }
    }
    @buffered(0)
    public patch() {
        morphdom(this.$output_head[0], this.$cached_head[0], {
            onBeforeElUpdated: (source: HTMLElement, target: HTMLElement) => {
                return !source.isEqualNode(target);
            }
        });
        morphdom(this.$output_body[0], this.$cached_body[0], {
            onBeforeElUpdated: (source: HTMLElement, target: HTMLElement) => {
                return !source.isEqualNode(target);
            }
        });
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
    public get value(): string {
        return this.getValue();
    }
    @traceable(false)
    public getValue(
        lhs?: Index, rhs?: Index
    ): string {
        let value = this.mirror
            ? this.mirror.getValue()
            : this.$input.val() as string;
        if (lhs && rhs) {
            return value.substring(lhs.number, rhs.number);
        } else if (lhs && !rhs) {
            return value.substring(lhs.number);
        } else {
            return value;
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
    public insertValue(value: string, at?: Index) {
        if (at === undefined) {
            let { rhs: at } = this.getSelection();
            this.setSelection(at, at);
        } else {
            this.setSelection(at, at);
        }
        this.replaceSelection(value);
    }
    public appendValue(value: string) {
        this.setValue(this.value + value);
    }
    public getSelection(): {
        lhs: Index, rhs: Index, value: string
    } {
        if (this.mirror) {
            let lhs = new Index(this.mirror.getCursor('from'));
            let rhs = new Index(this.mirror.getCursor('to'));
            return {
                lhs, rhs, value: this.mirror.getSelection()
            };
        } else {
            let inp = this.$input[0] as HTMLInputElement;
            let lhs = new Index(Math.min(
                inp.selectionStart as number,
                inp.selectionEnd as number
            ));
            let rhs = new Index(Math.max(
                inp.selectionStart as number,
                inp.selectionEnd as number
            ));
            return {
                lhs, rhs, value: inp.value.substring(
                    lhs.number, rhs.number
                )
            };
        }
    }
    public setSelection(
        lhs: Index, rhs: Index
    ) {
        if (this.mirror) {
            this.mirror.setSelection(
                lhs.position, rhs.position
            );
        } else {
            let inp = this.$input[0] as HTMLInputElement;
            inp.setSelectionRange(lhs.number, rhs.number);
        }
    }
    public replaceSelection(value: string) {
        if (this.mirror) {
            this.mirror.replaceSelection(value);
        } else {
            try {
                document.execCommand('insertText', false, value);
            } catch (ex) {
                console.error(ex);
            }
            this.$input.trigger('change');
        }
        this.focus();
    }
    public get mode() {
        if (this.mirror) {
            let lhs_cur = this.mirror.getCursor('from');
            let lhs = this.mirror.getModeAt(lhs_cur);
            let rhs_cur = this.mirror.getCursor('to');
            let rhs = this.mirror.getModeAt(rhs_cur);
            return { lhs, rhs };
        }
        return {
            lhs: undefined, rhs: undefined
        };
    }
    public isMode(mode: string) {
        let my_mode = this.mode;
        if (my_mode.lhs === undefined ||
            my_mode.rhs === undefined
        ) {
            return undefined;
        }
        return my_mode.lhs.name === mode &&
               my_mode.rhs.name === mode;
    }
    private events() {
        this.dnd();
    }
    public dnd() {
        this.$document.on('dragenter dragover dragleave drop', (ev) => {
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
                this.replaceSelection(
                    `![${name||''}](${gateway}/ipfs/${hash})\n`
                );
            };
            IPFS.me((ipfs: any) => {
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
    private onEditorChange() {
        $(this).trigger('change');
        this.render();
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
    public search(query: string | RegExp, options?: {
        altKey: boolean, ctrlKey: boolean, shiftKey: boolean
    }) {
        if (!options || !options.ctrlKey) {
            this.select(query, !options?.shiftKey ? '+' : '-');
        }
        if (this.mirror) {
            if (this.searchOverlay) {
                this.mirror.removeOverlay('search')
            }
            if (typeof query === 'string' && query.length > 0 ||
                typeof query !== 'string' && query.source && query.source.length > 0
            ) {
                this.searchOverlay = $.extend(this.getSearchOverlay(query), {
                    name: 'search'
                });
                this.mirror.addOverlay(this.searchOverlay);
            }
        }
    }
    public replace(query: string | RegExp, new_value: string, options?: {
        altKey: boolean, ctrlKey: boolean, shiftKey: boolean
    }) {
        if (!options || !options.ctrlKey) {
            if (!options || !options.altKey) {
                let beg_value = this.getValue(new Index(0), new Index(this.index||0));
                let end_value = this.getValue(new Index(this.index||0));
                this.setValue(beg_value + end_value.replace(query, new_value));
            }
            this.select(query, !options?.shiftKey ? '+' : '-');
        } else {
            let { lhs, rhs, value } = this.getSelection();
            if (value) {
                let lhs_value = this.getValue(new Index(0), lhs);
                let mid_value = value.replace(query, new_value);
                let rhs_value = this.getValue(rhs);
                this.setValue(
                    `${lhs_value}${mid_value}${rhs_value}`
                );
                let delta = typeof query === 'string'
                    ? new_value.length - query.length
                    : new_value.length - query.source.length;
                this.setSelection(
                    lhs, new Index(rhs.number + delta)
                );
            }
        }
    }
    private select(query: string | RegExp, direction: '+' | '-') {
        let length = (query: string | RegExp) => {
            return typeof query !== 'string'
                ? query.source.length : query.length;
        };
        let next = (index: number | undefined) => {
            if (index !== undefined) {
                let n = this.value.substring(index + 1).search(query);
                return n >= 0 ? n + (index + 1) : undefined;
            } else {
                let n = this.value.search(query);
                return n >= 0 ? n : undefined;
            }
        };
        let prev = (index: number | undefined) => {
            let p: number | undefined;
            while (true) {
                let n = next(p);
                if (n !== undefined) {
                    if (index === undefined || n < index) {
                        p = n; continue;
                    }
                }
                break;
            }
            return p;
        };
        let lhs = (index: number) => {
            return new Index(index);
        };
        let rhs = (index: number) => {
            let m = this.value.substring(index).match(query);
            return m ? new Index(index + m[0].length) : new Index(index);
        }
        if (length(query) > 0) {
            this.index = direction === '+'
                ? next(this.index) : prev(this.index);
            if (this.index !== undefined) {
                this.setSelection(lhs(this.index), rhs(this.index));
            }
        } else {
            this.index = undefined;
        }
    }
    private get placeholder(): string {
        return '/editor/0200-center/0221-rhs.output-placeholder.html';
    }
    private get index(): number | undefined {
        return window['INDEX'];
    }
    private set index(value: number | undefined) {
        window['INDEX'] = value;
    }
    private get $document() {
        return $(document);
    }
    private get $footer() {
        return this.$input.siblings('.footer');
    }
    public get $input() {
        return this.$lhs.find('#input');
    }
    public get $viewer() {
        if (this.$cached.css('visibility') !== 'hidden') {
            return this.$cached;
        } else {
            return this.$output;
        }
    }
    private get $cached() {
        return this.$rhs.find('#cached') as JQuery<HTMLFrameElement>;
    }
    private get $output() {
        return this.$rhs.find('#output') as JQuery<HTMLFrameElement>;
    }
    private get $cached_head() {
        return this.$cached.contents().find('head') as JQuery<HTMLElement>;
    }
    private get $output_head() {
        return this.$output.contents().find('head') as JQuery<HTMLElement>;
    }
    private get $cached_body() {
        return this.$cached.contents().find('body') as JQuery<HTMLElement>;
    }
    private get $output_body() {
        return this.$output.contents().find('body') as JQuery<HTMLElement>;
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
