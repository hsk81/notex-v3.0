import { NtxCertificate } from '../../ethereum/ntx-certificate';
import { TransactionReceipt } from '@npm/web3-core';
import { QRCode } from '../../qr-code/index';

export class PdfCertificate {
    public static print(data: {
        cert: { meta: PdfCertificateMeta, url: string },
        post_url: string, tx: TransactionReceipt
    }) {
        $.get(this.pdf_html).done(async (html: string) => {
            const head = html.match(/<head>([^]+)<\/head>/im);
            this.$pdf_head.html(head ? head[0] : '');
            const body = html.match(/<body>([^]+)<\/body>/im);
            this.$pdf_body.html(body ? body[0] : '');
            this.setTitle(data.tx.events?.Transfer.returnValues.tokenId);
            this.setId(data.tx.events?.Transfer.returnValues.tokenId);
            this.setName(data.cert.meta.name);
            this.setDescription(data.cert.meta.description);
            this.setAuthors(data.cert.meta.authors);
            this.setEmails(data.cert.meta.emails);
            this.setKeywords(data.cert.meta.keywords);
            await Promise.all([
                this.setContentUrl(data.cert.meta.content),
                this.setCertUrl(data.cert.url),
                this.setTxUrl(data.tx)
            ]);
            if (this.$pdf[0].contentWindow) {
                const original = window.document.title;
                window.document.title = this.getTitle();
                this.$pdf[0].contentWindow.print();
                window.document.title = original;
            }
            this.$pdf_head.html('');
            this.$pdf_body.html('');
        });
    }
    private static get pdf_html() {
        return '/components/pdf-certificate/index.html';
    }
    private static getTitle() {
        return this.$pdf_head.find('title').text();
    }
    private static setTitle(value: string) {
        this.$pdf_head.find('title').text(`NTXCertificate #${value}`);
    }
    private static setId(value: string) {
        this.$pdf_body.find('.id>.value>span').text(value);
    }
    private static setName(value: string) {
        this.$pdf_body.find('.name>.value>span').text(value);
    }
    private static setDescription(value: string) {
        this.$pdf_body.find('.description>.value>span').text(value);
    }
    private static setAuthors(value: string[]) {
        this.$pdf_body.find('.authors>.value>span').text(value.join(', '));
    }
    private static setEmails(value: string[]) {
        this.$pdf_body.find('.emails>.value>span').text(value.join(', '));
    }
    private static setKeywords(value: string[]) {
        this.$pdf_body.find('.keywords>.value>span').text(value.join(', '));
    }
    private static async setContentUrl(value: string) {
        this.$pdf_body.find('#content-url>.qrcode').html(await QRCode(value));
        this.$pdf_body.find('#content-url>.value>span').text(value);
    }
    private static async setCertUrl(value: string) {
        this.$pdf_body.find('#cert-url>.qrcode').html(await QRCode(value));
        this.$pdf_body.find('#cert-url>.value>span').text(value);
    }
    private static async setTxUrl(tx: TransactionReceipt) {
        const explorer = NtxCertificate.explorer(tx.to);
        const tx_url = `${explorer}/tx/${tx.transactionHash}`;
        this.$pdf_body.find('#tx-hash>.qrcode').html(await QRCode(tx_url));
        this.$pdf_body.find('#tx-hash>.value>span').text(tx.transactionHash);
    }
    private static get $pdf_head() {
        return this.$pdf.contents().find('head');
    }
    private static get $pdf_body() {
        return this.$pdf.contents().find('body');
    }
    private static get $pdf() {
        return $('#nft-certificate') as JQuery<HTMLFrameElement>;
    }
};
export type PdfCertificateMeta = {
    name: string,
    description: string,
    authors: string[],
    emails: string[],
    keywords: string[],
    content: string,
    image: string
};
export default PdfCertificate;
