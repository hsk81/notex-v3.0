import { RhsViewer } from "../rhs-viewer/index";
import { Ui } from "../../ui/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

@trace
export class DownloadController {
    public static get me(): DownloadController {
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
        this.title = title ? title : this.viewer.title;
        this.md_content = md_content;
    }
    private set title(value: string | undefined) {
        if (!value) {
            value = new Date().toISOString();
        }
        this.ui.$toolbarSave.attr("download", `${value}.md`);
        this.ui.$headerSave.attr("download", `${value}.md`);
    }
    private set md_content(value: string) {
        this.ui.$headerSave.attr("href", URL.createObjectURL(
            new Blob([value], { type: 'text/markdown' })
        ));
        this.ui.$toolbarSave.attr("href", URL.createObjectURL(
            new Blob([value], { type: 'text/markdown' })
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
