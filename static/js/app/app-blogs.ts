import { NtxCertificateFactory } from './ethereum/ntx-certificate-factory';
import { PdfCertificateMeta } from './components/pdf-certificate';
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
                    let uris = await ntxc.tokenURIs(address);
                    if (uris && uris.length) {
                        const $blogs = $('table#blogs');
                        const $thead = $blogs.find('thead');
                        const n_cols = $thead.find('th').length;
                        const n_cols_visible = $thead.find('th:visible').length;
                        const $tbody = $blogs.find('tbody');
                        for (const uri of uris.sort((lhs, rhs) => {
                            return parseInt(lhs.id) > parseInt(rhs.id) ? +1 : -1;
                        })) {
                            await timeout(200, fetch(uri.value)).then((res) => {
                                return res.json();
                            }).then((certificate: PdfCertificateMeta) => {
                                if (!certificate.content) {
                                    throw new Error(`CERTIFICATE: ${JSON.stringify(
                                        certificate
                                    )}`);
                                }
                                $tbody.append(row(uri, certificate));
                            }).catch((reason) => {
                                $tbody.append(row(uri, {
                                    authors: [],
                                    content: '',
                                    description: '',
                                    emails: [],
                                    image: '',
                                    keywords: [],
                                    name: ''
                                }));
                                console.error(reason);
                            }).finally(() => {
                                $tbody.find('tr#placeholder').remove();
                            });
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
                                        <p>${certificate.name}</p>
                                    </td>`);
                                    cols.push(`<td>
                                        <p>${certificate.description}</p>
                                    </td>`);
                                    cols.push(`<td class="d-none d-sm-table-cell">
                                        <p>${certificate.authors?.join(', ') ?? ''}</p>
                                    </td>`);
                                    cols.push(`<td class="d-none d-sm-table-cell">
                                        <p>${certificate.emails?.join(', ') ?? ''}</p>
                                    </td>`);
                                    cols.push(`<td class="d-none d-sm-table-cell">
                                        <p>${certificate.keywords?.join(', ') ?? ''}</p>
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
                                    <button title="Burn Certificate" type="button" class="btn btn-outline-danger btn-sm" disabled>
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
                    }
                }
            }
        }
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
export default Blogs.me;
