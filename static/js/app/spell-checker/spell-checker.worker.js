importScripts('../../lib/typo/typo-1.1.0.min.js');

self.onmessage = function (event) {
    var args = event.data, aff = Typo.prototype._readFile(
        '/static/js/lib/dictionary/' + args.lingua + '.aff', args.charset);

    if (!aff) {
        self.postMessage({typo: null});
        self.close();
        return;
    }

    var dic = Typo.prototype._readFile(
        '/static/js/lib/dictionary/' + args.lingua + '.dic', args.charset);

    if (!dic) {
        self.postMessage({typo: null});
        self.close();
        return;
    }

    try {
        self.postMessage({typo: new Typo(args.lingua, aff, dic)});
    } catch (ex) {
        self.postMessage({typo: null});
        throw ex;
    }
    self.close();
};
