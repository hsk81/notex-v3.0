define(["require", "exports", './markdown-editor/markdown-editor', './publish-dialog/publish-dialog', './function/named', './function/partial', './function/with', './string/random'], function (require, exports, markdown_editor_1, publish_dialog_1) {
    "use strict";
    console.debug('[import:app.ts]');
    var App = (function () {
        function App() {
            this.markdownEditor = markdown_editor_1.default.me;
            this.publishDialog = publish_dialog_1.default.me;
        }
        Object.defineProperty(App, "me", {
            get: function () {
                return new App();
            },
            enumerable: true,
            configurable: true
        });
        return App;
    }());
    window.APP = App.me;
    $('#md-src,#md-src-mob').on('change', function (ev) {
        var files = ev.target.files;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type && files[i].type.match(/text/)) {
                var reader = new FileReader();
                reader.onload = function (progress_ev) {
                    var target = progress_ev.target;
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
});
//# sourceMappingURL=app.js.map