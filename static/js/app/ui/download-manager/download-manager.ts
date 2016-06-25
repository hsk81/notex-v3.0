///////////////////////////////////////////////////////////////////////////////
///<reference path="../../global/global.d.ts"/>

console.debug('[import:ui/download-manager.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import HeaderMenu from '../header-menu/header-menu';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class DownloadManager {
    static get me():DownloadManager {
        if (this['_me'] === undefined) {
            this['_me'] = new DownloadManager();
        }
        return this['_me'];
    }

    set title(title:string) {
        this.$downloadLink.attr("download", title);
    }

    set content(content:string) {
        this.$downloadLink.attr("href", URL.createObjectURL(
            new Blob([content], {type: 'text/markdown'})
        ));
    }

    private get $downloadLink():any {
        return HeaderMenu.me.$saveItem;
    }
}

///////////////////////////////////////////////////////////////////////////////

export default DownloadManager;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////