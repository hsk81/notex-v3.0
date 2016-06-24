///////////////////////////////////////////////////////////////////////////////
///<reference path="./global/global.d.ts"/>

console.debug('[import:app.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import PublishDialog from './publish-dialog/publish-dialog';
import MarkdownIt from './markdown-it/markdown-it';
import buffered from './function/buffered';
import mine from './function/mine';

import './function/named';
import './function/partial';
import './function/with';
import './string/random';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class App {
    static get me():App {
        return new App();
    }

    constructor() {
        this.publish_dialog = PublishDialog.me;
    }

    private publish_dialog: PublishDialog;
}

///////////////////////////////////////////////////////////////////////////////

interface Window {
    APP:App;
}

declare let window:Window;
window.APP = App.me;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let timeout_id, md_old;

///////////////////////////////////////////////////////////////////////////////

$('#md-inp').on('keypress', mine(function (self, ev) {
    if (timeout_id !== undefined) {
        clearTimeout(timeout_id);
        timeout_id = undefined;
    }
}));

$('#md-inp').on('change keyup paste', buffered(mine(function (self, ev) {
    var $md_inp = $(ev.target),
        $md_out = $('#md-out'),
        $md_tmp;

    var md_new = $md_inp.val();
    if (md_new !== md_old) {
        md_old = md_new;

        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }

        timeout_id = setTimeout(function () {
            if (MathJax !== undefined) {
                MathJax.Hub.Queue([
                    "resetEquationNumbers", MathJax.InputJax.TeX
                ], [
                    "Typeset", MathJax.Hub, 'md-out', function () {
                        $md_out.css('visibility', 'visible');
                        $md_tmp.remove();

                        if (md_new.length === 0) {
                            var path = '/static/html/md-out.html';
                            $.get(path).done(function (html) {
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

        var $a = $('a[name=save]'), $h = $md_out.find(':header');
        $a.attr("href", URL.createObjectURL(
            new Blob([md_new], {type: 'text/markdown'})));
        $a.attr("download", ($h.length > 0 ? $($h[0]).text() :
                new Date().toISOString()) + '.md');
    }
}), 600));

$('#md-src,#md-src-mob').on('change', function (ev) {
    var files = ev.target.files;
    for (var i = 0; i < files.length; i++) {
        if (files[i].type && files[i].type.match(/text/)) {
            var reader = new FileReader();
            reader.onload = function (progress_ev) {
                var target = <any>progress_ev.target;
                if (target && target.readyState === 2 &&
                    typeof target.result === 'string') {
                    $('#md-inp')
                        .val(target.result).trigger('change')
                        .setCursorPosition(0).focus();
                }
            };
            reader.readAsText(files[i]);
        }
    }
});

$('[name=swap]').on('click', function () {
    $('div.lhs').toggleClass('hidden-xs hidden-sm')
        .toggleClass('col-xs-12 col-sm-12');
    $('div.rhs').toggleClass('hidden-xs hidden-sm')
        .toggleClass('col-xs-12 col-sm-12');
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
