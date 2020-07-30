import { Commands } from "../../commands/index";
import { SaveFile } from "../../commands/save-file";
import { OpenFile } from "../../commands/open-file";

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
        this.commands.run(new OpenFile());
    }
    @buffered
    private save() {
        this.commands.run(new SaveFile());
    }
    private get commands() {
        return Commands.me;
    }
}
export default KeyShortcuts;
