///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:ui/markdown-editor.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import DownloadManager from './download-manager';
import MarkdownIt from '../markdown-it/markdown-it';
import buffered from '../function/buffered';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class MarkdownEditor {
    static get me():MarkdownEditor {
        if (this['_me'] === undefined) {
            this['_me'] = new MarkdownEditor();
        }
        return this['_me'];
    }

    constructor() {
        this.$mdInp.on('keypress', () => {
            if (this.timeoutId !== undefined) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
        });

        this.$mdInp.on('change keyup paste', buffered((ev) => {
            var $md_inp = $(ev.target),
                $md_out = this.$mdOut,
                $md_tmp;

            var md_new = $md_inp.val();
            if (md_new !== this.mdOld) {
                this.mdOld = md_new;

                if (this.timeoutId !== undefined) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = undefined;
                }

                this.timeoutId = setTimeout(() => {
                    if (MathJax !== undefined) {
                        MathJax.Hub.Queue([
                            "resetEquationNumbers", MathJax.InputJax.TeX
                        ], [
                            "Typeset", MathJax.Hub, 'md-out', () => {
                                $md_out.css('visibility', 'visible');
                                $md_tmp.remove();

                                if (md_new.length === 0) {
                                    var path = '/static/html/md-out.html';
                                    $.get(path).done((html) => {
                                        $md_out.html(html);
                                        MathJax.Hub.Queue([
                                            "Typeset", MathJax.Hub, 'md-out'
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

                var $h = $md_out.find(':header');
                DownloadManager.me.title = ($h.length > 0 ?
                        $($h[0]).text() : new Date().toISOString()) + '.md';
                DownloadManager.me.content = md_new;
            }
        }, 600));
    }

    get $mdInp():any {
        return $('#md-inp');
    }

    get $mdOut():any {
        return $('#md-out');
    }

    private timeoutId:number;
    private mdOld:string;
}

///////////////////////////////////////////////////////////////////////////////

export default MarkdownEditor;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
