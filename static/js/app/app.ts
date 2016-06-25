///////////////////////////////////////////////////////////////////////////////
///<reference path="./global/global.d.ts"/>

console.debug('[import:app.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import './function/named';
import './function/partial';
import './function/with';
import './string/random';

///////////////////////////////////////////////////////////////////////////////

import MarkdownEditor from './markdown-editor/markdown-editor';
import PublishDialog from './publish-dialog/publish-dialog';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class App {
    static get me():App {
        return new App();
    }

    constructor() {
        this.markdownEditor = MarkdownEditor.me;
        this.publishDialog = PublishDialog.me;
    }

    private markdownEditor:MarkdownEditor;
    private publishDialog:PublishDialog;
}

///////////////////////////////////////////////////////////////////////////////

interface Window {
    APP:App;
}

declare let window:Window;
window.APP = App.me;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

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
