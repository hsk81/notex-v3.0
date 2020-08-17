import { RhsViewer } from "../rhs-viewer/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

export type SessionEntry = {
    content: string; type: string;
};
export type Session = {
    [path: string]: SessionEntry
};

@trace
export class SessionController {
    public static get me(): SessionController {
        if (window.SESSION_CONTROLLER === undefined) {
            window.SESSION_CONTROLLER = new SessionController();
        }
        return window.SESSION_CONTROLLER;
    }
    public constructor() {
        $(this.viewer).on('rendered', this.onRendered.bind(this));
    }
    @buffered(600)
    private onRendered(ev: JQuery.Event, { content, type }: {
        content: string, type: string
    }) {
        this.session = { [this.path]: { content, type } };
    }
    public item(name: string) {
        return localStorage[this.key(name)] as string | undefined;
    }
    private set session(session: Session) {
        if (session[this.path]) {
            const content = session[this.path].content;
            const content_key = this.key('content');
            localStorage[content_key] = content;
            const type = session[this.path].type;
            const type_key = this.key('type');
            localStorage[type_key] = type;
        }
    }
    private get session_id() {
        const match = location.hash.match(/session=([0-9a-z]{16})/i)
        const value = match && match[1] || String.random();
        if (!match || !match[1]) {
            location.hash = `session=${value}`;
        }
        return value;
    }
    private key(name: string) {
        return `${this.session_id}:${this.path}:${name}`;
    }
    private get path() {
        return 'default:main.md';
    }
    private get viewer() {
        return RhsViewer.me;
    }
}
export default SessionController;
