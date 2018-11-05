"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Actions = /** @class */ (function () {
    function Actions(dispatcher) {
        this.dispatcher = dispatcher;
        this.list = {};
        this.creatorsList = {};
    }
    Actions.prototype.create = function (actionName, actionCreatorName) {
        var _this = this;
        if (actionCreatorName == null) {
            actionCreatorName = convertUpperCaseToCamelCase(actionName);
        }
        if (actionName in this.list) {
            throw Error('Имя заданного действия уже существует');
        }
        if (actionCreatorName in this.creatorsList) {
            throw Error('Имя метода создания события уже существует');
        }
        this.list[actionName] = actionName;
        this.creatorsList[actionCreatorName] = actionName;
        Actions.prototype[actionCreatorName] = function (data) {
            _this.dispatcher.dispatch({
                action: _this.list[actionName],
                data: data,
            });
        };
    };
    return Actions;
}());
exports.Actions = Actions;
function convertUpperCaseToCamelCase(value) {
    value = value.toLowerCase();
    return value.replace(/_\w/g, function (m) { return m[1].toUpperCase(); });
}
