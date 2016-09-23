var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../cookie/cookie', '../decorator/buffered', '../decorator/named', '../decorator/trace', '../decorator/trace', './download-manager', '../markdown-it/markdown-it', '../spell-checker/spell-checker'], function (require, exports, cookie_1, buffered_1, named_1, trace_1, trace_2, download_manager_1, markdown_it_1, spell_checker_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor.ts]');
    var MdEditor = (function () {
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
        MdEditor.defineMode = function (mode) {
            if (mode === void 0) { mode = 'notex-md'; }
            CodeMirror.defineMode(mode, function (config) {
                return CodeMirror.multiplexingMode(CodeMirror.getMode(config, 'gfm'), {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '{{', close: '}}'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '$$', close: '$$'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '$', close: '$'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-sh'),
                    open: '```bash', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-ceylon'),
                    open: '```ceylon', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-cmake'),
                    open: '```cmake', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-csharp'),
                    open: '```csharp', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/css'),
                    open: '```css', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-cython'),
                    open: '```cython', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-c++src'),
                    open: '```c++', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-csrc'),
                    open: '```c', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-dockerfile'),
                    open: /```(?:docker|dockerfile)/, close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-erlang'),
                    open: '```erlang', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-spreadsheet'),
                    open: '```exel', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-fortran'),
                    open: '```fortran', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'x-shader/x-fragment'),
                    open: '```fragment', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-fsharp'),
                    open: '```fsharp', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-go'),
                    open: '```go', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-haskell'),
                    open: '```haskell', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/html'),
                    open: '```html', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'message/http'),
                    open: '```http', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/javascript'),
                    open: '```javascript', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-java'),
                    open: '```java', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'jinja2'),
                    open: /```jinja2?/, close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-julia'),
                    open: '```julia', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-stex'),
                    open: '```latex', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-less'),
                    open: '```less', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-lua'),
                    open: '```lua', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-markdown'),
                    open: '```markdown', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-mathematica'),
                    open: '```mathematica', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-octave'),
                    open: '```matlab', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'mllike'),
                    open: '```ml', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-nginx-conf'),
                    open: '```nginx', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-objectivec'),
                    open: '```objective-c', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-ocaml'),
                    open: '```ocaml', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-octave'),
                    open: '```octave', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-perl'),
                    open: '```perl', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-php'),
                    open: '```php', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-python'),
                    open: '```python', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-squirrel'),
                    open: '```squirrel', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-rst'),
                    open: '```rst', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-rsrc'),
                    open: '```r', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-sass'),
                    open: '```sass', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-scss'),
                    open: '```scss', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-scala'),
                    open: '```scala', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-sh'),
                    open: '```sh', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-sql'),
                    open: '```sql', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-spreadsheet'),
                    open: '```spreadsheet', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-swift'),
                    open: '```swift', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/typescript'),
                    open: '```typescript', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-vertex'),
                    open: '```vertex', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'application/xml'),
                    open: '```xml', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-yaml'),
                    open: '```yaml', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/x-vb'),
                    open: '```vb', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/vbscript'),
                    open: '```vbscript', close: '```'
                }, {
                    mode: CodeMirror.getMode(config, 'text/plain'),
                    open: '```', close: '```'
                });
            });
            return mode;
        };
        Object.defineProperty(MdEditor, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['MD_EDITOR'] = new MdEditor();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditor.prototype.toMirror = function () {
            if (!this.mirror) {
                this.setMirror(CodeMirror.fromTextArea(document.getElementById('md-inp'), {
                    mode: MdEditor.defineMode(),
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    lineNumbers: true,
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
            if (this.spellCheckOverlay) {
                this.mirror.removeOverlay(this.spellCheckOverlay);
                this.mirror.addOverlay(this.spellCheckOverlay);
            }
            this.simple = false;
            this.$input.hide();
            return this.mirror;
        };
        MdEditor.prototype.toInput = function (options) {
            if (this.mirror) {
                if (this.spellCheckOverlay) {
                    this.mirror.removeOverlay(this.spellCheckOverlay);
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
            var $md_out = $('#md-out'), $md_tmp;
            var md_new = this.getValue();
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
                                    $.get('/static/html/editor-placeholder.html').done(function (html) {
                                        $md_out.html(html);
                                        $md_out.find('>*').hide().fadeIn('fast');
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
                this.$input[0].setSelectionRange(0, this.$input.val().length);
                if (!document.execCommand('insertText', false, value)) {
                    this.$input.val(value);
                }
                this.$input[0].setSelectionRange(0, 0);
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
            this.render();
        };
        Object.defineProperty(MdEditor.prototype, "$input", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditor.prototype, "$footer", {
            get: function () {
                return this.$input.siblings('.lhs-footer');
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
                return $('.lhs').is(':hidden') && !window['debug'];
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
        Object.defineProperty(MdEditor.prototype, "spellCheckOverlay", {
            get: function () {
                return this._spellCheckOverlay;
            },
            set: function (value) {
                this._spellCheckOverlay = value;
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
                        _this.spellCheckOverlay = $.extend(overlay, {
                            name: 'spell-checker'
                        });
                        if (_this.mirror) {
                            _this.mirror.addOverlay(_this.spellCheckOverlay);
                        }
                    }
                    if (callback) {
                        callback(!overlay);
                    }
                });
            }
            else {
                this.spellChecker = null;
                this.spellCheckOverlay = null;
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
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], MdEditor.prototype, "render", null);
        __decorate([
            trace_1.traceable(false), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], MdEditor.prototype, "getValue", null);
        __decorate([
            trace_1.traceable(false), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [String]), 
            __metadata('design:returntype', void 0)
        ], MdEditor.prototype, "setValue", null);
        MdEditor = __decorate([
            trace_2.trace,
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