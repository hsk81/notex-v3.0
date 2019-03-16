var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../cookie/cookie", "../decorator/buffered", "../decorator/trace", "../decorator/trace", "./download-manager", "../markdown-it/markdown-it", "../spell-checker/spell-checker", "@npm/snabbdom", "@npm/snabbdom/modules/attributes", "@npm/snabbdom/modules/class", "@npm/snabbdom/modules/eventlisteners", "@npm/snabbdom/modules/props", "@npm/snabbdom/modules/style", "@npm/snabbdom/tovnode", "./md-editor-mode"], function (require, exports, cookie_1, buffered_1, trace_1, trace_2, download_manager_1, markdown_it_1, spell_checker_1, snabbdom, snabbdom_attrs, snabbdom_class, snabbdom_event, snabbdom_props, snabbdom_style, tovnode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MdEditor_1;
    "use strict";
    window['VDOM'] = snabbdom;
    window['VDOM_TO_VNODE'] = tovnode_1.toVNode;
    let MdEditor = MdEditor_1 = class MdEditor {
        constructor() {
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
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = window['MD_EDITOR'] = new MdEditor_1();
            }
            return this['_me'];
        }
        toMirror() {
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
            if (this.spellCheckerOverlay) {
                this.mirror.removeOverlay(this.spellCheckerOverlay);
                this.mirror.addOverlay(this.spellCheckerOverlay);
            }
            this.simple = false;
            this.$input.hide();
            return this.mirror;
        }
        toInput(options) {
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
        }
        render() {
            let $output = $('#output'), $cached = $('#cached');
            if (!this._mdOld || this._mdOld.length === 0) {
                $output.empty();
            }
            let value = this.getValue();
            if (value.length === 0) {
                $.get('/static/html/output-placeholder.html').done((html) => {
                    $output.html(html);
                    $output.find('>*').hide().fadeIn('fast');
                    this.vnode = undefined;
                });
            }
            if (value.length > 0 && value !== this._mdOld) {
                const render = () => {
                    const new_vnode = snabbdom.h('div#output', tovnode_1.toVNode($cached[0]).children);
                    const old_vnode = (this.vnode ? this.vnode : $output[0]);
                    this.vnode = this.patch(old_vnode, new_vnode);
                };
                $cached.html(markdown_it_1.MarkdownIt.me.render(value));
                if (typeof MathJax !== 'undefined')
                    try {
                        const math_jax = MathJax;
                        math_jax.Hub.Queue([
                            'resetEquationNumbers', math_jax.InputJax.TeX
                        ], [
                            'Typeset', math_jax.Hub, 'cached', render
                        ]);
                    }
                    catch (ex) {
                        console.error(ex);
                        render();
                    }
                else {
                    render();
                }
            }
            if (value.length > 0 && value !== this._mdOld) {
                const $header = $cached.find(':header');
                download_manager_1.DownloadManager.me.title = $header.length === 0
                    ? `${new Date().toISOString()}.md`
                    : `${$($header[0]).text()}.md`;
                download_manager_1.DownloadManager.me.content = value;
            }
            this._mdOld = value;
        }
        refresh() {
            if (this.mirror) {
                this.mirror.refresh();
            }
        }
        focus() {
            if (this.mirror) {
                this.mirror.focus();
            }
            else {
                this.$input.focus();
            }
        }
        getValue() {
            if (this.mirror) {
                return this.mirror.getValue();
            }
            else {
                return this.$input.val();
            }
        }
        setValue(value) {
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
        }
        getSelection() {
            if (this.mirror) {
                return this.mirror.getSelection();
            }
            else {
                let inp = this.$input[0], beg = inp.selectionStart, end = inp.selectionEnd;
                return inp.value.substring(beg, end);
            }
        }
        onEditorChange() {
            if (typeof MathJax === 'undefined')
                try {
                    let script = document.createElement('script'), head = document.getElementsByTagName('head');
                    script.type = 'text/javascript';
                    script.src = this.mathjaxUrl;
                    script.async = true;
                    head[0].appendChild(script);
                }
                catch (ex) {
                    console.error(ex);
                }
            this.render();
        }
        get mathjaxUrl() {
            return '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML';
        }
        get $input() {
            return $('#input');
        }
        get $footer() {
            return this.$input.siblings('.footer');
        }
        get mirror() {
            return window['CODE_MIRROR'];
        }
        setMirror(value) {
            window['CODE_MIRROR'] = value;
        }
        get mobile() {
            return $('.lhs').is(':hidden') && !window.debug;
        }
        get simple() {
            return cookie_1.cookie.get('simple', false);
        }
        set simple(value) {
            cookie_1.cookie.set('simple', value);
        }
        set spellChecker(value) {
            this._spellChecker = value;
        }
        get spellCheckerOverlay() {
            return this._spellCheckerOverlay;
        }
        set spellCheckerOverlay(value) {
            this._spellCheckerOverlay = value;
        }
        spellCheck(lingua, callback) {
            if (lingua.code) {
                this.spellChecker = new spell_checker_1.SpellChecker(lingua, (overlay) => {
                    if (this.mirror) {
                        this.mirror.removeOverlay('spell-checker');
                    }
                    if (overlay) {
                        this.spellCheckerOverlay = $.extend(overlay, {
                            name: 'spell-checker'
                        });
                        if (this.mirror) {
                            this.mirror.addOverlay(this.spellCheckerOverlay);
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
        }
        getSearchOverlay(query) {
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
                    let match = query.exec(stream.string);
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
        }
        ;
        get searchOverlay() {
            return this._searchOverlay;
        }
        set searchOverlay(value) {
            this._searchOverlay = value;
        }
        search(query) {
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
        }
        get patch() {
            return window['VDOM_PATCH'];
        }
        set patch(value) {
            window['VDOM_PATCH'] = value;
        }
        get vnode() {
            return window['VDOM_VNODE'];
        }
        set vnode(value) {
            window['VDOM_VNODE'] = value;
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
        __metadata("design:paramtypes", [])
    ], MdEditor);
    exports.MdEditor = MdEditor;
    exports.default = MdEditor;
});
//# sourceMappingURL=md-editor.js.map