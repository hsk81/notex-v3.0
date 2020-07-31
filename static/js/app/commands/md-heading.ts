import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdHeading implements Command {
    public redo() {
        if (this.ed.mirror) {
            this.onHeadingClickMirror(this.ed.mirror);
        } else {
            this.onHeaderClickSimple();
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
    private onHeadingClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const cursor = mirror.getCursor();
        const curr_from = { line: cursor.line, ch: 0 };
        const next_from = { line: cursor.line + 1, ch: 0 };
        const curr_ts = mirror.getLineTokens(curr_from.line);
        const next_ts = mirror.getLineTokens(next_from.line);
        const line = mirror.getLineHandle(curr_from.line);
        const mode = mirror.getModeAt(curr_from);
        const suffix = line.text.match(/^\s+/) ? '' : ' ';
        let prefix = '#';
        const hs = curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header/);
        });
        const h1s = line.text.match(/^\s*=/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-1/) &&
                tok.string === '=';
        });
        const h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-2/) &&
                tok.string === '-';
        });
        const h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-6/) &&
                tok.string === '#';
        });
        if (mode && mode.name === 'markdown') {
            if (hs && hs.length > 0) {
                if (h1s && h1s.length > 0) {
                    mirror.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    mirror.replaceRange('#' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    mirror.setCursor({
                        ch: 3, line: curr_from.line - 1
                    });
                }
                else if (h2s && h2s.length > 0) {
                    mirror.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    mirror.replaceRange('##' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    mirror.setCursor({
                        ch: 4, line: curr_from.line - 1
                    });
                }
                else if (h6s && h6s.length > 0) {
                    const match = line.text.match(/\s*#{6}\s*/);
                    if (match) {
                        mirror.replaceRange('', curr_from, {
                            ch: match.toString().length,
                            line: curr_from.line,
                        });
                    }
                }
                else {
                    mirror.replaceRange(prefix, {
                        ch: hs[0].start, line: curr_from.line
                    });
                }
            } else {
                if (next_ts.length > 0) {
                    const next_tok = next_ts[next_ts.length - 1];
                    if (next_tok.type && next_tok.type.match(/^header/)) {
                        if (next_tok.string === '=' &&
                            next_tok.type.match(/header-1$/)) {
                            mirror.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '#';
                        }
                        if (next_tok.string === '-' &&
                            next_tok.type.match(/header-2$/)) {
                            mirror.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '##';
                        }
                    }
                }
                mirror.replaceRange(prefix + suffix, curr_from);
            }
        }
    }
    private onHeaderClickSimple() {
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg as number;
        while (idx-- > 0) {
            if (val[idx] === '\n') {
                break;
            }
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        const rx_6 = /^\s*#{6,}\s*/;
        const mm_6 = sx.match(rx_6);
        const rx_5 = /^\s*#{1,5}/;
        const mm_5 = sx.match(rx_5);
        const rx_0 = /^\s*#{0}/;
        const mm_0 = sx.match(rx_0);
        if (mm_6 && mm_6.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_6[0].length + 1
            );
            if (!document.execCommand('insertText', false, '')) {
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_6, '')}`);
            }
            inp.setSelectionRange(
                beg - mm_6[0].length, end - mm_6[0].length
            );
        } else if (mm_5 && mm_5.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_5[0].length + 1
            );
            if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_5, mm_5[0] + '#')}`);
            }
            inp.setSelectionRange(
                beg + 1, end + 1
            );
        } else if (mm_0 && mm_0.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_0[0].length + 1
            );
            if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_0, '# ' + mm_0[0])}`);
            }
            inp.setSelectionRange(
                beg + mm_0[0].length + 2, end + mm_0[0].length + 2
            );
        }
        this.ui.$lhsInput.trigger('change');
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }

}
export default MdHeading;
