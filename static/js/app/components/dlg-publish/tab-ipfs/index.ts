import { TemplateDialog } from "../../dlg-template/index";
import { LhsEditor } from "../../lhs-editor/index";
import { QRCode } from '../../../qr-code/index';
import { Ui } from "../../../ui/index";

import { PdfCertificateMeta } from "../../pdf-certificate/index";
import { PdfCertificate } from "../../pdf-certificate/index";
import { TransactionReceipt } from "../../../ethereum/index";
import { Ethereum } from "../../../ethereum/index";
import { gateway, html } from "../../../ipfs/index";
import { IPFS, Buffer } from "../../../ipfs/index";

import { trace } from "../../../decorator/trace";
declare const require: Function;

@trace
export class IpfsTab {
    public static get me() {
        if (window.PUBLISH_DIALOG_IPFS_TAB === undefined) {
            window.PUBLISH_DIALOG_IPFS_TAB = new IpfsTab();
        }
        return window.PUBLISH_DIALOG_IPFS_TAB;
    }
    public constructor() {
        if (this.eth) $(this.eth).on(
            'connected', this.onEthConnected.bind(this));
        if (this.eth) $(this.eth).on(
            'disconnected', this.onEthDisconnected.bind(this));;
        this.ui.$publishDialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.ui.$publishDialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.ui.$publishDialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.ui.$publishDialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.ui.$publishDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
        $(this).on(
            'publishing', this.onPublishing.bind(this));
        $(this).on(
            'published', this.onPublished.bind(this));
        $(this).on(
            'certifying', this.onCertifying.bind(this));
        $(this).on(
            'certified', this.onCertified.bind(this));
        $(this).on(
            'rejected', this.onRejected.bind(this));
        this.ui.$publishDialogExpandIpfs.on(
            'click', this.onExpandClick.bind(this));
        $(this).on(
            'show', this.onShow.bind(this));
        $(this).on(
            'hide', this.onHide.bind(this));
    }
    private onShow() {
        this.ui.$publishDialogExpandIpfs.show();
        this.ui.$publishDialogMetamask.parent().addClass('mr-auto');
        this.ui.$publishDialogMetamask.parent().show();
        this.ui.$publishDialogIpfsNav.find('a').addClass('active');
        this.ui.$publishDialogIpfsTab.show();
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.html('Publish');
    }
    private onHide(
        ev: JQuery.Event, flags?: { expansion: boolean, tab: boolean }
    ) {
        if (!flags || flags.tab) {
            this.ui.$publishDialogMetamask.parent().hide();
            this.ui.$publishDialogMetamask.parent().removeClass('mr-auto');
        }
        if (!flags || flags.tab) {
            this.ui.$publishDialogIpfsNav.find('a').removeClass('active');
            this.ui.$publishDialogIpfsTab.hide();
            this.ui.$publishDialogExpandIpfs.hide();
        }
        if (!flags || flags.expansion) {
            const $expand = this.ui.$publishDialogExpandIpfs;
            $expand.data('state', 'collapsed');
            $expand.prop('title', 'Expand');
            const $glyphicon = $expand.find('.glyphicon');
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
        }
    }
    private onExpandClick() {
        const $expand = this.ui.$publishDialogExpandIpfs;
        const $glyphicon = $expand.find('.glyphicon');
        if ($expand.data('state') === 'expanded') {
            $expand.data('state', 'collapsed');
            $expand.prop('title', 'Expand');
        } else {
            $expand.data('state', 'expanded');
            $expand.prop('title', 'Collapse');
        }
        if ($expand.data('state') === 'expanded') {
            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
        } else {
            $glyphicon.removeClass('glyphicon-chevron-up');
            $glyphicon.addClass('glyphicon-chevron-down');
        }
        if ($expand.data('state') === 'expanded') {
            this.ui.$publishDialogIpfsTab.find('[for=nft-group]').show();
            this.ui.$publishDialogIpfsTab.find('#nft-group').show();
        } else {
            this.ui.$publishDialogIpfsTab.find('[for=nft-group]').hide();
            this.ui.$publishDialogIpfsTab.find('#nft-group').hide();
        }
    }
    private onEthConnected() {
        const $expand = this.ui.$publishDialogExpandIpfs;
        $expand.data('state', 'expanded');
        $expand.prop('title', 'Collapse');
        $expand.prop('disabled', true);
        const $glyphicon = $expand.find('.glyphicon');
        $glyphicon.removeClass('glyphicon-chevron-down');
        $glyphicon.addClass('glyphicon-chevron-up');
        const $tab = this.ui.$publishDialogIpfsTab;
        $tab.find('[for=nft-group]').show();
        $tab.find('#nft-group').show();
    }
    private onEthDisconnected() {
        const $expand = this.ui.$publishDialogExpandIpfs;
        $expand.data('state', 'collapsed');
        $expand.prop('title', 'Expand');
        $expand.prop('disabled', false);
        const $glyphicon = $expand.find('.glyphicon');
        $glyphicon.removeClass('glyphicon-chevron-up');
        $glyphicon.addClass('glyphicon-chevron-down');
        const $tab = this.ui.$publishDialogIpfsTab;
        $tab.find('[for=nft-group]').hide();
        $tab.find('#nft-group').hide();
    }
    private onBsModalShow() {
        this.ui.$publishDialogIpfsTab.find('[for=nft-group]').hide();
        this.ui.$publishDialogIpfsTab.find('#nft-group').hide();
        this.ipfs_gateway = gateway.get() ? gateway.get() as string : '';
        this.ui.$publishDialog.find('input').removeClass('is-invalid');
        this.ui.$publishDialogIpfsMetaTitle.val(this.ed.title as string);
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.html('Publish');
    }
    private async onBsModalShown() {
        if (!gateway.get()) {
            this.ui.$publishDialogIpfsGateway.focus();
        } else {
            this.ui.$publishDialogPrimary.focus();
        }
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
    }
    private async onPrimaryClick() {
        const $nav = this.ui.$publishDialogIpfsNav;
        if (!$nav.find('a').hasClass('active')) {
            return;
        }
        if (!this.ipfs_gateway) {
            const $el = this.ui.$publishDialogIpfsGateway;
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.ipfs_gateway) $el.removeClass('is-invalid');
            });
            return;
        }
        if (this.eth && this.eth.enabled && !this.title) {
            const $el = this.ui.$publishDialogIpfsMetaTitle
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.title) $el.removeClass('is-invalid');
            });
            return;
        }
        if (this.eth && this.eth.enabled && !this.description) {
            const $el = this.ui.$publishDialogIpfsMetaDescription;
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.title) $el.removeClass('is-invalid');
            });
            return;
        }
        {
            $(this).trigger('publishing');
        }
        {
            const head = TemplateDialog.me.getHead({ title: this.ed.title });
            const body = this.ui.$viewer.contents().find('body').html();
            this.publish(this.ipfs_gateway, await html(head, body));
        }
    }
    private publish(ipfs_gateway: string, content: string) {
        const buffer = Buffer.from(content);
        IPFS.me(async (ipfs: any) => {
            for await (const item of ipfs.add(buffer)) {
                if (this.certifiable) {
                    this.certify(ipfs_gateway, `${item.cid}`).then(({
                        tx, cert
                    }) => {
                        $(this).trigger('certified', {
                            tx, cert, post_url
                        });
                    }).catch((ex) => {
                        $(this).trigger('rejected');
                        console.error('[nft]', ex);
                    });
                } else {
                    $(this).trigger('published');
                }
                const post_url = `${ipfs_gateway}/${item.cid}`;
                const tab = window.open(post_url, '_same');
                if (tab && tab.focus) tab.focus();
                gateway.set(ipfs_gateway);
            }
        });
    }
    private get certifiable() {
        return this.eth && this.eth.enabled && this.eth.supported;
    }
    private async certify(ipfs_gateway: string, cid: string) {
        $(this).trigger('certifying');
        const content_url = `${ipfs_gateway}/${cid}`;
        const cert_meta: PdfCertificateMeta = {
            name: this.title,
            description: this.description,
            authors: this.authors,
            emails: this.emails,
            keywords: this.keywords,
            content: content_url,
            image: await this.image_url(ipfs_gateway, content_url)
        };
        const buffer = Buffer.from(JSON.stringify(cert_meta, null, 2));
        return IPFS.me().then(async (ipfs: any) => {
            for await (const item of ipfs.add(buffer)) {
                const cert_url = `${ipfs_gateway}/${item.cid}`;
                const tx = await this.eth.nft(cert_url);
                if (tx) return {
                    cert: { meta: cert_meta, url: cert_url }, tx
                };
            }
            throw null;
        });
    }
    private onPublishing() {
        this.ui.$publishDialogPrimary.removeClass('btn-success');
        this.ui.$publishDialogPrimary.removeClass('btn-warning');
        this.ui.$publishDialogPrimary.removeClass('btn-danger');
        this.ui.$publishDialogPrimary.prop('disabled', true);
        spin(this.ui.$publishDialogPrimary[0], 'Publishing');
    }
    private onPublished() {
        this.ui.$publishDialogPrimary.addClass('btn-success');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.html('Published');
        this.ui.$publishDialog.modal('hide');
    }
    private onCertifying() {
        spin(this.ui.$publishDialogPrimary[0], 'Certifying');
    }
    private onCertified(ev: JQuery.Event, data: {
        cert: { meta: PdfCertificateMeta, url: string },
        post_url: string, tx: TransactionReceipt
    }) {
        this.ui.$publishDialogPrimary.addClass('btn-success');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.html('Certified');
        PdfCertificate.print(data);
    }
    private onRejected() {
        this.ui.$publishDialogPrimary.addClass('btn-danger');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.html('Publish');
    }
    private get ipfs_gateway() {
        return this.ui.$publishDialogIpfsGateway.val() as string;
    }
    private set ipfs_gateway(value: string) {
        this.ui.$publishDialogIpfsGateway.val(value);
    }
    private get title() {
        return this.ui.$publishDialogIpfsMetaTitle.val() as string;
    }
    private get description() {
        return this.ui.$publishDialogIpfsMetaDescription.val() as string;
    }
    private get authors() {
        const list = this.ui.$publishDialogIpfsMetaAuthors.val();
        if (typeof list === 'string') {
            return list.split(',').map(w => w.trim()).filter(w => w);
        }
        return [];
    }
    private get emails() {
        const list = this.ui.$publishDialogIpfsMetaEmails.val();
        if (typeof list === 'string') {
            return list.split(',').map(w => w.trim()).filter(w => w);
        }
        return [];
    }
    private image_url(ipfs_gateway: string, ipfs_url: string) {
        return new Promise<string>((resolve) => {
            QRCode(ipfs_url).then((svg) => {
                const buffer = Buffer.from(svg);
                IPFS.me().then(async (ipfs: any) => {
                    for await (const item of ipfs.add(buffer)) {
                        resolve(`${ipfs_gateway}/${item.cid}`);
                    }
                });
            });
        });
    }
    private get keywords() {
        const list = this.ui.$publishDialogIpfsMetaKeywords.val();
        if (typeof list === 'string') {
            return list.split(',').map(w => w.trim()).filter(w => w);
        }
        return [];
    }
    private get eth() {
        return Ethereum.me;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
function spin(
    el: HTMLElement, text: string
) {
    $(el).html(
        `<span class="spinner-border spinner-border-sm" role="status">
        </span>&nbsp;${text}...`
    );
}
export default IpfsTab;
