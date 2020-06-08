import { MarkdownIt } from "../../markdown-it/markdown-it";
import { DownloadManager } from "../../ui/manager-download";
import { TemplateDialog } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/ui";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";
declare const morphdom: any;

@trace
export class RhsViewer {
    public static get me(): RhsViewer {
        if (window.RHS_VIEWER === undefined) {
            window.RHS_VIEWER = new RhsViewer();
        }
        return window.RHS_VIEWER;
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
                    this.ui.$rhsOutput = $('<iframe>', {
                        id: 'output', class: 'viewer', frameborder: '0'
                    });
                case 'soft':
                    this.ui.$rhsCached = $('<iframe>', {
                        id: 'cached', class: 'viewer', frameborder: '0',
                        style: 'visibility:hidden'
                    });
                    const window = this.ui.$rhsCached.get(0).contentWindow;
                    if (window) window.PATCH = () => this.patch();
                default:
                    const { userAgent: agent } = navigator;
                    const ms = !agent || !agent.match(/chrome/i) ? 100 : 0;
                    await new Promise((resolve) => setTimeout(resolve, ms));
            }
        }
        {
            if (md_value.length === 0) {
                $.get(this.placeholder).done((html) => setTimeout(() => {
                    if (this.ed.getValue().length > 0) return;
                    this.ui.$rhsCachedBody.hide().html(html);
                    this.ui.$rhsCachedBody.fadeIn('slow');
                    this.ui.$rhsOutputBody.hide().html(html);
                    this.ui.$rhsOutputBody.fadeIn('slow');
                }, 600));
            }
        }
        {
            this.ui.$rhsCachedHead.html(TemplateDialog.me.head());
            this.ui.$rhsCachedBody.html(MarkdownIt.me.render(
                TemplateDialog.me.body(md_value), {
                    document: this.ui.$rhsCached.contents()[0] as Document
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
        morphdom(this.ui.$rhsOutputHead[0], this.ui.$rhsCachedHead[0], {
            onBeforeElUpdated: (
                source: HTMLElement, target: HTMLElement
            ) => {
                return !source.isEqualNode(target);
            },
            childrenOnly: true
        });
        morphdom(this.ui.$rhsOutputBody[0], this.ui.$rhsCachedBody[0], {
            onBeforeElUpdated: (
                source: HTMLElement, target: HTMLElement
            ) => {
                return !source.isEqualNode(target);
            },
            childrenOnly: true
        });
    }
    public get title() {
        const $header = this.ui.$rhsCachedBody.find(':header').first();
        return $header ? $header.text().slice(0,-2) : undefined;
    }
    private get placeholder() {
        return '/components/rhs-viewer/placeholder.html';
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default RhsViewer;