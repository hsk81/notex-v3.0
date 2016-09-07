///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {cookie} from '../cookie/cookie';

import {buffered} from '../decorator/buffered';
import {named} from '../decorator/named';
import {traceable} from '../decorator/trace';
import {trace} from '../decorator/trace';

import DownloadManager from './download-manager';
import MarkdownIt from '../markdown-it/markdown-it';
import SpellChecker from '../spell-checker/spell-checker';

import {ILingua} from '../spell-checker/spell-checker';
import {IOverlay} from '../spell-checker/spell-checker';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditor')
export class MdEditor {
    private static defineMode(mode: string = 'notex-md') {
        CodeMirror.defineMode(mode, function (config) {
            return CodeMirror.multiplexingMode(
                CodeMirror.getMode(config, 'gfm'), {
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
                }
            );
        });
        return mode;
    }

    public static get me(): MdEditor {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditor();
        }
        return this['_me'];
    }

    public constructor() {
        if (this.mobile) {
            this.toInput({
                footer: false, toolbar: false
            });
        } else if (this.simple) {
            this.toInput({
                footer: true, toolbar: true
            });
        } else {
            this.toMirror();
        }
    }

    public toMirror(): any {
        if (!this.mirror) {
            this.setMirror(CodeMirror.fromTextArea(
                document.getElementById('md-inp'), {
                    mode: MdEditor.defineMode(),
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    undoDepth: 4096
                }
            ));
            this.mirror.setOption('extraKeys', {
                'Tab': (cm) => {
                    cm.execCommand('indentMore');
                },
                'Shift-Tab': (cm) => {
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
    }

    public toInput(options: {
        footer: boolean, toolbar: boolean
    }): any {
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
        } else {
            this.$input.css('width', '100% ');
        }

        if (options.footer) {
            this.$footer.show();
            this.$input.css('height', 'calc(100% - 47px)');
        } else {
            this.$footer.hide();
            this.$input.css('height', '100%');
        }

        this.simple = true;
        return this.$input;
    }

    @buffered(600)
    public render() {
        let $md_out = $('#md-out'),
            $md_tmp;

        let md_new = this.getValue();
        if (md_new !== this._mdOld) {
            this._mdOld = md_new;

            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
                this._timeoutId = undefined;
            }

            this._timeoutId = setTimeout(() => {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue([
                        'resetEquationNumbers', MathJax.InputJax.TeX
                    ], [
                        'Typeset', MathJax.Hub, 'md-out', () => {
                            $md_out.css('visibility', 'visible');
                            $md_tmp.remove();

                            if (md_new.length === 0) {
                                let path = '/static/html/md-out.html';
                                $.get(path).done((html) => {
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
            $md_out.html(MarkdownIt.me.render(md_new));

            let $h = $md_out.find(':header');
            DownloadManager.me.title = ($h.length > 0 ?
                    $($h[0]).text() : new Date().toISOString()) + '.md';
            DownloadManager.me.content = md_new;
        }
    }

    public refresh() {
        if (this.mirror) {
            this.mirror.refresh();
        }
    }

    public focus() {
        if (this.mirror) {
            this.mirror.focus();
        } else {
            this.$input.focus();
        }
    }

    @traceable(false)
    public getValue() {
        if (this.mirror) {
            return this.mirror.getValue();
        } else {
            return this.$input.val();
        }
    }

    @traceable(false)
    public setValue(value: string) {
        if (this.mirror) {
            return this.mirror.setValue(value);
        } else {
            this.$input[0].setSelectionRange(0, this.$input.val().length);
            if (!document.execCommand('insertText', false, value)) {
                this.$input.val(value);
            }

            this.$input[0].setSelectionRange(0, 0);
            this.$input.trigger('change');
        }
    }

    public getSelection():string {
        if (this.mirror) {
            return this.mirror.getSelection();
        } else {
            let inp = this.$input[0],
                beg = inp.selectionStart,
                end = inp.selectionEnd;

            return inp.value.substring(beg, end);
        }
    }

    private onEditorChange() {
        this.render();
    }

    public get $input() {
        return $('#md-inp');
    }

    public get $footer() {
        return this.$input.siblings('.lhs-footer');
    }

    public get mirror(): any {
        return window['CODE_MIRROR'];
    }

    private setMirror(value: any) {
        window['CODE_MIRROR'] = value;
    }

    public get mobile(): boolean {
        return $('.lhs').is(':hidden') && !window['debug'];
    }

    public get simple(): boolean {
        return cookie.get<boolean>('simple', false);
    }

    public set simple(value:boolean) {
        cookie.set<boolean>('simple', value);
    }

    private set spellChecker(value: SpellChecker) {
        this._spellChecker = value;
    }

    private get spellCheckOverlay(): IOverlay {
        return this._spellCheckOverlay;
    }

    private set spellCheckOverlay(value: IOverlay) {
        this._spellCheckOverlay = value;
    }

    public spellCheck(
        lingua: ILingua, callback: (error: boolean) => void
    ) {
        if (lingua.code) {
            this.spellChecker = new SpellChecker(lingua, (overlay) => {
                if (this.mirror) {
                    this.mirror.removeOverlay('spell-checker');
                }
                if (overlay) {
                    this.spellCheckOverlay = $.extend(overlay, {
                        name: 'spell-checker'
                    });
                    if (this.mirror) {
                        this.mirror.addOverlay(this.spellCheckOverlay);
                    }
                }
                if (callback) {
                    callback(!overlay);
                }
            });
        } else {
            this.spellChecker = null;
            this.spellCheckOverlay = null;
            if (this.mirror) {
                this.mirror.removeOverlay('spell-checker');
            }
            if (callback) {
                callback(false);
            }
        }
    }

    private getSearchOverlay(query: any) {
        if (typeof query === 'string') {
            if (query === query.toLowerCase()) {
                query = new RegExp(query.replace(
                    /[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'gi');
            } else {
                query = new RegExp(query.replace(
                    /[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&"), 'g');
            }
        } else {
            if (query.flags.indexOf('g') < 0) {
                query = new RegExp(query.source, query.flags + 'g');
            } else {
                query = new RegExp(query.source, query.flags);
            }
        }
        return {
            token: function (stream) {
                query.lastIndex = stream.pos;
                let match = query.exec(stream.string);
                if (match && match.index == stream.pos) {
                    stream.pos += match[0].length || 1;
                    return 'searching';
                } else if (match) {
                    stream.pos = match.index;
                } else {
                    stream.skipToEnd();
                }
            }
        };
    };

    private get searchOverlay(): IOverlay {
        return this._searchOverlay;
    }

    private set searchOverlay(value: IOverlay) {
        this._searchOverlay = value;
    }

    public search(query) {
        if (this.mirror) {
            if (this.searchOverlay) {
                this.mirror.removeOverlay('search')
            }
            if (query.length > 1 || query.source && query.source.length > 1) {
                this.searchOverlay = $.extend(this.getSearchOverlay(query), {
                    name: 'search'
                });
                this.mirror.addOverlay(this.searchOverlay);
            }
        }
    }


    private _spellCheckOverlay: IOverlay;
    private _spellChecker: SpellChecker;
    private _searchOverlay: IOverlay;
    private _timeoutId: number;
    private _mdOld: string;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditor;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
