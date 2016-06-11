interface Function {
    cancel:Function;
}

function buffered(fn:Function, ms:number = 200):Function {
    let id:number, gn:Function = function () {
        let self = this, args = arguments;
        if (id !== undefined) {
            clearTimeout(id);
            id = undefined;
        }

        if (id === undefined) {
            id = setTimeout(function () {
                fn.apply(self, args);
                id = undefined;
            }, ms);
        }
    };

    gn.cancel = function () {
        if (id !== undefined) {
            clearTimeout(id);
            id = undefined;
        }
    };

    return gn;
}