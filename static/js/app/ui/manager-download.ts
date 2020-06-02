import { trace } from "../decorator/trace";
import { Ui } from "./ui";

@trace
export class DownloadManager {
    public static get me() {
        if (window.DOWNLOAD_MANAGER === undefined) {
            window.DOWNLOAD_MANAGER = new DownloadManager();
        }
        return window.DOWNLOAD_MANAGER;
    }
    public set title(title: string) {
        this.ui.$headerSave.attr("download", title);
        this.ui.$toolbarSave.attr("download", title);
    }
    public set content(content: string) {
        this.ui.$headerSave.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
        this.ui.$toolbarSave.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
    }
    private get ui() {
        return Ui.me;
    }
}
export default DownloadManager;
