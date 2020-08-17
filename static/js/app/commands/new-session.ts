import { trace } from "../decorator/trace";
import { Command } from "./index";

@trace
export class NewSession implements Command {
    public redo() {
        const hash = `session=${String.random()}`;
        if (location.hash && location.hash.match(/session=[0-9a-z]{16}/i)) {
            const url = `${location.origin}/editor#${hash}`;
            const tab = window.open(url, '_blank');
            if (tab && tab.focus) tab.focus();
        } else {
            location.hash = hash;
        }
        return Promise.resolve(this);
    }
}
export default NewSession;
