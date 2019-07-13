import { trace } from "../decorator/trace";
import { MdEditor } from "./md-editor";
declare const $: JQueryStatic;

@trace
export class MdEditorAibar {
    public static get me(this: any): MdEditorAibar {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_OVERLAY'] = new MdEditorAibar();
        }
        return this['_me'];
    }

    public constructor() {
        this.events();
    }

    private events() {
        this.onModeChange(asMode(this.ed.simple));
        $(this.ed).on('simple', (ev, { value }) => {
            this.onModeChange(asMode(value));
        });
        $(this.ed).on('change', (ev) => {
            this.onEditorChange(this.ed.empty);
        });
        this.$midButton.on(
            'click', this.onMidButtonClick.bind(this)
        );
    }

    private onModeChange(mode: string) {
        if (mode === 'simple') {
            this.$aibar.removeClass('mirror')
        } else {
            this.$aibar.addClass('mirror')
        }
        if (this.ed.empty) {
            this.$aibar.fadeIn('slow');
        }
    }

    private onEditorChange(empty: boolean) {
        if (empty) {
            this.$aibar.fadeIn('fast');
        } else {
            this.$aibar.hide();
        }
    }

    private async onMidButtonClick() {
        try {
            const text
                = await fetch('/static/md/help.md')
                .then((res) => res.text());
            this.ed.setValue(text);
        } catch (ex) {
            console.error(ex);
        }
    }

    private get $aibar() {
        return $('.aibar');
    }

    private get $lhsButton() {
        return this.$aibar.find('button.lhs');
    }

    private get $midButton() {
        return this.$aibar.find('button.mid');
    }

    private get $rhsButton() {
        return this.$aibar.find('button.rhs');
    }

    private get ed() {
        return MdEditor.me;
    }
}
function asMode(simple: boolean) {
    return simple ? 'simple' : 'mirror';
}
export default MdEditorAibar;
