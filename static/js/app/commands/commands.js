var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../decorator/named", "../decorator/trace"], function (require, exports, named_1, trace_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Commands_1;
    "use strict";
    class Command {
        constructor(redo, undo) {
            this.redo = () => { redo(); return this; };
            this.undo = () => { undo(); return this; };
        }
    }
    exports.Command = Command;
    let Commands = Commands_1 = class Commands {
        constructor() {
            this._redone = [];
            this._undone = [];
        }
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = new Commands_1();
            }
            return this['_me'];
        }
        add(command) {
            let ex_command = command, re_command = Commands_1.top(this._redone);
            if (re_command) {
                ex_command.link = re_command;
            }
            this._redone.push(ex_command);
        }
        run(command) {
            let ex_command = command, re_command = Commands_1.top(this._redone);
            if (re_command) {
                ex_command.link = re_command;
            }
            this._redone.push(ex_command.redo());
        }
        undo() {
            let ex_command = Commands_1.pop(this._redone);
            if (ex_command) {
                this._undone.push(ex_command.undo());
            }
        }
        redo() {
            let re_command = Commands_1.top(this._redone), un_command = Commands_1.pop(this._undone);
            if (un_command && un_command.link === re_command) {
                this._redone.push(un_command.redo());
            }
        }
        static top(array) {
            return array[array.length - 1];
        }
        static pop(array) {
            return array.pop();
        }
    };
    Commands = Commands_1 = __decorate([
        trace_1.trace,
        named_1.named('Commands'),
        __metadata("design:paramtypes", [])
    ], Commands);
    exports.Commands = Commands;
    exports.default = Commands;
});
//# sourceMappingURL=commands.js.map