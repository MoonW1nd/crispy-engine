"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Actions_1 = require("./Actions");
var Dispatcher_1 = require("./Dispatcher");
var Store_1 = __importDefault(require("./Store"));
(function (libraryModule) {
    if (typeof exports === 'object') {
        module.exports = libraryModule();
    }
    else if (window) {
        window.iFlux = libraryModule();
    }
    else {
        throw Error('Окружение не определено');
    }
})(function () { return ({ Actions: Actions_1.Actions, Dispatcher: Dispatcher_1.Dispatcher, Store: Store_1.default }); });
