import { LhsEditor } from "./index";

export class Location {
    public static asPosition(index: number): CodeMirror.Position {
        const mirror = LhsEditor.me.mirror;
        if (mirror) {
            return mirror.posFromIndex(index);
        }
        const values = this.values(index);
        return {
            ch: values[values.length - 1].length - 1,
            line: values.length
        };
    }
    public static asNumber(position: CodeMirror.Position): number {
        const mirror = LhsEditor.me.mirror;
        if (mirror) {
            return mirror.indexFromPos(position);
        }
        let values = this.values();
        values = values.slice(0, position.line - 1);
        let text = values.join('\n');
        text += values[position.line].slice(0, position.ch);
        return text.length;
    }
    private static values(index?: number): string[] {
        const value = LhsEditor.me.getValue();
        if (index !== undefined) {
            return value.substring(0, index).split('\n');
        }
        return value.split('\n');
    }
    public constructor(index: number|CodeMirror.Position, delta = 0) {
        if (typeof index === 'number') {
            this._position = Location.asPosition(index + delta);
            this._index = index + delta;
        }
        else {
            this._index = Location.asNumber(index) + delta;
            if (delta !== 0) {
                this._position = Location.asPosition(this._index);
            }
            else {
                this._position = index;
            }
        }
    }
    public get position(): CodeMirror.Position {
        return this._position;
    }
    public get number(): number {
        return this._index;
    }
    private _position: CodeMirror.Position;
    private _index: number;
}
