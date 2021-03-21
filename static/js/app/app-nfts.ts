import { NtxCertificateFactory } from './ethereum/ntx-certificate-factory';
import { PdfCertificateMeta } from './components/pdf-certificate';
import { Ethereum } from './ethereum/index';
import { Popover } from './ui/index';

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
            return `<button type="button" class="btn btn-outline-dark lhs">
                <img src="/static/ico/metamask.png">
            </button>`;
        };
        const mid = (text: string) => {
            return `<button type="button" class="btn btn-outline-dark mid">
                <span>${text}</span>
            </button>`;
        };
        const rhs = () => {
            return `<button type="button" class="btn btn-outline-dark rhs" tabindex="-1" title="Why the fox?"
                data-container="body" data-toggle="popover" data-placement="right" data-trigger="focus"
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
        const ntxc = await NtxCertificateFactory.create(chain_id);
        if (!ntxc) return;
        const address = await this.eth.address;
        if (!address) return;
        let uris = await ntxc.tokenURIs(address);
        if (!uris || !uris.length) return;
        for (const uri of uris.sort((lhs, rhs) => {
            return parseInt(lhs.id) > parseInt(rhs.id) ? +1 : -1;
        })) {
            await timeout(3000, fetch(uri.value)).then((res) => {
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
            uri: { id: string, value: string }, certificate: PdfCertificateMeta
        ) {
            const cols = [`<tr class="nft-main" id="${uri.id}">`];
            if (certificate.content) {
                cols.push(`<td scope="row">
                    <a href="${certificate.content}" target="_blank">#${uri.id}</a>
                </td>`);
                cols.push(`<td class="d-none d-sm-table-cell">${certificate.image
                    ? `<img src="${certificate.image}" style="border-radius: 0.25em;" alt="QR Code">`
                    : ''
                }</td>`);
                cols.push(`<td>
                    <p title="${certificate.name}" style="max-width:15em;">
                        <a href="${certificate.content}" target="_blank">${certificate.name}</a>
                    </p>
                </td>`);
                cols.push(`<td>
                    <p title="${certificate.description}" class="d-none d-sm-table-cell" style="max-width:20em;">
                        ${certificate.description}
                    </p>
                </td>`);
            } else {
                cols.push(`<th scope="row">
                    <a class="btn-link disabled" target="_blank">${uri.id}</a>
                </th>`);
                cols.push(`<td colspan="3">
                    <em style="display: block; text-align: center;">publication metadata not available</em>
                </td>`);
            }
            cols.push(`<td style="max-width:100px;">`);
            cols.push(`<button title="Burn" type="button" class="btn btn-outline-danger btn-sm burn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>`);
            if (certificate.content) {
                cols.push(`<button title="Expand" type="button" class="btn btn-outline-dark btn-sm toggle d-none d-sm-table-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" style="display: none;">
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                    </svg>
                </button>`);
            }
            cols.push(`</td>`);
            cols.push(`</tr>`);
            return cols.join('\n');
        }
        function get_nft_extra(
            uri: { id: string, value: string }, certificate: PdfCertificateMeta
        ) {
            if (certificate.content) {
                const rows = [];
                rows.push(`<tr class="nft-extra nft-authors" style="display: none;">`);
                rows.push(`<td colspan="2">
                    <p style="font-weight: bold; text-align: right;">Author(s):</p>
                </td>`);
                rows.push(`<td colspan="3">
                    <p title="${certificate.authors?.join(', ') ?? ''}" style="max-width: 38em;">
                        ${certificate.authors?.join(', ') ?? ''}
                    </p>
                </td>`);
                rows.push(`</tr>`);
                rows.push(`<tr class="nft-extra nft-emails" style="display: none;">`);
                rows.push(`<td colspan="2">
                    <p style="font-weight: bold; text-align: right;">Email(s):</p>
                </td>`);
                rows.push(`<td colspan="3">
                    <p title="${certificate.emails?.join(', ') ?? ''}" style="max-width: 38em;">
                        ${certificate.emails?.join(', ') ?? ''}
                    </p>
                </td>`);
                rows.push(`</tr>`);
                rows.push(`<tr class="nft-extra nft-keywords" style="display: none;">`);
                rows.push(`<td colspan="2">
                    <p style="font-weight: bold; text-align: right;">Keyword(s):</p>
                </td>`);
                rows.push(`<td colspan="3">
                    <p title="${certificate.keywords?.join(', ') ?? ''}" style="max-width: 38em;">
                        ${certificate.keywords?.join(', ') ?? ''}
                    </p>
                </td>`);
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
        const burn = this.$tbody.find('button.burn');
        burn.on('click', this.on_burn_click.bind(this));
        const toggle = this.$tbody.find('button.toggle');
        toggle.on('click', this.on_toggle_click.bind(this));
    }
    private async on_toggle_click(ev: JQuery.ClickEvent) {
        const $row = $(ev.target).closest('tr');
        const $toggle = $row.find('button.toggle');
        const state = $row.data('state');
        if (state !== 'expanded') {
            $row.nextAll('.nft-extra').slice(0, 3).show();
            $toggle.find('svg.bi-chevron-down').hide();
            $toggle.find('svg.bi-chevron-up').show();
            $toggle.attr('title', 'Collapse');
            $row.data('state', 'expanded');
        } else {
            $row.nextAll('.nft-extra').slice(0, 3).hide();
            $toggle.find('svg.bi-chevron-down').show();
            $toggle.find('svg.bi-chevron-up').hide();
            $toggle.attr('title', 'Expand');
            $row.data('state', '');
        }
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
        const $row = $(ev.target).closest('tr');
        const cert_id = $row.attr('id');
        if (this.eth && cert_id) try {
            const author = await this.eth.address;
            if (!author) throw null;
            const chain_id = await this.eth.chainId;
            if (!chain_id) throw null;
            const ntxc = await NtxCertificateFactory.create(chain_id);
            if (!ntxc) throw null;
            const tx = await ntxc.burn(author, cert_id);
            if (!tx) throw null;
            $row.remove();
        } catch (ex) {
            console.error(ex)
        } finally {
            if (this.$rows.length === 0) {
                this.$tbody.append($(`<tr id="placeholder">
                    <td scope="row" colspan="100%" style="text-align: center;">
                        <em>no certified publications yet</em>
                    </td>
                </tr>`));
            }
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
