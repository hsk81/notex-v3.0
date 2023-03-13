import { Ethereum } from '../../ethereum/index';
import { QRCode } from '../../qr-code/index';

export class PdfCertificate {
    public static print(
        cert: { meta: PdfCertificateMeta, url: string, id?: number }
    ) {
        $.get(this.pdf_html).done(async (html: string) => {
            const head = html.match(/<head>([^]+)<\/head>/im);
            this.$pdf_head.html(head ? head[0] : '');
            const body = html.match(/<body>([^]+)<\/body>/im);
            this.$pdf_body.html(body ? body[0] : '');
            {
                this.setTitle(cert.id);
                this.setId(cert.id);
                this.setName(cert.meta.name);
                this.setDescription(cert.meta.description);
                this.setAuthors(cert.meta.authors);
                this.setEmails(cert.meta.emails);
                this.setKeywords(cert.meta.keywords);
            }
            await Promise.all([
                this.setContentUrl(cert.meta.content as string),
                this.setCertUrl(cert.url),
                this.setTokenUrl(cert.id)
            ]);
            if (this.$pdf && this.$pdf[0] && this.$pdf[0].contentWindow) {
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
    private static setTitle(value?: number) {
        this.$pdf_head.find('title').text(`NTXCertificate #${value||'N/A'}`);
    }
    private static setId(value?: number) {
        this.$pdf_body.find('.id>.value>span').text(value||'N/A');
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
        this.$pdf_body.find('#content-url>.qrcode').html(
            await QRCode(value)
        );
        this.$pdf_body.find('#content-url>.value>span').text(
            value.replace(/^https?:\/\//i, '')
        );
    }
    private static async setCertUrl(value: string) {
        this.$pdf_body.find('#cert-url>.qrcode').html(
            await QRCode(value)
        );
        this.$pdf_body.find('#cert-url>.value>span').text(
            value.replace(/^https?:\/\//i, '')
        );
    }
    private static async setTokenUrl(id?: number) {
        if (id && await this.eth_supported) {
            const token_url = await this.eth.tokenUrl(id);
            if (token_url) {
                this.$pdf_body.find('#tx-hash>.qrcode').html(
                    await QRCode(token_url)
                );
                this.$pdf_body.find('#tx-hash>.value>span').text(
                    token_url.replace(/^https?:\/\//i, '')
                );
            } else {
                this.$pdf_body.find('#tx-hash').remove();
            }
        } else {
            this.$pdf_body.find('#tx-hash').remove();
        }
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
    private static get eth_supported() {
        return this.eth && this.eth.supported;
    }
    private static get eth() {
        return Ethereum.me;
    }
};
export type PdfCertificateMeta = {
    name: string,
    description: string,
    authors: string[],
    emails: string[],
    keywords: string[],
    content?: string,
    image?: string
};
export default PdfCertificate;
