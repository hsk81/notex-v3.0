declare let Typo: any;

export interface IOverlay {
    token: (stream: any, state?: any) => void;
}

export class MdEditorSpellCheck {
    public static get me(): MdEditorSpellCheck {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditorSpellCheck();
        }
        return this['_me'];
    }

    private affPath = 'static/js/lib/dictionary/en_US.aff';
    private dicPath = 'static/js/lib/dictionary/en_US.dic';

    public constructor() {
        let rx_word_bas = "!\"'#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~",
            rx_word_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿",
            rx_word_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾",
            rx_word_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎",
            rx_word_xxx = "≈≡×";

        let rx_word = new RegExp (
            `^[^${rx_word_bas}${rx_word_ext}${rx_word_sup}${rx_word_sub}${rx_word_xxx}\\d\\s]{2,}`
        );

        this._overlay = {
            token: (stream, state) => {
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
                let xhr_aff = new XMLHttpRequest();
                xhr_aff.open('GET', this.affPath, true);
                xhr_aff.onload = () => {
                    if (xhr_aff.status === 200 &&
                        xhr_aff.readyState === 4)
                    {
                        let xhr_dic = new XMLHttpRequest();
                        xhr_dic.open('GET', this.dicPath, true);
                        xhr_dic.onload = () => {
                            if (xhr_dic.status === 200 &&
                                xhr_dic.readyState === 4)
                            {
                                let aff = xhr_aff.responseText,
                                    dic = xhr_dic.responseText;
                                this._typo = new Typo ('en_US', aff, dic, {
                                    platform: 'any'
                                });
                            }
                        };
                        xhr_dic.send(null);
                    }
                };
                xhr_aff.send(null);
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

export default MdEditorSpellCheck;
