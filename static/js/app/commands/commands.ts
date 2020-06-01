import { trace } from '../decorator/trace';

export interface ICommand {
    redo: () => ICommand;
    undo: () => ICommand;
}
export class Command implements ICommand {
    public constructor(
        redo: () => void, undo: () => void
    ) {
        this.redo = () => { redo(); return this; };
        this.undo = () => { undo(); return this; };
    }
    public redo: () => ICommand;
    public undo: () => ICommand;
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
    public add(command: ICommand) {
        const ex_command = <IExCommand>command;
        const re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(ex_command);
    }
    public run(command: ICommand) {
        const ex_command = <IExCommand>command;
        const re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(ex_command.redo());
    }
    public undo() {
        const ex_command = Commands.pop(this._redone);
        if (ex_command) {
            this._undone.push(ex_command.undo());
        }
    }
    public redo() {
        const re_command = Commands.top(this._redone);
        const un_command = Commands.pop(this._undone);
        if (un_command && un_command.link === re_command) {
            this._redone.push(un_command.redo());
        }
    }
    private static top(array: Array<IExCommand>): IExCommand | undefined {
        return array[array.length - 1];
    }
    private static pop(array: Array<IExCommand>): IExCommand | undefined {
        return array.pop();
    }
    private _redone: Array<IExCommand>;
    private _undone: Array<IExCommand>;
}
interface IExCommand extends ICommand {
    redo: () => IExCommand;
    undo: () => IExCommand;
    link: ICommand;
}
export default Commands;
