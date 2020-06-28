import { TemplateDialog } from "../../dlg-template/index";
import { LhsEditor } from "../../lhs-editor/index";
import { Ui } from "../../../ui/index";

import { Ethereum } from "../../../ethereum/index";
import { gateway, html } from "../../../ipfs/index";
import { IPFS, Buffer } from "../../../ipfs/index";

import { trace } from "../../../decorator/trace";
import { Transaction } from '@npm/web3-core';
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
    }
    private onEthConnected() {
        this.ui.$publishDialogIpfsTab.find('[for=nft-group]').show();
        this.ui.$publishDialogIpfsTab.find('#nft-group').show();
    }
    private onEthDisconnected() {
        this.ui.$publishDialogIpfsTab.find('[for=nft-group]').hide();
        this.ui.$publishDialogIpfsTab.find('#nft-group').hide();
    }
    private onBsModalShow() {
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
            const head = TemplateDialog.me.head({ title: this.ed.title });
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
                        tx, cert_url
                    }) => {
                        $(this).trigger('certified', {
                            tx, cert_url, post_url
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
        const post_url = `${ipfs_gateway}/${cid}`;
        const image_url = await this.image_url(post_url);
        const buffer = Buffer.from(JSON.stringify({
            name: this.title,
            description: this.description,
            authors: this.authors,
            emails: this.emails,
            image: image_url,
            keywords: this.keywords,
            datetime_iso: this.datetime_iso,
            ipfs: post_url
        }));
        return IPFS.me().then(async (ipfs: any) => {
            for await (const item of ipfs.add(buffer)) {
                const cert_url = `${ipfs_gateway}/${item.cid}`;
                const tx = await this.eth.nft(cert_url);
                if (tx) return { tx, cert_url };
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
        tx: Transaction, cert_url: string, post_url: string
    }) {
        this.ui.$publishDialogPrimary.addClass('btn-success');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        this.ui.$publishDialogPrimary.html('Certified');
        console.debug('[on:certified]', ev, data);
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
        return this.ui.$publishDialogIpfsMetaTitle.val();
    }
    private get description() {
        return this.ui.$publishDialogIpfsMetaDescription.val();
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
    private image_url(ipfs_url: string) {
        return new Promise<string>((resolve) => {
            require(['@npm/qrcode'], (QRCode: any) => {
                resolve(QRCode.toDataURL(ipfs_url));
            });
        })
    }
    private get keywords() {
        const list = this.ui.$publishDialogIpfsMetaKeywords.val();
        if (typeof list === 'string') {
            return list.split(',').map(w => w.trim()).filter(w => w);
        }
        return [];
    }
    /**
     * @todo: get timestamp from ntp.org?
     */
    private get datetime_iso() {
        return new Date().toISOString();
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
