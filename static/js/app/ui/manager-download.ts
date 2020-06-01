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
        this.$download_link.attr("download", title);
    }
    public set content(content: string) {
        this.$download_link.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
    }
    private get $download_link() {
        return Ui.me.$toolSave;
    }
}
export default DownloadManager;
