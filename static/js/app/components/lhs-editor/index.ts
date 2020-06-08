import { MdRender } from "../../ui/md-render";
import { Location } from "./location";
import { UiMode } from "./ui-mode";
import { Ui } from "../../ui/ui";

import { Lingua } from "../../spell-checker/spell-checker";
import { Overlay } from "../../spell-checker/spell-checker";
import { SpellChecker } from "../../spell-checker/spell-checker";

import { IPFS, Buffer } from "../../ipfs/index";
import { gateway } from "../../ipfs/index";

import { traceable } from "../../decorator/trace";
import { trace } from "../../decorator/trace";
import { cookie } from "../../cookie/cookie";

import "./md-mode";

declare const $: JQueryStatic;
declare const CodeMirror: {
    fromTextArea: (
        host: HTMLTextAreaElement,
        options?: CodeMirror.EditorConfiguration
    ) => CodeMirror.EditorFromTextArea
};

@trace
export class LhsEditor {
    public static get me(): LhsEditor {
        if (window.LHS_EDITOR === undefined) {
            window.LHS_EDITOR = new LhsEditor();
        }
        return window.LHS_EDITOR;
    }
    public constructor() {
        if (this.mobile) {
            this.toInput({ footer: false });
        } else if (this.simple) {
            this.toInput({ footer: true });
        } else {
            this.toMirror();
        }
        this.events();
    }
    public toMirror(): any {
        const ta = document.getElementById('input') as HTMLTextAreaElement;
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
        this.ui.$lhsInput.hide();
        return this.mirror;
    }
    public toInput(options: {
        footer: boolean
    }): any {
        const mirror = this.mirror as CodeMirror.EditorFromTextArea;
        if (mirror) {
            if (this.spellCheckerOverlay) {
                mirror.removeOverlay(this.spellCheckerOverlay);
            }
            mirror.toTextArea();
            this.setMirror(undefined);
        }
        this.ui.$lhsInput
            .off('keyup change paste')
            .on('keyup change paste', this.onEditorChange.bind(this))
            .off('scroll')
            .on('scroll', (ev: JQueryEventObject) => {
                this.onScroll(ev.target as HTMLElement)
            })
            .show();
        if (options.footer) {
            this.ui.$lhs.addClass('with-footer');
        } else {
            this.ui.$lhs.removeClass('with-footer');
        }
        this.simple = true;
        return this.ui.$lhsInput;
    }
    public onScroll(e: HTMLElement) {
        const $body = this.ui.$viewerContentBody;
        const q = e.scrollTop / e.scrollHeight;
        const h = $body[0].scrollHeight;
        const c = $body[0].clientHeight;
        this.doScroll(q*h+q*c);
    }
    public doScroll(value: number) {
        this.ui.$viewerContentBody.scrollTop(value);
    }
    public render(force: 'hard'|'soft'|'none' = 'none') {
        this.renderer.do(force);
    }
    public get title() {
        return this.renderer.title;
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
            this.ui.$lhsInput.focus();
        }
    }
    public clear() {
        if (this.mirror) {
            return this.mirror.setValue('');
        } else {
            this.ui.$lhsInput.val('');
            this.ui.$lhsInput.trigger('change');
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
        lhs?: Location, rhs?: Location
    ): string {
        const value = this.mirror
            ? this.mirror.getValue()
            : this.ui.$lhsInput.val() as string;
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        if (this.mirror) {
            return this.mirror.setValue(value);
        } else {
            inp.select();
            if (!document.execCommand('insertText', false, value)) {
                this.ui.$lhsInput.val(value);
            }
            inp.setSelectionRange(0, 0);
            this.ui.$lhsInput.trigger('change');
        }
    }
    public insertValue(value: string, at?: Location) {
        if (at === undefined) {
            const { rhs: at } = this.getSelection();
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
        lhs: Location, rhs: Location, value: string
    } {
        if (this.mirror) {
            const lhs = new Location(this.mirror.getCursor('from'));
            const rhs = new Location(this.mirror.getCursor('to'));
            return {
                lhs, rhs, value: this.mirror.getSelection()
            };
        } else {
            const inp = this.ui.$lhsInput[0] as HTMLInputElement;
            const lhs = new Location(Math.min(
                inp.selectionStart as number,
                inp.selectionEnd as number
            ));
            const rhs = new Location(Math.max(
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
        lhs: Location, rhs: Location
    ) {
        if (this.mirror) {
            this.mirror.setSelection(
                lhs.position, rhs.position
            );
        } else {
            const inp = this.ui.$lhsInput[0] as HTMLInputElement;
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
            this.ui.$lhsInput.trigger('change');
        }
        this.focus();
    }
    public get mode() {
        if (this.mirror) {
            const lhs_cur = this.mirror.getCursor('from');
            const lhs = this.mirror.getModeAt(lhs_cur);
            const rhs_cur = this.mirror.getCursor('to');
            const rhs = this.mirror.getModeAt(rhs_cur);
            return { lhs, rhs };
        }
        return {
            lhs: undefined, rhs: undefined
        };
    }
    public isMode(mode: string) {
        const my_mode = this.mode;
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
        const set_text = (
            value: string
        ) => {
            if (!this.mirror) {
                this.setValue(value);
                this.setSelection(new Location(0), new Location(-1));
            }
        };
        const ins_image = (
            name: string, hash: string
        ) => {
            const url = `${gateway.get()}/${hash}`;
            const query = name ? `?filename=${encodeURIComponent(name)}` : '';
            this.replaceSelection(`![${name||''}](${url}${query})\n`);
        };
        this.ui.$document.on('dragenter dragover dragleave drop', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.ui.$lhs.on('dragenter dragleave', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.ui.$lhs.on('dragover', (ev) => {
            const event = ev.originalEvent as DragEvent;
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.ui.$lhs.on('drop', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        this.ui.$lhs.on('drop', (event) => {
            const ev = event.originalEvent as DragEvent;
            if (!ev) {
                return;
            }
            const ev_dtx = ev.dataTransfer;
            if (!ev_dtx) {
                return;
            }
            const ev_files = ev_dtx.files;
            if (!ev_files || !ev_files.length) {
                return;
            }
            IPFS.me((ipfs: any) => {
                for (let i = 0; i < ev_files.length; i++) {
                    if (typeof ev_files[i].type === 'string' &&
                        ev_files[i].type.match(/^image/i) !== null
                    ) {
                        const reader = new FileReader();
                        reader.onload = async function () {
                            const buffer = Buffer.from(reader.result);
                            for await (const item of ipfs.add(buffer)) {
                                const name = ev_files[i].name;
                                const hash = item.cid.toString();
                                ins_image(name, hash);
                            }
                        };
                        reader.readAsArrayBuffer(ev_files[i]);
                    }
                    if (typeof ev_files[i].type === 'string' &&
                        ev_files[i].type.match(/^text/i) !== null
                    ) {
                        const reader = new FileReader();
                        reader.onload = () => set_text(reader.result as string);
                        reader.readAsText(ev_files[i]);
                    }
                }
            });
        });
    }
    private onEditorChange() {
        $(this).trigger('change');
        this.render('none');
    }
    private get renderer() {
        return MdRender.me;
    }
    public get mirror(): CodeMirror.Editor|undefined {
        return window.CODE_MIRROR;
    }
    private setMirror(
        value: CodeMirror.Editor|undefined
    ) {
        window.CODE_MIRROR = value;
    }
    public get mobile(): boolean {
        return window.screen.width < 768;
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
    private set spellChecker(value: SpellChecker|undefined) {
        this._spellChecker = value;
    }
    private get spellCheckerOverlay(): Overlay|undefined {
        return this._spellCheckerOverlay;
    }
    private set spellCheckerOverlay(value: Overlay|undefined) {
        this._spellCheckerOverlay = value;
    }
    public spellCheck(
        lingua: Lingua, callback: (error: boolean) => void
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
                const match = query.exec(stream.string);
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
    private get searchOverlay(): Overlay|undefined {
        return this._searchOverlay;
    }
    private set searchOverlay(value: Overlay|undefined) {
        this._searchOverlay = value;
    }
    public search(query: string|RegExp, options?: {
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
    public replace(query: string|RegExp, new_value: string, options?: {
        altKey: boolean, ctrlKey: boolean, shiftKey: boolean
    }) {
        if (!options || !options.ctrlKey) {
            if (!options || !options.altKey) {
                const beg_value = this.getValue(new Location(0), new Location(this.index||0));
                const end_value = this.getValue(new Location(this.index||0));
                this.setValue(beg_value + end_value.replace(query, new_value));
            }
            this.select(query, !options?.shiftKey ? '+' : '-');
        } else {
            const { lhs, rhs, value } = this.getSelection();
            if (value) {
                const lhs_value = this.getValue(new Location(0), lhs);
                const mid_value = value.replace(query, new_value);
                const rhs_value = this.getValue(rhs);
                this.setValue(
                    `${lhs_value}${mid_value}${rhs_value}`
                );
                const delta = typeof query === 'string'
                    ? new_value.length - query.length
                    : new_value.length - query.source.length;
                this.setSelection(
                    lhs, new Location(rhs.number + delta)
                );
            }
        }
    }
    private select(query: string|RegExp, direction: '+'|'-') {
        const length = (query: string|RegExp) => {
            return typeof query !== 'string'
                ? query.source.length : query.length;
        };
        const next = (index: number|undefined) => {
            if (index !== undefined) {
                const n = this.value.substring(index + 1).search(query);
                return n >= 0 ? n + (index + 1) : undefined;
            } else {
                const n = this.value.search(query);
                return n >= 0 ? n : undefined;
            }
        };
        const prev = (index: number|undefined) => {
            let p: number|undefined;
            while (true) {
                const n = next(p);
                if (n !== undefined) {
                    if (index === undefined || n < index) {
                        p = n; continue;
                    }
                }
                break;
            }
            return p;
        };
        const lhs = (index: number) => {
            return new Location(index);
        };
        const rhs = (index: number) => {
            const match = this.value.substring(index).match(query);
            return match
                ? new Location(index + match[0].length)
                : new Location(index);
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
    private get index(): number|undefined {
        return window.INDEX;
    }
    private set index(value: number|undefined) {
        window.INDEX = value;
    }
    private get ui() {
        return Ui.me;
    }
    private _spellCheckerOverlay: Overlay|undefined;
    private _spellChecker: SpellChecker|undefined;
    private _searchOverlay: Overlay|undefined;
}
export default LhsEditor;
