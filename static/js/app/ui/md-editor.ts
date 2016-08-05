///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {buffered} from '../decorator/buffered';
import {named} from '../decorator/named';
import {trace} from '../decorator/trace';
import {traceable} from '../decorator/trace';

import DownloadManager from './download-manager';
import MarkdownIt from '../markdown-it/markdown-it';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditor')
export class MdEditor {
    public static get me():MdEditor {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditor();
        }
        return this['_me'];
    }

    public constructor() {
        this.$mdInp.on(
            'keypress', this.onKeyPress.bind(this));
        this.$mdInp.on(
            'keyup change paste', this.onKeyUp.bind(this));
    }

    public get $mdInp():any {
        return $('#md-inp');
    }

    public get $mdOut():any {
        return $('#md-out');
    }

    @traceable(false)
    private onKeyPress() {
        if (this._timeoutId !== undefined) {
            clearTimeout(this._timeoutId);
            this._timeoutId = undefined;
        }
    }

    @buffered(600)
    @traceable(false)
    private onKeyUp(ev:Event) {
        let $md_inp = $(ev.target),
            $md_out = this.$mdOut,
            $md_tmp;

        let md_new = $md_inp.val();
        if (md_new !== this._mdOld) {
            this._mdOld = md_new;

            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
                this._timeoutId = undefined;
            }

            this._timeoutId = setTimeout(() => {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue([
                        "resetEquationNumbers", MathJax.InputJax.TeX
                    ], [
                        "Typeset", MathJax.Hub, 'md-out', () => {
                            $md_out.css('visibility', 'visible');
                            $md_tmp.remove();

                            if (md_new.length === 0) {
                                let path = '/static/html/md-out.html';
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

            let $h = $md_out.find(':header');
            DownloadManager.me.title = ($h.length > 0 ?
                    $($h[0]).text() : new Date().toISOString()) + '.md';
            DownloadManager.me.content = md_new;
        }
    }

    private _timeoutId:number;
    private _mdOld:string;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditor;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
