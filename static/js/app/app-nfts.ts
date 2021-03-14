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
        const n_cols = this.$colums.length;
        const n_cols_visible = this.$thead.find('th:visible').length;
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
                this.$tbody.append(row(uri, certificate));
            }).catch((reason) => {
                this.$tbody.append(row(uri, {
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
        function row(
            uri: { id: string, value: string }, certificate: PdfCertificateMeta
        ) {
            const cols = [`<tr id="${uri.id}">`];
            if (certificate.content) {
                cols.push(`<th scope="row">
                    <a href="${certificate.content}" target="_blank">${uri.id}</a>
                </th>`);
                cols.push(`<th class="d-none d-sm-table-cell">${certificate.image
                    ? `<img src="${certificate.image}" style="border-radius: 0.25em;" alt="QR Code">`
                    : ''
                    }</th>`);
                cols.push(`<td>
                    <p title="${certificate.name}">
                        ${certificate.name}
                    </p>
                </td>`);
                cols.push(`<td>
                    <p title="${certificate.description}">
                        ${certificate.description}
                    </p>
                </td>`);
                cols.push(`<td class="d-none d-sm-table-cell">
                    <p title="${certificate.authors?.join(', ') ?? ''}">
                        ${certificate.authors?.join(', ') ?? ''}
                    </p>
                </td>`);
                cols.push(`<td class="d-none d-sm-table-cell">
                    <p title="${certificate.emails?.join(', ') ?? ''}">
                        ${certificate.emails?.join(', ') ?? ''}
                    </p>
                </td>`);
                cols.push(`<td class="d-none d-sm-table-cell">
                    <p title="${certificate.keywords?.join(', ') ?? ''}">
                        ${certificate.keywords?.join(', ') ?? ''}
                    </p>
                </td>`);

            } else {
                cols.push(`<th scope="row">
                    <a class="btn-link disabled" target="_blank">${uri.id}</a>
                </th>`);
                cols.push(`<td colspan="${6 - (n_cols - n_cols_visible)}">
                    <em style="display: block; text-align: center;">publication metadata not available</em>
                </td>`);
            }
            cols.push(`<td>
                <button title="Burn Certificate" type="button" class="btn btn-outline-danger btn-sm burn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </td>`);
            cols.push(`</tr>`);
            return cols.join('\n');
        }
    }
    private events() {
        const $install = this.$wallet_install.find('.lhs,.mid');
        $install.on('click', this.on_install_click.bind(this));
        const $connect = this.$wallet_connect.find('.lhs,.mid');
        $connect.on('click', this.on_connect_click.bind(this));
        const $buttons = this.$tbody.find('button.burn');
        $buttons.on('click', this.on_burn_click.bind(this));
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
