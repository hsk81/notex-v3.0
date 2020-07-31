import { Commands } from "../../commands/index";
import { MdBold } from "../../commands/md-bold";
import { MdCode } from "../../commands/md-code";
import { MdHeading } from "../../commands/md-heading";
import { MdItalic } from "../../commands/md-italic";
import { OpenFile } from "../../commands/open-file";
import { SaveFile } from "../../commands/save-file";

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
                    case 'B':
                        ev.preventDefault();
                        this.md_bold();
                        break;
                    case 'H':
                        ev.preventDefault();
                        this.md_heading();
                        break;
                    case 'I':
                        ev.preventDefault();
                        this.md_italic();
                        break;
                    case 'M':
                        ev.preventDefault();
                        this.md_code();
                        break;
                    case 'O':
                        ev.preventDefault();
                        this.open_file();
                        break;
                    case 'S':
                        ev.preventDefault();
                        this.save_file();
                        break;
                }
            }
        });
    }
    @buffered
    private md_bold() {
        Commands.me.run(new MdBold());
    }
    @buffered
    private md_code() {
        Commands.me.run(new MdCode());
    }
    @buffered
    private md_heading() {
        Commands.me.run(new MdHeading());
    }
    @buffered
    private md_italic() {
        Commands.me.run(new MdItalic());
    }
    private open_file() {
        Commands.me.run(new OpenFile());
    }
    @buffered
    private save_file() {
        Commands.me.run(new SaveFile());
    }
}
export default KeyShortcuts;
