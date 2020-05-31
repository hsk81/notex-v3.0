import { trace } from "../decorator/trace";
import { HeaderMenu } from "./header-menu";

@trace
export class DownloadManager {
    public static get me(): DownloadManager {
        if (window.DOWNLOAD_MANAGER === undefined) {
            window.DOWNLOAD_MANAGER = new DownloadManager();
        }
        return window.DOWNLOAD_MANAGER;
    }
    public set title(title: string) {
        this.$downloadLink.attr("download", title);
    }
    public set content(content: string) {
        this.$downloadLink.attr("href", URL.createObjectURL(
            new Blob([content], { type: 'text/markdown' })
        ));
    }
    private get $downloadLink(): any {
        return HeaderMenu.me.$saveItem;
    }
}
export default DownloadManager;
