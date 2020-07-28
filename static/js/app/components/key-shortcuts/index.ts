import { Ui } from "../../ui/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

@trace
export class KeyShortcuts {
    public static get me(): KeyShortcuts {
        if (window.KEY_SHORTCUTS === undefined) {
            window.KEY_SHORTCUTS = new KeyShortcuts();
        }
        return window.KEY_SHORTCUTS;
    }
    public constructor() {
        $(window).bind('keydown', (ev) => {
            if (ev.ctrlKey || ev.metaKey) {
                const key = String.fromCharCode(ev.which);
                switch (key.toUpperCase()) {
                    case 'O':
                        ev.preventDefault();
                        this.open();
                        break;
                    case 'S':
                        ev.preventDefault();
                        this.save();
                        break;
                }
            }
        });
    }
    private open() {
        this.ui.$toolbarOpen.click();
    }
    @buffered
    private save() {
        const a = document.createElement('a')
        a.href = this.ui.$toolbarSave.attr('href') as any;
        a.download = this.ui.$toolbarSave.attr('download') as any;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    private get ui() {
        return Ui.me;
    }
}
export default KeyShortcuts;
