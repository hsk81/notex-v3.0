importScripts('../../lib/typo/typo-1.1.0.min.js');

self.onmessage = function (event) {
    var lingua = event.data.lingua,
        charset = event.data.charset;

    var aff_url = '/static/js/lib/dictionary/' + lingua + '.aff',
        aff_req = new XMLHttpRequest();
    var dic_url = '/static/js/lib/dictionary/' + lingua + '.dic',
        dic_req = new XMLHttpRequest();

    if (charset) {
        aff_req.overrideMimeType("text/plain; charset=" + charset);
        dic_req.overrideMimeType("text/plain; charset=" + charset);
    }

    var aff = null,
        dic = null;

    aff_req.onload = function (ev) {
        if (this.status === 200) {
            var txt = this.responseText;
            if (txt && dic) {
                self.postMessage({
                    typo: new Typo(lingua, txt, dic)
                });
                self.close();
            } else {
                aff = txt;
            }
        } else {
            self.postMessage({typo: null});
            self.close();
        }
    };

    dic_req.onload = function (ev) {
        if (this.status === 200) {
            var txt = this.responseText;
            if (txt && aff) {
                self.postMessage({
                    typo: new Typo(lingua, aff, txt)
                });
                self.close();
            } else {
                dic = txt;
            }
        } else {
            self.postMessage({typo: null});
            self.close();
        }
    };

    aff_req.open('GET', aff_url);
    aff_req.send(null);
    dic_req.open('GET', dic_url);
    dic_req.send(null);
};
