"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _copy(from, to) {
    if (to === void 0) { to = {}; }
    for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
        var key = _a[_i];
        if (Object(from[key]) === from[key] && from[key].constructor === Object) {
            _copy(from[key], to[key] != null ? to[key] : to[key] = {});
        }
        else {
            to[key] = from[key];
        }
    }
}
function _extend() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var result = {};
    for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
        var object = objects_1[_a];
        _copy(object, result);
    }
    return result;
}
function createStore(store, dispatcher) {
    var STORE = _extend(store);
    var FluxStore = /** @class */ (function () {
        function FluxStore() {
            this.actionsId = '';
            this.dispatcher = dispatcher;
            this.callbacks = [];
        }
        FluxStore.prototype.registerActions = function (actionsHandlers) {
            var _this = this;
            var resultFunction = function (payload) {
                actionsHandlers(payload);
                _this.emitChange();
            };
            this.actionsId = this.dispatcher.register(resultFunction);
        };
        FluxStore.prototype.unregisterActions = function () {
            this.dispatcher.unregister(this.actionsId);
        };
        FluxStore.prototype.emitChange = function () {
            this.callbacks.forEach(function (callback) { return callback(); });
        };
        FluxStore.prototype.addListener = function (callback) {
            this.callbacks.push(callback);
        };
        FluxStore.prototype.removeListener = function (callback) {
            var _this = this;
            this.callbacks.forEach(function (registeredCallback, index) {
                if (callback === registeredCallback) {
                    _this.callbacks.splice(index, 1);
                }
            });
        };
        FluxStore.prototype.getStore = function () {
            return _extend(STORE);
        };
        FluxStore.prototype.updateStore = function (value) {
            STORE = _extend(STORE, value);
        };
        return FluxStore;
    }());
    return new FluxStore();
}
exports.default = {
    createStore: createStore,
};
exports.Store = { createStore: createStore };
