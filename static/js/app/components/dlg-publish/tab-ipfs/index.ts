import { LhsEditor } from "../../lhs-editor/index";
import { Ui } from "../../../ui/index";

import { PdfCertificateMeta } from "../../pdf-certificate/index";
import { PdfCertificate } from "../../pdf-certificate/index";
import { TransactionReceipt } from "../../../ethereum/index";
import { Ethereum } from "../../../ethereum/index";
import { gateway } from "../../../ipfs/index";

import { PublishBlog } from "../../../commands/publish-blog";
import { Commands } from "../../../commands/index";
import { trace } from "../../../decorator/trace";

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
        this.ui.$publishDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
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
        if ($expand.data('state') === 'expanded') {
            $expand.data('state', 'collapsed');
            $expand.prop('title', 'Expand');
        } else {
            $expand.data('state', 'expanded');
            $expand.prop('title', 'Collapse');
        }
        if ($expand.data('state') === 'expanded') {
            const $glyphicon = $expand.find('.glyphicon');
            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
        } else {
            const $glyphicon = $expand.find('.glyphicon');
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
    private async onPrimaryClick() {
        const $nav = this.ui.$publishDialogIpfsNav;
        const active = $nav.find('a').hasClass('active');
        const $expand = this.ui.$publishDialogExpandIpfs;
        const expanded = $expand.data('state') === 'expanded';
        if (!active) {
            return;
        }
        if (!this.ipfs_gateway) {
            const $el = this.ui.$publishDialogIpfsGateway;
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.ipfs_gateway) $el.removeClass('is-invalid');
            });
            return;
        }
        if (expanded && !this.title) {
            const $el = this.ui.$publishDialogIpfsMetaTitle
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.title) $el.removeClass('is-invalid');
            });
            return;
        }
        if (expanded && !this.description) {
            const $el = this.ui.$publishDialogIpfsMetaDescription;
            $el.addClass('is-invalid').focus().off('blur').on('blur', () => {
                if (this.title) $el.removeClass('is-invalid');
            });
            return;
        }
        {
            const command = new PublishBlog({
                altKey: !expanded, meta: expanded ? {
                    name: this.title,
                    description: this.description,
                    authors: this.authors,
                    emails: this.emails,
                    keywords: this.keywords
                } : undefined
            });
            $(command).on(
                'publishing', this.onPublishing.bind(this));
            $(command).on(
                'published', this.onPublished.bind(this));
            $(command).on(
                'certifying', this.onCertifying.bind(this));
            $(command).on(
                'certified', this.onCertified.bind(this));
            $(command).on(
                'rejected', this.onRejected.bind(this)
            );
            Commands.me.run(command);
        }
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
        gateway.set(this.ipfs_gateway);
    }
    private onCertifying() {
        spin(this.ui.$publishDialogPrimary[0], 'Certifying');
    }
    private onCertified(ev: JQuery.Event, data: {
        cert: { meta: PdfCertificateMeta, url: string },
        post_url: string, tx?: TransactionReceipt
    }) {
        this.ui.$publishDialogPrimary.addClass('btn-success');
        this.ui.$publishDialogPrimary.prop('disabled', false);
        if (data.tx) {
            this.ui.$publishDialogPrimary.html('Certified');
        } else {
            this.ui.$publishDialogPrimary.html('Published');
            this.ui.$publishDialog.modal('hide');
        }
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
