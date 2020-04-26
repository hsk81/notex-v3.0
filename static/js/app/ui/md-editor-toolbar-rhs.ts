import { trace } from "../decorator/trace";
import { MdEditor } from "./md-editor";

declare const $: JQueryStatic;

@trace
export class MdEditorToolbarRhs {
    public static get me(this: any): MdEditorToolbarRhs {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_TOOLBAR_RHS'] = new MdEditorToolbarRhs();
        }
        return this['_me'];
    }
    public constructor() {
        this.$print
            .on('click', this.onPrintClick.bind(this));
        this.$publish
            .on('click', this.onPublishClick.bind(this));
        this.$refresh
            .on('click', this.onRefreshClick.bind(this));
        if (!this.editor.mobile) {
            this.$outer.fadeIn('slow', () => {
                this.$toolbar.find('[data-toggle="tooltip"]').tooltip();
                this.$toolbar.find('[data-toggle="popover"]').popover();
                this.refresh();
            });
        }
    }
    public refresh() {
        this.editor.refresh();
        this.scroll.refresh();
    }
    private onRefreshClick() {
        this.editor.render(true);
    }
    private onPublishClick() {
        $('#publish-dlg').modal();
    }
    private onPrintClick() {
        if (this.editor.$viewer[0].contentWindow) {
            this.editor.$viewer[0].contentWindow.print();
        }
    }
    private get $outer() {
        return $('.rhs>.toolbar-outer');
    }
    private get $inner() {
        return this.$outer.find('>.toolbar-inner');
    }
    private get $toolbar() {
        return this.$inner.find('>.md-toolbar');
    }
    private get $print() {
        return $('.glyphicon.print').closest('button');
    }
    private get $publish() {
        return $('.glyphicon.publish').closest('button');
    }
    private get $refresh() {
        return $('.glyphicon.refresh').closest('button');
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.$inner[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private get editor() {
        return MdEditor.me;
    }
    private _scroll: any;
}
export default MdEditorToolbarRhs;
