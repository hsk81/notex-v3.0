(function () {
    var timeout_id, md_old, workers = [];

    marked.setOptions({
        highlight: function (code, language, callback) {
            if (workers.length === 0) {
                workers.push(new Worker('/static/js/app/highlight/worker.js'));
            }
            var worker = workers.pop();
            worker.onmessage = function (ev) {
                callback(ev.data.error, ev.data.code);
                workers.push(worker);
            };
            worker.postMessage({code: code, language: language});
        }
    });

    $('#md-inp').on('keypress', function (ev) {
        if (timeout_id !== undefined) {
            clearTimeout(timeout_id);
            timeout_id = undefined;
        }
    });
    $('#md-inp').on('change keyup paste', buffered(function (ev) {
        var $md_inp = $(ev.target),
            $md_out = $('#md-out');

        var md_new = $md_inp.val();
        if (md_new !== md_old) {
            md_old = md_new;

            if (timeout_id !== undefined) {
                clearTimeout(timeout_id);
                timeout_id = undefined;
            }

            timeout_id = setTimeout(function () {
                if (MathJax !== undefined) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "md-out"]);
                }
            }, 600);

            marked($md_inp.val(), function (error, content) {
                if (error) throw error;
                $md_out.html(content);
            });
        }
    }, 200));
}());