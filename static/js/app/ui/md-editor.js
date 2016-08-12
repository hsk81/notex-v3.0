var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../decorator/buffered', '../decorator/named', '../decorator/trace', './download-manager', '../markdown-it/markdown-it'], function (require, exports, buffered_1, named_1, trace_1, download_manager_1, markdown_it_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor.ts]');
    var MdEditor = (function () {
        function MdEditor() {
            this.$mdInp
                .on('keypress', this.onKeyPress.bind(this));
            this.$mdInp
                .on('keyup change paste', this.onKeyUp.bind(this));
        }
        Object.defineProperty(MdEditor, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MdEditor();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.onKeyPress = function () {
            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
                this._timeoutId = undefined;
            }
        };
        MdEditor.prototype.onKeyUp = function (ev) {
            this.render();
        };
        MdEditor.prototype.render = function () {
            var $md_inp = this.$mdInp, $md_out = this.$mdOut, $md_tmp;
            var md_new = $md_inp.val();
            if (md_new !== this._mdOld) {
                this._mdOld = md_new;
                if (this._timeoutId !== undefined) {
                    clearTimeout(this._timeoutId);
                    this._timeoutId = undefined;
                }
                this._timeoutId = setTimeout(function () {
                    if (MathJax !== undefined) {
                        MathJax.Hub.Queue([
                            'resetEquationNumbers', MathJax.InputJax.TeX
                        ], [
                            'Typeset', MathJax.Hub, 'md-out', function () {
                                $md_out.css('visibility', 'visible');
                                $md_tmp.remove();
                                if (md_new.length === 0) {
                                    var path = '/static/html/md-out.html';
                                    $.get(path).done(function (html) {
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
                $md_out.html(markdown_it_1.default.me.render(md_new));
                var $h = $md_out.find(':header');
                download_manager_1.default.me.title = ($h.length > 0 ?
                    $($h[0]).text() : new Date().toISOString()) + '.md';
                download_manager_1.default.me.content = md_new;
            }
        };
        Object.defineProperty(MdEditor.prototype, "$mdInp", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "$mdOut", {
            get: function () {
                return $('#md-out');
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            buffered_1.buffered(600), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], MdEditor.prototype, "render", null);
        MdEditor = __decorate([
            trace_1.trace,
            named_1.named('MdEditor'), 
            __metadata('design:paramtypes', [])
        ], MdEditor);
        return MdEditor;
    }());
    exports.MdEditor = MdEditor;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MdEditor;
});
//# sourceMappingURL=md-editor.js.map