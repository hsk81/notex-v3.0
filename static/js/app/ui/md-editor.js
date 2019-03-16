var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../cookie/cookie", "../decorator/buffered", "../decorator/named", "../decorator/trace", "../decorator/trace", "./download-manager", "../markdown-it/markdown-it", "../spell-checker/spell-checker", "@npm/snabbdom", "@npm/snabbdom/modules/attributes", "@npm/snabbdom/modules/class", "@npm/snabbdom/modules/eventlisteners", "@npm/snabbdom/modules/props", "@npm/snabbdom/modules/style", "@npm/snabbdom/tovnode", "./md-editor-mode"], function (require, exports, cookie_1, buffered_1, named_1, trace_1, trace_2, download_manager_1, markdown_it_1, spell_checker_1, snabbdom, snabbdom_attrs, snabbdom_class, snabbdom_event, snabbdom_props, snabbdom_style, tovnode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MdEditor = /** @class */ (function () {
        function MdEditor() {
            this.patch = snabbdom.init([
                snabbdom_attrs.default,
                snabbdom_class.default,
                snabbdom_props.default,
                snabbdom_style.default,
                snabbdom_event.default
            ]);
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
            var _this = this;
            var $output = $('#output'), $cached = $('#cached');
            if (!this._mdOld || this._mdOld.length === 0) {
                $output.empty();
            }
            var value = this.getValue();
            if (value.length === 0) {
                $.get('/static/html/output-placeholder.html').done(function (html) {
                    $output.html(html);
                    $output.find('>*').hide().fadeIn('fast');
                    _this.vnode = undefined;
                });
            }
            if (value.length > 0 && value !== this._mdOld) {
                var vrender = function (vnodes) {
                    if (vnodes === void 0) { vnodes = []; }
                    $cached.children().each(function () {
                        vnodes.push(tovnode_1.toVNode(this));
                    });
                    _this.vnode = _this.patch(_this.vnode ? _this.vnode
                        : $output[0], snabbdom.h('div#output', vnodes));
                };
                $cached.html(markdown_it_1.default.me.render(value));
                if (typeof MathJax !== 'undefined') {
                    var math_jax = MathJax;
                    math_jax.Hub.Queue([
                        'resetEquationNumbers', math_jax.InputJax.TeX
                    ], [
                        'Typeset', math_jax.Hub, 'cached', vrender
                    ]);
                }
                else {
                    vrender();
                }
            }
            if (value.length > 0 && value !== this._mdOld) {
                var $header = $cached.find(':header');
                download_manager_1.default.me.title = $header.length === 0
                    ? new Date().toISOString() + ".md"
                    : $($header[0]).text() + ".md";
                download_manager_1.default.me.content = value;
            }
            this._mdOld = value;
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
            if (typeof MathJax === 'undefined')
                try {
                    var script = document.createElement('script'), head = document.getElementsByTagName('head');
                    script.type = 'text/javascript';
                    script.src = this.mathjaxUrl;
                    script.async = true;
                    head[0].appendChild(script);
                }
                catch (ex) {
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
                this.spellChecker = undefined;
                this.spellCheckerOverlay = undefined;
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
        Object.defineProperty(MdEditor.prototype, "patch", {
            get: function () {
                return window['VDOM_PATCH'];
            },
            set: function (value) {
                window['VDOM_PATCH'] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "vnode", {
            get: function () {
                return window['VDOM_NODE'];
            },
            set: function (value) {
                window['VDOM_NODE'] = value;
            },
            enumerable: true,
            configurable: true
        });
        var MdEditor_1;
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
    }());
    exports.MdEditor = MdEditor;
    exports.default = MdEditor;
});
//# sourceMappingURL=md-editor.js.map