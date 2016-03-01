importScripts(
    '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js');

onmessage = function (ev) {
    var result = (ev.data.language)
        ? self.hljs.highlight(ev.data.language, ev.data.code, true)
        : self.hljs.highlightAuto(ev.data.code);

    postMessage({error: null, code: result.value});
};
