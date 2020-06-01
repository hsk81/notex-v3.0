import { MarkdownIt } from "../markdown-it/markdown-it";
import { DownloadManager } from "./manager-download";
import { TemplateManager } from "./manager-template";
import { MdEditor } from "./md-editor";
import { Ui } from "./ui";

import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";
declare const morphdom: any;

@trace
export class MdRender {
    public static get me(): MdRender {
        if (window.MD_RENDERER === undefined) {
            window.MD_RENDERER = new MdRender();
        }
        return window.MD_RENDERER;
    }
    @buffered(40)
    public async do(force: 'hard'|'soft'|'none' = 'none') {
        const md_value = this.ed.getValue();
        {
            if (md_value.length === 0) {
                force = 'hard';
            }
            if (force !== 'none') switch (force) {
                case 'hard':
                    this.ui.$output = $('<iframe>', {
                        id: 'output', class: 'viewer', frameborder: '0'
                    });
                case 'soft':
                    this.ui.$cached = $('<iframe>', {
                        id: 'cached', class: 'viewer', frameborder: '0',
                        style: 'visibility:hidden'
                    });
                    const window = this.ui.$cached.get(0).contentWindow;
                    if (window) window.PATCH = () => this.patch();
                default:
                    const ms = !navigator.userAgent.match(/chrome/i) ? 100 : 0;
                    await new Promise((resolve) => setTimeout(resolve, ms));
            }
        }
        {
            if (md_value.length === 0) {
                $.get(this.placeholder).done((html) => setTimeout(() => {
                    if (this.ed.getValue().length > 0) return;
                    this.ui.$cachedBody.hide().html(html);
                    this.ui.$cachedBody.fadeIn('slow');
                    this.ui.$outputBody.hide().html(html);
                    this.ui.$outputBody.fadeIn('slow');
                }, 600));
            }
        }
        {
            this.ui.$cachedHead.html(TemplateManager.me.head());
            this.ui.$cachedBody.html(MarkdownIt.me.render(
                TemplateManager.me.body(md_value), {
                    document: this.ui.$cached.contents()[0] as Document
                }
            ));
        }
        {
            if (md_value.length > 0) {
                const title = `${this.title || new Date().toISOString()}.md`;
                DownloadManager.me.title = title;
                DownloadManager.me.content = md_value;
            }
        }
    }
    @buffered(0)
    public patch() {
        morphdom(this.ui.$outputHead[0], this.ui.$cachedHead[0], {
            onBeforeElUpdated: (
                source: HTMLElement, target: HTMLElement
            ) => {
                return !source.isEqualNode(target);
            },
            childrenOnly: true
        });
        morphdom(this.ui.$outputBody[0], this.ui.$cachedBody[0], {
            onBeforeElUpdated: (
                source: HTMLElement, target: HTMLElement
            ) => {
                return !source.isEqualNode(target);
            },
            childrenOnly: true
        });
    }
    public get title() {
        const $header = this.ui.$cachedBody.find(':header').first();
        return $header ? $header.text().slice(0,-2) : undefined;
    }
    private get placeholder() {
        return '/editor/0200-center/0221-rhs.output-placeholder.html';
    }
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default MdRender;
