import { Template } from "../dlg-template/index";

import { Commands } from "../../commands/index";
import { LargerFontSize } from "../../commands/larger-font-size";
import { MdBold } from "../../commands/md-bold";
import { MdCode } from "../../commands/md-code";
import { MdHeading } from "../../commands/md-heading";
import { MdItalic } from "../../commands/md-italic";
import { NewSession } from "../../commands/new-session";
import { OpenFile } from "../../commands/open-file";
import { PrintFile } from "../../commands/print-file";
import { PublishBlog } from "../../commands/publish-blog";
import { RefreshView } from "../../commands/refresh-view";
import { SaveFile } from "../../commands/save-file";
import { SelectTemplate } from "../../commands/select-template";
import { SmallerFontSize } from "../../commands/smaller-font-size";
import { ToggleScrolling } from "../../commands/toggle-scrolling";

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
                switch (ev.which) {
                    case 97: // '1'
                        ev.preventDefault();
                        this.column_single();
                        return;
                    case 98: // '2'
                        ev.preventDefault();
                        this.column_double();
                        return;
                    case 99: // '3'
                        ev.preventDefault();
                        this.column_triple();
                        return;
                    case 107: // '+'
                        if (ev.shiftKey) {
                            ev.preventDefault();
                            this.font_size_larger();
                        }
                        return;
                    case 109: // '-'
                        if (ev.shiftKey) {
                            ev.preventDefault();
                            this.font_size_smaller();
                        }
                        return;
                }
            }
            if (ev.ctrlKey || ev.metaKey) {
                const key = String.fromCharCode(ev.which);
                switch (key.toUpperCase()) {
                    case '1':
                        ev.preventDefault();
                        this.column_single();
                        return;
                    case '2':
                        ev.preventDefault();
                        this.column_double();
                        return;
                    case '3':
                        ev.preventDefault();
                        this.column_triple();
                        return;
                    case 'B':
                        ev.preventDefault();
                        this.md_bold();
                        return;
                    case 'G':
                        ev.preventDefault();
                        this.publish_blog(ev);
                        return;
                    case 'H':
                        ev.preventDefault();
                        this.md_heading();
                        return;
                    case 'I':
                        ev.preventDefault();
                        this.md_italic();
                        return;
                    case 'L':
                        ev.preventDefault();
                        this.toggle_scrolling();
                        return;
                    case 'M':
                        ev.preventDefault();
                        this.md_code();
                        return;
                    case 'N':
                        ev.preventDefault();
                        this.new_session();
                        return;
                    case 'O':
                        ev.preventDefault();
                        this.open_file();
                        return;
                    case 'P':
                        ev.preventDefault();
                        this.print_file();
                        return;
                    case 'R':
                        ev.preventDefault();
                        this.refresh_view(ev);
                        return;
                    case 'S':
                        ev.preventDefault();
                        this.save_file();
                        return;
                }
            }
        });
    }
    @buffered
    private column_single() {
        Commands.me.run(new SelectTemplate(Template.SingleColumn));
    }
    @buffered
    private column_double() {
        Commands.me.run(new SelectTemplate(Template.DoubleColumn));
    }
    @buffered
    private column_triple() {
        Commands.me.run(new SelectTemplate(Template.TripleColumn));
    }
    @buffered
    private font_size_larger() {
        Commands.me.run(new LargerFontSize());
    }
    @buffered
    private font_size_smaller() {
        Commands.me.run(new SmallerFontSize);
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
    @buffered
    private new_session() {
        Commands.me.run(new NewSession());
    }
    private open_file() {
        Commands.me.run(new OpenFile());
    }
    @buffered
    private print_file() {
        Commands.me.run(new PrintFile());
    }
    @buffered
    private publish_blog({ altKey }: { altKey: boolean }) {
        Commands.me.run(new PublishBlog({ altKey }));
    }
    @buffered
    private refresh_view({ altKey }: { altKey: boolean }) {
        Commands.me.run(new RefreshView({ altKey }));
    }
    @buffered
    private save_file() {
        Commands.me.run(new SaveFile());
    }
    @buffered
    private toggle_scrolling() {
        Commands.me.run(new ToggleScrolling());
    }
}
export default KeyShortcuts;
