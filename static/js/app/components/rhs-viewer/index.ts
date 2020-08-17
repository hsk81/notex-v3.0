import { MarkdownIt } from "../../markdown-it/markdown-it";
import { TemplateDialog } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

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
    public get title() {
        const $header = this.ui.$rhsOutputBody.find(':header').first();
        return $header ? $header.text().slice(0,-2) : undefined;
    }
    public constructor() {
        $(this).on('rendered', this.onRendered.bind(this));
    }
    @buffered(40)
    public async render(force: 'hard'|'soft'|'none' = 'none') {
        const content = this.ed.getValue();
        {
            if (content.length === 0) {
                force = 'hard';
            }
            if (force !== 'none') {
                await this.refresh(force);
            }
        }
        {
            const head = TemplateDialog.me.getHead();
            this.ui.$rhsCachedHead.html(head);
            const body = TemplateDialog.me.getBody(content);
            this.ui.$rhsCachedBody.html(MarkdownIt.me.render(body, {
                document: this.ui.$rhsCached.contents()[0] as Document
            }));
        }
        {
            $(this).trigger('rendered', {
                content, title: this.title,
                type: 'text/markdown; charset=UTF-8'
            });
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
    private async refresh(force: 'hard'|'soft') {
        switch (force) {
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
    @buffered(600)
    private onRendered(ev: JQuery.Event, { content }: {
        content: string
    }) {
        if (content.length === 0) {
            $.get(this.placeholder).done((html) => {
                this.ui.$rhsCachedBody.hide().html(html);
                this.ui.$rhsCachedBody.fadeIn('slow');
                this.ui.$rhsOutputBody.hide().html(html);
                this.ui.$rhsOutputBody.fadeIn('slow');
            });
        }
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
