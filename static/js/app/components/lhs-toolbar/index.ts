import { Location } from "../lhs-editor/location";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

import { Commands } from "../../commands/index";
import { CopyText } from "../../commands/copy-text";
import { CutText } from "../../commands/cut-text";
import { DeleteText } from "../../commands/delete-text";
import { MdBold } from "../../commands/md-bold";
import { MdHeading } from "../../commands/md-heading";
import { MdItalic } from "../../commands/md-italic";
import { MdCode } from "../../commands/md-code";
import { PasteText } from "../../commands/paste-text";
import { RedoText } from "../../commands/redo-text";
import { UndoText } from "../../commands/undo-text";

import { trace } from "../../decorator/trace";

@trace
export class LhsToolbar {
    public static get me(): LhsToolbar {
        if (window.LHS_TOOLBAR === undefined) {
            window.LHS_TOOLBAR = new LhsToolbar();
        }
        return window.LHS_TOOLBAR;
    }
    public constructor() {
        if (!this.ed.mobile) {
            this.ui.$lhsToolbar.fadeIn('slow', () => {
                this.refresh();
            });
        }
        this.ui.$toolbarBold
            .on('click', this.onBoldClick.bind(this));
        this.ui.$toolbarCopy
            .on('click', this.onCopyClick.bind(this));
        this.ui.$toolbarCut
            .on('click', this.onCutClick.bind(this));
        this.ui.$toolbarErase
            .on('click', this.onEraseClick.bind(this));
        this.ui.$toolbarFont
            .on('click', this.onCommentClick.bind(this));
        this.ui.$toolbarHeading
            .on('click', this.onHeadingClick.bind(this));
        this.ui.$toolbarImage
            .on('click', this.onImageClick.bind(this));
        this.ui.$toolbarIndent
            .on('click', this.onIndentClick.bind(this));
        this.ui.$toolbarItalic
            .on('click', this.onItalicClick.bind(this));
        this.ui.$toolbarLink
            .on('click', this.onLinkClick.bind(this));
        this.ui.$toolbarOutdent
            .on('click', this.onOutdentClick.bind(this));
        this.ui.$toolbarPaste
            .on('click', this.onPasteClick.bind(this));
        this.ui.$toolbarProduct
            .on('click', this.onProductClick.bind(this));
        this.ui.$toolbarRedo
            .on('click', this.onRedoClick.bind(this));
        this.ui.$toolbarSum
            .on('click', this.onSumClick.bind(this));
        this.ui.$toolbarSubscript
            .on('click', this.onSubscriptClick.bind(this));
        this.ui.$toolbarSupscript
            .on('click', this.onSupscriptClick.bind(this));
        this.ui.$toolbarUndo
            .on('click', this.onUndoClick.bind(this));
        this.ui.$toolbarVideo
            .on('click', this.onVideoClick.bind(this));
    }
    public refresh() {
        this.ed.refresh();
        this.scroll.refresh();
    }
    private onUndoClick() {
        Commands.me.run(new UndoText()).then(() => {
            this.ed.focus();
        });
    }
    private onRedoClick() {
        Commands.me.run(new RedoText()).then(() => {
            this.ed.focus();
        });
    }
    private onCopyClick() {
        Commands.me.run(new CopyText()).then(() => {
            this.ed.focus();
        });
    }
    private onCutClick() {
        Commands.me.run(new CutText()).then(() => {
            this.ed.focus();
        });
    }
    private onPasteClick() {
        Commands.me.run(new PasteText()).then(() => {
            this.ed.focus();
        });
    }
    private onEraseClick() {
        Commands.me.run(new DeleteText()).then(() => {
            this.ed.focus();
        });
    }
    private onHeadingClick() {
        Commands.me.run(new MdHeading()).then(() => {
            this.ed.focus();
        });
    }
    private onBoldClick() {
        Commands.me.run(new MdBold()).then(() => {
            this.ed.focus();
        });
    }
    private onItalicClick() {
        Commands.me.run(new MdItalic()).then(() => {
            this.ed.focus();
        });
    }
    private onCommentClick() {
        Commands.me.run(new MdCode()).then(() => {
            this.ed.focus();
        });
    }
    private onImageClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, location?: Location
        ) => {
            const v = this.ed.getValue(location);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (location) {
                return new Location(i + location.number);
            } else {
                return new Location(i);
            }
        };
        const { value: caption, lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${caption||'CAPTION'}]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}](URL)`
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        }
        this.ed.focus();
    }
    private onIndentClick() {
        if (this.ed.mirror) {
            this.onIndentClickMirror(this.ed.mirror);
        } else {
            this.onIndentClickSimple();
        }
        this.ed.focus();
    }
    private onIndentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentMore');
    }
    private onIndentClickSimple() {
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        inp.setSelectionRange(idx + 1, idx + 1);
        if (!document.execCommand('insertText', false, '  ')) {
            this.ui.$lhsInput.val(`${px}  ${sx}`);
        }
        inp.setSelectionRange(beg + 2, end + 2);
        this.ui.$lhsInput.trigger('change');
    }
    private onLinkClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, index?: Location
        ) => {
            const v = this.ed.getValue(index);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (index) {
                return new Location(i + index.number);
            } else {
                return new Location(i);
            }
        };
        const { value: text, lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${text||'TEXT'}]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else {
            this.ed.replaceSelection(
                `[${text||'TEXT'}](URL)`
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        }
        this.ed.focus();
    }
    private onOutdentClick() {
        if (this.ed.mirror) {
            this.onOutdentClickMirror(this.ed.mirror);
        } else {
            this.onOutdentClickSimple();
        }
        this.ed.focus();
    }
    private onOutdentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentLess');
    }
    private onOutdentClickSimple() {
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        const rx = /^\s{2}/;
        const mm = sx.match(rx);
        if (mm && mm.length > 0) {
            inp.setSelectionRange(idx + 1, idx + 3);
            if (!document.execCommand('insertText', false, '')) {
                this.ui.$lhsInput.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                inp.setSelectionRange(beg, end);
            } else {
                inp.setSelectionRange(beg - 2, end - 2);
            }
            this.ui.$lhsInput.trigger('change');
        }
    }
    private onSumClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `\n$$\\sum_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(rhs.number, 12)
            );
        } else {
            this.ed.replaceSelection(
                `$\\sum_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 7),
                new Location(rhs.number, 10)
            );
        }
        this.ed.focus();
    }
    private onProductClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `\n$$\\prod_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 10),
                new Location(rhs.number, 13)
            );
        } else {
            this.ed.replaceSelection(
                `$\\prod_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 8),
                new Location(rhs.number, 11)
            );
        }
        this.ed.focus();
    }
    private onSupscriptClick() {
        if (this.ed.isMode('markdown') === false &&
            this.ed.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.ed.getSelection();
        this.ed.insertValue(`^{ }`, rhs);
        this.ed.setSelection(
            new Location(rhs.number, 2),
            new Location(rhs.number, 3)
        );
        this.ed.focus();
    }
    private onSubscriptClick() {
        if (this.ed.isMode('markdown') === false &&
            this.ed.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.ed.getSelection();
        this.ed.insertValue(`_{ }`, rhs);
        this.ed.setSelection(
            new Location(rhs.number, 2),
            new Location(rhs.number, 3)
        );
        this.ed.focus();
    }
    private onVideoClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `@[prezi](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `@[vimeo](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else {
            this.ed.replaceSelection(
                `@[youtube](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 11),
                new Location(lhs.number, 14)
            );
        }
        this.ed.focus();
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.ui.$lhsToolbarOuter[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private _scroll: any;
}
export default LhsToolbar;
