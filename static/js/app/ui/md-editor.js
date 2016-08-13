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
            CodeMirror.defineMode('notex-md', function (config) {
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
            this.editor = CodeMirror.fromTextArea(document.getElementById('md-inp'), {
                lineNumbers: true,
                lineWrapping: true,
                mode: 'notex-md',
                undoDepth: 1024
            });
            this.editor
                .on('change', this.onEditorChange.bind(this));
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
        MdEditor.prototype.onEditorChange = function () {
            this.render();
        };
        MdEditor.prototype.render = function () {
            var $md_out = $('#md-out'), $md_tmp;
            var md_new = this.editor.getValue();
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
        Object.defineProperty(MdEditor.prototype, "editor", {
            get: function () {
                return window['CODE_MIRROR'];
            },
            set: function (value) {
                window['CODE_MIRROR'] = value;
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