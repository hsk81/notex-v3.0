///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {buffered} from '../decorator/buffered';
import {named} from '../decorator/named';
import {trace} from '../decorator/trace';

import DownloadManager from './download-manager';
import MarkdownIt from '../markdown-it/markdown-it';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditor')
export class MdEditor {
    public static get me(): MdEditor {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditor();
        }
        return this['_me'];
    }

    public constructor() {
        CodeMirror.defineMode('notex-md', function(config) {
            return CodeMirror.multiplexingMode(
                CodeMirror.getMode(config, 'gfm'), {
                    mode: CodeMirror.getMode(config, 'text/x-markdown'),
                    open: '```markdown', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '{{', close: '}}'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '$$', close: '$$'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '$', close: '$'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '```latex', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-python'),
                    open: '```python', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-cython'),
                    open: '```cython', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/plain'),
                    open: '```', close: '```'
                }
            );
        });
        this.editor = CodeMirror.fromTextArea(
            document.getElementById('md-inp'), {
                lineNumbers: true,
                lineWrapping: true,
                mode: 'notex-md',
                undoDepth: 1024
            }
        );
        this.editor
            .on('change', this.onEditorChange.bind(this));
    }

    private onEditorChange() {
        this.render();
    }

    @buffered(600)
    public render() {
        let $md_out = $('#md-out'),
            $md_tmp;

        let md_new = this.editor.getValue();
        if (md_new !== this._mdOld) {
            this._mdOld = md_new;

            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
                this._timeoutId = undefined;
            }

            this._timeoutId = setTimeout(() => {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue([
                        'resetEquationNumbers', MathJax.InputJax.TeX
                    ], [
                        'Typeset', MathJax.Hub, 'md-out', () => {
                            $md_out.css('visibility', 'visible');
                            $md_tmp.remove();

                            if (md_new.length === 0) {
                                let path = '/static/html/md-out.html';
                                $.get(path).done((html) => {
                                    $md_out.html(html);
                                    MathJax.Hub.Queue([
                                        'Typeset', MathJax.Hub, 'md-out'
                                    ]);
                                });
                            }
                        }
                    ]);
                }
            }, 0);

            $md_tmp = $('#md-tmp');
            $md_tmp.remove();
            $md_tmp = $md_out.clone();
            $md_tmp.prop('id', 'md-tmp');
            $md_tmp.insertBefore($md_out);
            $md_tmp.scrollTop($md_out.scrollTop());

            $md_out.css('visibility', 'hidden');
            $md_out.html(MarkdownIt.me.render(md_new));

            let $h = $md_out.find(':header');
            DownloadManager.me.title = ($h.length > 0 ?
                    $($h[0]).text() : new Date().toISOString()) + '.md';
            DownloadManager.me.content = md_new;
        }
    }

    private get editor(): any {
        return window['CODE_MIRROR'];
    }

    private set editor(value: any) {
        window['CODE_MIRROR'] = value;
    }

    private _timeoutId: number;
    private _mdOld: string;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditor;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
