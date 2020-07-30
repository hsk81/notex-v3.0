import { trace } from '../decorator/trace';

export interface Command {
    redo: () => Promise<Command>;
    undo?: () => Promise<Command>;
}
@trace
export class Commands {
    public static get me(): Commands {
        if (window.COMMANDS === undefined) {
            window.COMMANDS = new Commands();
        }
        return window.COMMANDS;
    }
    public constructor() {
        this._redone = [];
        this._undone = [];
    }
    public add(command: Command) {
        const ex_command = <IExCommand>command;
        const re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(ex_command);
    }
    public async run(command: Command) {
        const ex_command = <IExCommand>command;
        const re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(await ex_command.redo());
    }
    public async undo() {
        const ex_command = Commands.pop(this._redone);
        if (ex_command && typeof ex_command.undo === 'function') {
            this._undone.push(await ex_command.undo());
        }
    }
    public async redo() {
        const re_command = Commands.top(this._redone);
        const un_command = Commands.pop(this._undone);
        if (un_command && un_command.link === re_command) {
            this._redone.push(await un_command.redo());
        }
    }
    private static top(
        array: Array<IExCommand>
    ): IExCommand | undefined {
        return array[array.length - 1];
    }
    private static pop(
        array: Array<IExCommand>
    ): IExCommand | undefined {
        return array.pop();
    }
    private _redone: Array<IExCommand>;
    private _undone: Array<IExCommand>;
}
interface IExCommand extends Command {
    redo: () => Promise<IExCommand>;
    undo: () => Promise<IExCommand>;
    link: Command;
}
export default Commands;
