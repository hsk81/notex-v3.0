import { named } from '../decorator/named';
import { trace } from '../decorator/trace';

export interface ICommand {
    redo: () => ICommand;
    undo: () => ICommand;
}

export class Command implements ICommand {
    public redo: () => ICommand;
    public undo: () => ICommand;

    public constructor(
        redo: () => void, undo: () => void
    ) {
        this.redo = () => { redo(); return this; };
        this.undo = () => { undo(); return this; };
    }
}

@trace
@named('Commands')
export class Commands {
    public static get me(): Commands {
        if (this['_me'] === undefined) {
            this['_me'] = new Commands();
        }
        return this['_me'];
    }

    private _redone: Array<IExCommand>;
    private _undone: Array<IExCommand>;

    public constructor() {
        this._redone = [];
        this._undone = [];
    }

    public add(command: ICommand) {
        let ex_command = <IExCommand>command,
            re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(ex_command);
    }

    public run(command: ICommand) {
        let ex_command = <IExCommand>command,
            re_command = Commands.top(this._redone);
        if (re_command) {
            ex_command.link = re_command;
        }
        this._redone.push(ex_command.redo());
    }

    public undo() {
        let ex_command = Commands.pop(this._redone);
        if (ex_command) {
            this._undone.push(ex_command.undo());
        }
    }

    public redo() {
        let re_command = Commands.top(this._redone),
            un_command = Commands.pop(this._undone);
        if (un_command && un_command.link === re_command) {
            this._redone.push(un_command.redo());
        }
    }

    private static top(array: Array<IExCommand>): IExCommand {
        return array[array.length - 1];
    }
    private static pop(array: Array<IExCommand>): IExCommand {
        return array.pop();
    }
}

interface IExCommand extends ICommand {
    redo: () => IExCommand;
    undo: () => IExCommand;
    link: ICommand;
}

export default Commands;
