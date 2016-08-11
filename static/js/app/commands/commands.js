var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../decorator/named', '../decorator/trace'], function (require, exports, named_1, trace_1) {
    "use strict";
    var Command = (function () {
        function Command(redo, undo) {
            var _this = this;
            this.redo = function () { redo(); return _this; };
            this.undo = function () { undo(); return _this; };
        }
        return Command;
    }());
    exports.Command = Command;
    var Commands = (function () {
        function Commands() {
            this._redone = [];
            this._undone = [];
        }
        Object.defineProperty(Commands, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new Commands();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Commands.prototype.add = function (command) {
            var ex_command = command, re_command = Commands.top(this._redone);
            if (re_command) {
                ex_command.link = re_command;
            }
            this._redone.push(ex_command);
        };
        Commands.prototype.run = function (command) {
            var ex_command = command, re_command = Commands.top(this._redone);
            if (re_command) {
                ex_command.link = re_command;
            }
            this._redone.push(ex_command.redo());
        };
        Commands.prototype.undo = function () {
            var ex_command = Commands.pop(this._redone);
            if (ex_command) {
                this._undone.push(ex_command.undo());
            }
        };
        Commands.prototype.redo = function () {
            var re_command = Commands.top(this._redone), un_command = Commands.pop(this._undone);
            if (un_command && un_command.link === re_command) {
                this._redone.push(un_command.redo());
            }
        };
        Commands.top = function (array) {
            return array[array.length - 1];
        };
        Commands.pop = function (array) {
            return array.pop();
        };
        Commands = __decorate([
            trace_1.trace,
            named_1.named('Commands'), 
            __metadata('design:paramtypes', [])
        ], Commands);
        return Commands;
    }());
    exports.Commands = Commands;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Commands;
});
//# sourceMappingURL=commands.js.map