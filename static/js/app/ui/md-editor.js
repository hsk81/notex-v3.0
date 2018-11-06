///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../cookie/cookie", "../decorator/buffered", "../decorator/named", "../decorator/trace", "../decorator/trace", "./download-manager", "../markdown-it/markdown-it", "../spell-checker/spell-checker", "./md-editor-mode"], function (require, exports, cookie_1, buffered_1, named_1, trace_1, trace_2, download_manager_1, markdown_it_1, spell_checker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.debug('[import:app/ui/md-editor.ts]');
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    var MdEditor = /** @class */ (function () {
        function MdEditor() {
            if (this.mobile) {
                this.toInput({
                    footer: false, toolbar: false
                });
            }
            else if (this.simple) {
                this.toInput({
                    footer: true, toolbar: true
                });
            }
            else {
                this.toMirror();
            }
        }
        MdEditor_1 = MdEditor;
        Object.defineProperty(MdEditor, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['MD_EDITOR'] = new MdEditor_1();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.toMirror = function () {
            if (!this.mirror) {
                this.setMirror(CodeMirror.fromTextArea(document.getElementById('input'), {
                    addModeClass: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: 'notex-md',
                    styleActiveLine: true,
                    undoDepth: 4096
                }));
                this.mirror.setOption('extraKeys', {
                    'Tab': function (cm) {
                        cm.execCommand('indentMore');
                    },
                    'Shift-Tab': function (cm) {
                        cm.execCommand('indentLess');
                    }
                });
                this.mirror
                    .on('change', this.onEditorChange.bind(this));
            }
            if (this.spellCheckerOverlay) {
                this.mirror.removeOverlay(this.spellCheckerOverlay);
                this.mirror.addOverlay(this.spellCheckerOverlay);
            }
            this.simple = false;
            this.$input.hide();
            return this.mirror;
        };
        MdEditor.prototype.toInput = function (options) {
            if (this.mirror) {
                if (this.spellCheckerOverlay) {
                    this.mirror.removeOverlay(this.spellCheckerOverlay);
                }
                this.mirror.toTextArea();
                this.setMirror(undefined);
            }
            this.$input
                .off('keyup change paste')
                .on('keyup change paste', this.onEditorChange.bind(this))
                .show();
            if (options.toolbar) {
                this.$input.css('width', 'calc(100% - 48px)');
            }
            else {
                this.$input.css('width', '100% ');
            }
            if (options.footer) {
                this.$footer.show();
                this.$input.css('height', 'calc(100% - 47px)');
            }
            else {
                this.$footer.hide();
                this.$input.css('height', '100%');
            }
            this.simple = true;
            return this.$input;
        };
        MdEditor.prototype.render = function () {
            var $output = $('#output'), $cached;
            var value = this.getValue();
            if (value !== this._mdOld) {
                this._mdOld = value;
                if (this._timeoutId !== undefined) {
                    clearTimeout(this._timeoutId);
                    this._timeoutId = undefined;
                }
                this._timeoutId = setTimeout(function () {
                    if (typeof MathJax !== 'undefined') {
                        MathJax.Hub.Queue([
                            'resetEquationNumbers', MathJax.InputJax.TeX
                        ], [
                            'Typeset', MathJax.Hub, 'output', function () {
                                $output.css('visibility', 'visible');
                                $cached.remove();
                                if (value.length === 0) {
                                    $.get('/static/html/output-placeholder.html').done(function (html) {
                                        $output.html(html);
                                        $output.find('>*').hide().fadeIn('fast');
                                        MathJax.Hub.Queue([
                                            'Typeset', MathJax.Hub, 'output'
                                        ]);
                                    });
                                }
                            }
                        ]);
                    } else {
                        $output.css('visibility', 'visible');
                        $cached.remove();
                        if (value.length === 0) {
                            $.get('/static/html/output-placeholder.html').done(function (html) {
                                $output.html(html);
                                $output.find('>*').hide().fadeIn('fast');
                            });
                        }
                    }
                }, 0);
                $cached = $('#cached');
                $cached.remove();
                $cached = $output.clone();
                $cached.prop('id', 'cached');
                $cached.insertBefore($output);
                $cached.scrollTop($output.scrollTop());
                $output.css('visibility', 'hidden');
                $output.html(markdown_it_1.default.me.render(value));
                var $h = $output.find(':header');
                download_manager_1.default.me.title = ($h.length > 0 ?
                    $($h[0]).text() : new Date().toISOString()) + '.md';
                download_manager_1.default.me.content = value;
            }
        };
        MdEditor.prototype.refresh = function () {
            if (this.mirror) {
                this.mirror.refresh();
            }
        };
        MdEditor.prototype.focus = function () {
            if (this.mirror) {
                this.mirror.focus();
            }
            else {
                this.$input.focus();
            }
        };
        MdEditor.prototype.getValue = function () {
            if (this.mirror) {
                return this.mirror.getValue();
            }
            else {
                return this.$input.val();
            }
        };
        MdEditor.prototype.setValue = function (value) {
            if (this.mirror) {
                return this.mirror.setValue(value);
            }
            else {
                this.$input[0]
                    .setSelectionRange(0, this.$input.val().length);
                if (!document.execCommand('insertText', false, value)) {
                    this.$input.val(value);
                }
                this.$input[0]
                    .setSelectionRange(0, 0);
                this.$input.trigger('change');
            }
        };
        MdEditor.prototype.getSelection = function () {
            if (this.mirror) {
                return this.mirror.getSelection();
            }
            else {
                var inp = this.$input[0], beg = inp.selectionStart, end = inp.selectionEnd;
                return inp.value.substring(beg, end);
            }
        };
        MdEditor.prototype.onEditorChange = function () {
            if (typeof MathJax === 'undefined') try {
                var script = document.createElement('script'), head = document.getElementsByTagName('head');
                script.type = 'text/javascript';
                script.src = this.mathjaxUrl;
                head[0].appendChild(script);
            } catch (ex) {
                console.error(ex);
            }
            this.render();
        };
        Object.defineProperty(MdEditor.prototype, "mathjaxUrl", {
            get: function () {
                return '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "$input", {
            get: function () {
                return $('#input');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "$footer", {
            get: function () {
                return this.$input.siblings('.footer');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "mirror", {
            get: function () {
                return window['CODE_MIRROR'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.setMirror = function (value) {
            window['CODE_MIRROR'] = value;
        };
        Object.defineProperty(MdEditor.prototype, "mobile", {
            get: function () {
                return $('.lhs').is(':hidden') && !window.debug;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "simple", {
            get: function () {
                return cookie_1.cookie.get('simple', false);
            },
            set: function (value) {
                cookie_1.cookie.set('simple', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "spellChecker", {
            set: function (value) {
                this._spellChecker = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "spellCheckerOverlay", {
            get: function () {
                return this._spellCheckerOverlay;
            },
            set: function (value) {
                this._spellCheckerOverlay = value;
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.spellCheck = function (lingua, callback) {
            var _this = this;
            if (lingua.code) {
                this.spellChecker = new spell_checker_1.default(lingua, function (overlay) {
                    if (_this.mirror) {
                        _this.mirror.removeOverlay('spell-checker');
                    }
                    if (overlay) {
                        _this.spellCheckerOverlay = $.extend(overlay, {
                            name: 'spell-checker'
                        });
                        if (_this.mirror) {
                            _this.mirror.addOverlay(_this.spellCheckerOverlay);
                        }
                    }
                    if (callback) {
                        callback(!overlay);
                    }
                });
            }
            else {
                this.spellChecker = null;
                this.spellCheckerOverlay = null;
                if (this.mirror) {
                    this.mirror.removeOverlay('spell-checker');
                }
                if (callback) {
                    callback(false);
                }
            }
        };
        MdEditor.prototype.getSearchOverlay = function (query) {
            if (typeof query === 'string') {
                if (query === query.toLowerCase()) {
                    query = new RegExp(query.replace(/[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'gi');
                }
                else {
                    query = new RegExp(query.replace(/[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'g');
                }
            }
            else {
                if (query.flags.indexOf('g') < 0) {
                    query = new RegExp(query.source, query.flags + 'g');
                }
                else {
                    query = new RegExp(query.source, query.flags);
                }
            }
            return {
                token: function (stream) {
                    query.lastIndex = stream.pos;
                    var match = query.exec(stream.string);
                    if (match && match.index == stream.pos) {
                        stream.pos += match[0].length || 1;
                        return 'searching';
                    }
                    else if (match) {
                        stream.pos = match.index;
                    }
                    else {
                        stream.skipToEnd();
                    }
                }
            };
        };
        ;
        Object.defineProperty(MdEditor.prototype, "searchOverlay", {
            get: function () {
                return this._searchOverlay;
            },
            set: function (value) {
                this._searchOverlay = value;
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.search = function (query) {
            if (this.mirror) {
                if (this.searchOverlay) {
                    this.mirror.removeOverlay('search');
                }
                if (query.length > 1 || query.source && query.source.length > 1) {
                    this.searchOverlay = $.extend(this.getSearchOverlay(query), {
                        name: 'search'
                    });
                    this.mirror.addOverlay(this.searchOverlay);
                }
            }
        };
        __decorate([
            buffered_1.buffered(600),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], MdEditor.prototype, "render", null);
        __decorate([
            trace_1.traceable(false),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], MdEditor.prototype, "getValue", null);
        __decorate([
            trace_1.traceable(false),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", void 0)
        ], MdEditor.prototype, "setValue", null);
        MdEditor = MdEditor_1 = __decorate([
            trace_2.trace,
            named_1.named('MdEditor'),
            __metadata("design:paramtypes", [])
        ], MdEditor);
        return MdEditor;
        var MdEditor_1;
    }());
    exports.MdEditor = MdEditor;
    ///////////////////////////////////////////////////////////////////////////////
    exports.default = MdEditor;
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//# sourceMappingURL=md-editor.js.map