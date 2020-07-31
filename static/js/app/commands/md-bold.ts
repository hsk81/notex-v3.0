import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdBold implements Command {
    public redo() {
        if (this.ed.mirror) {
            this.onBoldClickMirror(this.ed.mirror);
        } else {
            this.onBoldClickSimple();
        }
        return Promise.resolve(this);
    }
    public undo() {
        const mirror = this.ed.mirror;
        if (mirror) {
            mirror.execCommand('undo');
        } else {
            try {
                document.execCommand('undo')
            } catch (ex) {
                console.error(ex);
            }
            this.ui.$lhsInput.trigger('change');
        }
        return Promise.resolve(this);
    }
    private onBoldClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                const lhs_mod = mirror.getModeAt(sel.head);
                const rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        return {
                            anchor: this.lhs(mirror, sel.anchor, tok),
                            head: this.rhs(mirror, sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            (mirror as any).replaceSelections(selections.map((sel: any) => {
                let sel_lhs = sel.anchor;
                let sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch
                ) {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                const mod_lhs = mirror.getModeAt(sel_lhs);
                const mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        const lhs = this.lhs(mirror, sel_lhs, tok);
                        const rhs = this.rhs(mirror, sel_rhs, tok);
                        if (tok.type.match(/em/)) {
                            return `*${mirror.getRange(lhs, rhs)}*`;
                        } else {
                            return mirror.getRange(lhs, rhs).slice(2, -2);
                        }
                    } else {
                        return `**${mirror.getRange(sel_lhs, sel_rhs)}**`;
                    }
                } else {
                    return mirror.getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            const cur = mirror.getCursor();
            const mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                const tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)
                ) {
                    const lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    if (tok.type.match(/em/)) {
                        const src = mirror.getRange(lhs, rhs);
                        const tgt = `*${src}*`;
                        mirror.replaceRange(tgt, lhs, rhs);
                        mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch + 2
                        });
                    } else {
                        const src = mirror.getRange(lhs, rhs);
                        const tgt = src.slice(2, -2);
                        mirror.replaceRange(tgt, lhs, rhs);
                        mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 4
                        });
                    }
                } else {
                    mirror.replaceRange('****', cur);
                    mirror.setCursor({
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }
    private onBoldClickSimple() {
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        const px_1 = val.substring(0, beg);
        const ix_1 = val.substring(beg, end);
        const sx_1 = val.substring(end, val.length);
        const px_2 = val.substring(0, beg - 2);
        const ix_2 = val.substring(beg - 2, end + 2);
        const sx_2 = val.substring(end + 2, val.length);
        const rx_1 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        const mm_1 = ix_1.match(rx_1);
        const rx_2 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        const mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ui.$lhsInput.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 4);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 2, end + 2);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ui.$lhsInput.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 2, end - 2);
        } else {
            if (!document.execCommand('insertText', false, `**${ix_1}**`)) {
                this.ui.$lhsInput.val(`${px_1}**${ix_1}**${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 4);
        }
        this.ui.$lhsInput.trigger('change');
    }
    private lhs(
        mirror: CodeMirror.Editor, cursor: any, token: any
    ): CodeMirror.Position {
        let last = { line: cursor.line, ch: cursor.ch };
        let next = { line: cursor.line, ch: cursor.ch };
        while (true) {
            const next_token = mirror.getTokenAt(next);
            if (next_token.type && !next_token.type.match(token.type) ||
                !next_token.type && next_token.type !== token.type) {
                return last = {
                    ch: next.ch, line: next.line
                };
            } else {
                last = {
                    ch: next.ch, line: next.line
                };
            }
            if (next.ch > 0) {
                next.ch -= 1;
            } else {
                if (next.line > 0) {
                    next.line -= 1;
                    next.ch = mirror.getLine(
                        next.line
                    ).length;
                } else {
                    return last;
                }
            }
        }
    }
    private rhs(
        mirror: CodeMirror.Editor, cursor: any, token: any
    ): CodeMirror.Position {
        let last = { line: cursor.line, ch: cursor.ch };
        let next = { line: cursor.line, ch: cursor.ch };
        while (true) {
            const next_token = mirror.getTokenAt(next);
            if (next_token.type && !next_token.type.match(token.type) ||
                !next_token.type && next_token.type !== token.type
            ) {
                return last;
            } else {
                last = {
                    ch: next.ch, line: next.line
                };
            }
            if (next.ch < mirror.getLine(next.line).length) {
                next.ch += 1;
            } else {
                if (next.line < mirror.lineCount()) {
                    next.line += 1;
                    next.ch = mirror
                        .getLine(next.line).length;
                } else {
                    return last;
                }
            }
        }
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }

}
export default MdBold;
