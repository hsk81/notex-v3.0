declare let Typo: any;

export interface IOverlay {
    token: (stream: any, state?: any) => void;
}

export class SpellCheck {
    public static get me(): SpellCheck {
        if (this['_me'] === undefined) {
            this['_me'] = new SpellCheck();
        }
        return this['_me'];
    }

    public constructor() {
        let rx_word_bas = "!\"'#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~",
            rx_word_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿",
            rx_word_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾",
            rx_word_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎",
            rx_word_xxx = "≈≡×";

        let rx_word = new RegExp(
            `^[^${rx_word_bas}${rx_word_ext}${rx_word_sup}${rx_word_sub}${rx_word_xxx}\\d\\s]{2,}`
        );

        this._overlay = {
            token: (stream) => {
                if (stream.match(rx_word)) {
                    if (this.typo && !this.typo.check(stream.current())) {
                        return 'spell-error'; // .cm-spell-error
                    }
                }
                stream.next();
                return null;
            }
        };
    }

    private get typo(): any {
        if (this._typo === undefined) {
            this._typo = null;
            {
                let worker = new Worker(
                    '/static/js/app/spell-check/spell-check.worker.js');
                worker.onmessage = (ev: any) => {
                    if (ev.data && ev.data.typo) {
                        this._typo = Typo.prototype.load(ev.data.typo);
                    }
                };
                worker.postMessage({
                    lingua: 'en_US', charset: 'us-ascii'
                });
            }
        }
        return this._typo;
    }

    public get overlay(): IOverlay {
        return this._overlay;
    }

    private _overlay: IOverlay;
    private _typo: any;
}

export default SpellCheck;
