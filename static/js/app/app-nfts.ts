import { PdfCertificate, PdfCertificateMeta } from './components/pdf-certificate/index';
import { NtxCertificateFactory } from './ethereum/ntx-certificate-factory';
import { Ethereum } from './ethereum/index';
import { Popover } from './ui/index';

import { chevron_down as svg_chevron_down } from './assets/svg/index';
import { chevron_up as svg_chevron_up } from './assets/svg/index';
import { printer as svg_printer } from './assets/svg/index';
import { trash as svg_trash } from './assets/svg/index';
import { trace } from './decorator/trace';

@trace
export class NFTs {
    public static get me(): NFTs {
        if (window.APP_NFTS === undefined) {
            window.APP_NFTS = new NFTs();
        }
        return window.APP_NFTS;
    }
    public constructor() {
        Promise.resolve()
            .then(this.initialize.bind(this))
            .then(this.events.bind(this));
    }
    private async initialize() {
        await this.check_connection();
        await this.list_certificates();
    }
    private async check_connection() {
        const lhs = () => {
            return `<button type="button"
                class="btn btn-outline-dark lhs"
            >
                <img src="/static/ico/metamask.png">
            </button>`;
        };
        const mid = (text: string) => {
            return `<button type="button"
                class="btn btn-outline-dark mid"
            >
                <span style="font-family: sans-serif;">${text}</span>
            </button>`;
        };
        const rhs = () => {
            return `<button type="button"
                class="btn btn-outline-dark rhs" tabindex="-1" title="Why the fox?"
                data-container="body" data-toggle="popover" data-placement="left" data-trigger="focus"
                data-content="This fox allows you to list your digital NoTex certificates (ERC-721 NFTs). Click to install and connect to an Ethereum or Avalanche compatible wallet!"
            >
                <span class="glyphicon glyphicon-question-sign"></span>
            </button>`;
        };
        if (!this.eth) {
            this.$tbody.prepend($(`<tr class="wallet-mm" id="wallet-install">
                <td scope="row" colspan="100%">
                    <div class="btn-group" role="group">
                        ${lhs()}${mid('Install Wallet')}${rhs()}
                    </div>
                </td>
            </tr>`));
        } else if (!await this.eth.supported) {
            this.$tbody.prepend($(`<tr class="wallet-mm" id="wallet-network-wrong">
                <td scope="row" colspan="100%">
                    <div class="btn-group" role="group">
                        ${lhs()}${mid('Wrong Network')}${rhs()}
                    </div>
                </td>
            </tr>`));
        } else if (!await this.eth.address) {
            this.$tbody.prepend($(`<tr class="wallet-mm" id="wallet-connect">
                <td scope="row" colspan="100%">
                    <div class="btn-group" role="group">
                        ${lhs()}${mid('Connect Wallet')}${rhs()}
                    </div>
                </td>
            </tr>`));
        }
        this.$tbody.find('[data-toggle="popover"]')
            .on('blur', (ev) => {
                const button = $(ev.target).closest('button') as Popover<HTMLButtonElement>;
                button.popover('hide');
            })
            .on('click', (ev) => {
                const button = $(ev.target).closest('button') as Popover<HTMLButtonElement>;
                button.popover('toggle');
            });
    }
    private async list_certificates() {
        if (!this.eth) return;
        const chain_id = await this.eth.chainId;
        if (!chain_id) return;
        const ntxc = NtxCertificateFactory.create(chain_id);
        if (!ntxc) return;
        const address = await this.eth.address;
        if (!address) return;
        let uris = await ntxc.tokenURIs(address);
        if (!uris || !uris.length) return;
        for (const uri of uris.sort((lhs, rhs) => {
            return lhs.id > rhs.id ? +1 : -1;
        })) {
            await timeout(900, fetch(uri.value)).then((res) => {
                return res.json();
            }).then((certificate: PdfCertificateMeta) => {
                if (!certificate.content) {
                    throw new Error(`CERTIFICATE: ${JSON.stringify(
                        certificate
                    )}`);
                }
                const nft_main = get_nft_main(uri, certificate);
                if (nft_main) this.$tbody.append(nft_main);
                const nft_extra = get_nft_extra(uri, certificate);
                if (nft_extra) this.$tbody.append(nft_extra);
            }).catch((reason) => {
                this.$tbody.append(get_nft_main(uri, {
                    authors: [],
                    content: '',
                    description: '',
                    emails: [],
                    image: '',
                    keywords: [],
                    name: ''
                }));
            }).finally(() => {
                this.$tbody.find('tr#placeholder').remove();
            });
        }
        function get_nft_main(
            uri: { id: bigint, value: string }, cert: PdfCertificateMeta
        ) {
            const cols = [
                `<tr class="nft-main">`
            ];
            if (cert.content) {
                cols.push(`<td class="col-1st nft-id">
                    <a href="${cert.content}" target="_blank">#${uri.id}</a>
                </td>`);
                cols.push(`<td class="col-2nd nft-name">
                    <p title="${cert.name}">
                        <a href="${cert.content}" target="_blank">${cert.name}</a>
                    </p>
                </td>`);
                cols.push(`<td class="col-3rd nft-button">
                    <button title="Expand" type="button"
                        class="btn btn-outline-dark btn-sm toggle"
                    >
                        ${svg_chevron_down}${svg_chevron_up}
                    </button>
                </td>`);
            } else {
                cols.push(`<td class="col-1st nft-id">
                    <a class="btn-link disabled" target="_blank">#${uri.id}</a>
                </td>`);
                cols.push(`<td class="col-2nd nft-na">
                    <em>
                        publication not available
                    </em>
                </td>`);
                cols.push(`<td class="col-3rd nft-button">
                    <button
                        title="Burn" type="button" class="btn btn-outline-danger btn-sm burn"
                        data-cert-id="${uri.id}"
                    >
                        ${svg_trash}
                    </button>
                </td>`);
            }
            cols.push(`</tr>`);
            return cols.join('\n');
        }
        function get_nft_extra(
            uri: { id: bigint, value: string }, cert: PdfCertificateMeta
        ) {
            if (cert.content) {
                const rows = [];
                rows.push(`<tr class="nft-extra" style="display: none;">`);
                rows.push(`<td colspan="3" style="margin: 0; padding: 0; border-top: none;">`);
                rows.push(`<table class="table" style="margin: 0; padding: 0;">`)
                rows.push(`<tbody>`);
                {
                    rows.push(`<tr>`);
                    rows.push(`<td class="col-1st nft-label">Description</td>`);
                    rows.push(`<td class="col-2nd nft-label-value">
                        <p title="${cert.description}">
                            ${cert.description}
                        </p>
                    </td>`);
                    rows.push(`<td class="col-3rd nft-button">
                        <a title="QR Code" class="btn btn-outline-dark m-0 p-0"
                           style="background-color: white" role="button"
                           href="${cert.image}" target="_blank"
                        >
                            <img src="${cert.image}" width=32 height=29>
                        </a>
                    </td>`);
                    rows.push(`</tr>`);
                } {
                    rows.push(`<tr>`);
                    rows.push(`<td class="col-1st nft-label">Author(s)</td>`);
                    rows.push(`<td class="col-2nd nft-label-value">
                        <p title="${cert.authors?.join(', ') ?? ''}">
                            ${cert.authors?.join(', ') ?? ''}
                        </p>
                    </td>`);
                    rows.push(`<td class="col-3rd nft-button">
                        <button
                            title="Print" type="button" class="btn btn-outline-dark btn-sm print"
                            data-cert="${JSON.stringify(cert).replace(/"/g, "'")}"
                            data-cert-id="${uri.id}" data-cert-url="${uri.value}"
                        >
                            ${svg_printer}
                        </button>
                    </td>`);
                    rows.push(`</tr>`);
                } {
                    rows.push(`<tr>`);
                    rows.push(`<td class="col-1st nft-label">Email(s)</td>`);
                    rows.push(`<td class="col-2nd nft-label-value">
                        <p title="${cert.emails?.join(', ') ?? ''}">
                            ${cert.emails?.join(', ') ?? ''}
                        </p>
                    </td>`);
                    rows.push(`<td class="col-3rd nft-button">
                        <button
                            title="Burn" type="button" class="btn btn-outline-danger btn-sm burn"
                            data-cert-id="${uri.id}"
                        >
                            ${svg_trash}
                        </button>
                    </td>`);
                    rows.push(`</tr>`);
                } {
                    rows.push(`<tr>`);
                    rows.push(`<td class="col-1st nft-label">Keyword(s)</td>`);
                    rows.push(`<td class="col-2nd nft-label-value">
                        <p title="${cert.keywords?.join(', ') ?? ''}">
                            ${cert.keywords?.join(', ') ?? ''}
                        </p>
                    </td>`);
                    rows.push(`<td class="col-3rd nft-button">&nbsp;</td>`);
                    rows.push(`</tr>`);
                }
                rows.push(`</tbody>`);
                rows.push(`</table>`)
                rows.push(`</td>`);
                rows.push(`</tr>`);
                return rows.join('\n');
            }
        }
    }
    private events() {
        const $install = this.$wallet_install.find('.lhs,.mid');
        $install.on('click', this.on_install_click.bind(this));
        const $connect = this.$wallet_connect.find('.lhs,.mid');
        $connect.on('click', this.on_connect_click.bind(this));
        const $burn = this.$tbody.find('button.burn');
        $burn.on('click', this.on_burn_click.bind(this));
        const $toggle = this.$tbody.find('button.toggle');
        $toggle.on('click', this.on_toggle_click.bind(this));
        const $print = this.$tbody.find('button.print');
        $print.on('click', this.on_print_click.bind(this));
    }
    private on_install_click(ev: JQuery.ClickEvent) {
        const tab = window.open('https://metamask.io/', '_black');
        if (tab && tab.focus) tab.focus();
    }
    private on_connect_click(ev: JQuery.ClickEvent) {
        if (this.eth) this.eth.enable().then((address) => {
            if (address) window.location.reload();
        });
    }
    private async on_burn_click(ev: JQuery.ClickEvent) {
        const $row_1 = $(ev.target).closest('tr.nft-extra');
        const $row_2 = $(ev.target).closest('tr');
        const $burn = $row_2.find('button.burn');
        const cert_id = $burn.data('cert-id');
        if (this.eth && cert_id) try {
            const chain_id = await this.eth.chainId;
            if (!chain_id) throw null;
            const ntxc = NtxCertificateFactory.create(chain_id);
            if (!ntxc) throw null;
            const tx = await ntxc.burn(cert_id);
            if (!tx) throw null;
            $row_1.prev('tr').remove();
            $row_1.remove();
            $row_2.remove();
        } catch (ex) {
            console.error(ex)
        } finally {
            if (this.$rows.length === 0) {
                this.$tbody.append($(`<tr id="placeholder">
                    <td scope="row" colspan="100%" style="text-align: center;">
                        <em>no certified publications yet; <a href="/editor" target="_blank">compose</a>?</em>
                    </td>
                </tr>`));
            }
        }
    }
    private on_print_click(ev: JQuery.ClickEvent) {
        const $row = $(ev.target).closest('tr');
        const $print = $row.find('button.print');
        const cert = $print.data('cert') as string;
        const id = $print.data('cert-id') as string;
        const url = $print.data('cert-url') as string;
        try {
            const meta = JSON.parse(cert.replace(/'/g, '"'));
            PdfCertificate.print({ meta, url, id: parseInt(id) });
        } catch (ex) {
            console.error(ex);
        }
    }
    private on_toggle_click(ev: JQuery.ClickEvent) {
        const $row = $(ev.target).closest('tr');
        const $toggle = $row.find('button.toggle');
        const state = $row.data('state');
        if (state !== 'expanded') {
            $row.next('.nft-extra').show();
            $toggle.find('svg.bi-chevron-down').hide();
            $toggle.find('svg.bi-chevron-up').show();
            $toggle.attr('title', 'Collapse');
            $row.data('state', 'expanded');
        } else {
            $row.next('.nft-extra').hide();
            $toggle.find('svg.bi-chevron-down').show();
            $toggle.find('svg.bi-chevron-up').hide();
            $toggle.attr('title', 'Expand');
            $row.data('state', '');
        }
    }
    private get $table() {
        return $('table#nfts');;
    }
    private get $thead() {
        return this.$table.find('>thead');
    }
    private get $tbody() {
        return this.$table.find('>tbody');
    }
    private get $colums() {
        return this.$thead.find('>tr>th');
    }
    private get $rows() {
        return this.$tbody.find('>tr');
    }
    private get $wallet_install() {
        return this.$tbody.find('>tr#wallet-install');
    }
    private get $wallet_connect() {
        return this.$tbody.find('>tr#wallet-connect');
    }
    private get eth() {
        return Ethereum.me;
    }
}
function timeout<T>(ms: number, promise: Promise<T>) {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('TIMEOUT'))
        }, ms);
        promise.then((value: T) => {
            clearTimeout(timer);
            resolve(value);
        }).catch((reason: any) => {
            clearTimeout(timer);
            reject(reason);
        });
    });
}
export default NFTs.me;
