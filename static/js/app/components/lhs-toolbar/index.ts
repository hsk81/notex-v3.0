import { Location } from "../lhs-editor/location";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

import { Commands } from "../../commands/index";
import { CopyText } from "../../commands/copy-text";
import { CutText } from "../../commands/cut-text";
import { DeleteText } from "../../commands/delete-text";
import { MdBold } from "../../commands/md-bold";
import { MdCode } from "../../commands/md-code";
import { MdHeading } from "../../commands/md-heading";
import { MdImage } from "../../commands/md-image";
import { MdIndent } from "../../commands/md-indent";
import { MdItalic } from "../../commands/md-italic";
import { MdLink } from "../../commands/md-link";
import { MdOutdent } from "../../commands/md-outdent";
import { MdVideo } from "../../commands/md-video";
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
        Commands.me.run(new MdImage(ev)).then(() => {
            this.ed.focus();
        });
    }
    private onIndentClick() {
        Commands.me.run(new MdIndent()).then(() => {
            this.ed.focus();
        });
    }
    private onLinkClick(ev: JQueryEventObject) {
        Commands.me.run(new MdLink(ev)).then(() => {
            this.ed.focus();
        });
    }
    private onOutdentClick() {
        Commands.me.run(new MdOutdent()).then(() => {
            this.ed.focus();
        });
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
        Commands.me.run(new MdVideo(ev)).then(() => {
            this.ed.focus();
        });
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
