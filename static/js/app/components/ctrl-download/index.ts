import { RhsViewer } from "../rhs-viewer/index";
import { Ui } from "../../ui/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

@trace
export class DownloadController {
    public static get me() {
        if (window.DOWNLOAD_CONTROLLER === undefined) {
            window.DOWNLOAD_CONTROLLER = new DownloadController();
        }
        return window.DOWNLOAD_CONTROLLER;
    }
    public constructor() {
        $(this.viewer).on('rendered', this.onRendered.bind(this));
    }
    @buffered(600)
    private onRendered(ev: JQuery.Event, { md_content, title }: {
        md_content: string, title?: string
    }) {
        this.md_content = md_content;
        this.title = title;
    }
    private set title(title: string|undefined) {
        if (!title) {
            title = new Date().toISOString();
        }
        this.ui.$toolbarSave.attr("download", `${title}.md`);
        this.ui.$headerSave.attr("download", `${title}.md`);
    }
    private set md_content(content: string) {
        this.ui.$headerSave.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
        this.ui.$toolbarSave.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
    }
    private get viewer() {
        return RhsViewer.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default DownloadController;
