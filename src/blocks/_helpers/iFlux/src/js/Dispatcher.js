"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idPrefix = 'id_';
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
        this.id = 0;
        this.callbacks = {};
    }
    Dispatcher.prototype.dispatch = function (payload) {
        var _this = this;
        Object.keys(this.callbacks).forEach(function (id) {
            _this.callbacks[id](payload);
        });
    };
    Dispatcher.prototype.register = function (cb) {
        if (typeof cb === 'function') {
            var currentId = "" + idPrefix + this.id;
            this.id += 1;
            this.callbacks[currentId] = cb;
            return currentId;
        }
        else {
            throw Error('Переданный в диспетчер cb не является функцией.');
        }
    };
    Dispatcher.prototype.unregister = function (id) {
        if (this.callbacks[id]) {
            delete this.callbacks[id];
        }
        else {
            throw Error('Не найден cb по заданному идентификатору.');
        }
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
