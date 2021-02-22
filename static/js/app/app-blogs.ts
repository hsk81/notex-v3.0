import { NtxCertificateFactory } from './ethereum/ntx-certificate-factory';
import { Ethereum } from './ethereum/index';
import { trace } from './decorator/trace';

@trace
export class Blogs {
    public static get me(): Blogs {
        if (window.APP_BLOGS === undefined) {
            window.APP_BLOGS = new Blogs();
        }
        return window.APP_BLOGS;
    }
    public constructor() {
        Promise.resolve().then(this.initialized);
    }
    private async initialized() {
        const chain_id = await Ethereum.me.chainId;
        if (chain_id) {
            const ntxc = await NtxCertificateFactory.create(chain_id);
            if (ntxc) {
                const address = await Ethereum.me.address;
                if (address) {
                    let urls = await ntxc.tokenURIs(address);
                    if (urls && urls.length) {
                        const $blogs = $('#blogs');
                        const $list = $blogs.find('.list-group');
                        $list.empty();
                        for (const url of urls.filter(u => u)) {
                            const $row = $('<div>', { 'class': 'row' });
                            $row.appendTo($list);
                            const $col = $('<div>', { 'class': 'col' });
                            $col.appendTo($row);
                            const $a = $('<a>', { 'class': 'list-group-item' });
                            $a.attr('href', url as string);
                            $a.attr('target', '_blank');
                            $a.text(url as string);
                            $a.appendTo($col);
                        }
                    }
                }
            }
        }
    }
}
export default Blogs.me;
