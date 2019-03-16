import { trace } from "../decorator/trace";
import { HeaderMenu } from "./header-menu";

@trace
export class DownloadManager {
    public static get me(this: any): DownloadManager {
        if (this['_me'] === undefined) {
            this['_me'] = window['DOWNLOAD_MANAGER'] = new DownloadManager();
        }
        return this['_me'];
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
