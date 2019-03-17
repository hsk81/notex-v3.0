export interface ILingua {
    charset: string | null;
    code: string | null;
}

export interface IOverlay {
    token: (stream: any, state?: any) => void;
}

declare let Typo: any;

export class SpellChecker {
    public constructor(
        lingua: ILingua, callback: (overlay: IOverlay | null) => void
    ) {
        let worker = new Worker(
            '/static/js/app/spell-checker/spell-checker.worker.js');
        worker.onmessage = (ev: any) => {
            if (ev.data && ev.data.typo) {
                this.typo = Typo.prototype.load(ev.data.typo);
                callback({
                    token: (stream) => {
                        if (stream.match(this.separator)) {
                            if (!this.typo.check(stream.current())) {
                                return 'spell-error'; // .cm-spell-error
                            }
                        }
                        stream.next();
                        return null;
                    }
                })
            } else {
                this.typo = null;
                callback(null);
            }
        };
        worker.postMessage({
            lingua: lingua.code, charset: lingua.charset
        });
    }

    private get separator(): RegExp {
        if (!this._separator) {
            let rx_bas = "!\"#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~",
                rx_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿",
                rx_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾",
                rx_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎",
                rx_xxx = "≈≡×";

            this._separator = new RegExp(
                `^[^${rx_bas}${rx_ext}${rx_sup}${rx_sub}${rx_xxx}\\d\\s]{2,}`);
        }
        return this._separator;
    }

    private get typo(): any {
        return this._typo;
    }

    private set typo(value: any) {
        this._typo = value;
    }

    private _separator: RegExp | undefined;
    private _typo: any;
}

export default SpellChecker;
