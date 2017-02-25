/**
 * Created by EGomez on 2/23/17.
 */
"use strict";
var LambdaModel = (function () {
    function LambdaModel() {
    }
    Object.defineProperty(LambdaModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "instance", {
        get: function () {
            return this._instance;
        },
        set: function (value) {
            this._instance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "eventProperty", {
        get: function () {
            return this._eventProperty;
        },
        set: function (value) {
            this._eventProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "handlerMethod", {
        get: function () {
            return this._handlerMethod;
        },
        set: function (value) {
            this._handlerMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "callbackProperty", {
        get: function () {
            return this._callbackProperty;
        },
        set: function (value) {
            this._callbackProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "queryParamsProperty", {
        get: function () {
            return this._queryParamsProperty;
        },
        set: function (value) {
            this._queryParamsProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "pathParamsProperty", {
        get: function () {
            return this._pathParamsProperty;
        },
        set: function (value) {
            this._pathParamsProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "methodProperty", {
        get: function () {
            return this._methodProperty;
        },
        set: function (value) {
            this._methodProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "contextProperty", {
        get: function () {
            return this._contextProperty;
        },
        set: function (value) {
            this._contextProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "getMethod", {
        get: function () {
            return this._getMethod;
        },
        set: function (value) {
            this._getMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "postMethod", {
        get: function () {
            return this._postMethod;
        },
        set: function (value) {
            this._postMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "patchMethod", {
        get: function () {
            return this._patchMethod;
        },
        set: function (value) {
            this._patchMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "headMethod", {
        get: function () {
            return this._headMethod;
        },
        set: function (value) {
            this._headMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "optionsMethod", {
        get: function () {
            return this._optionsMethod;
        },
        set: function (value) {
            this._optionsMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "putMethod", {
        get: function () {
            return this._putMethod;
        },
        set: function (value) {
            this._putMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "deleteMethod", {
        get: function () {
            return this._deleteMethod;
        },
        set: function (value) {
            this._deleteMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "postConstructorMethod", {
        get: function () {
            return this._postConstructorMethod;
        },
        set: function (value) {
            this._postConstructorMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "headersProperty", {
        get: function () {
            return this._headersProperty;
        },
        set: function (value) {
            this._headersProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "bodyProperty", {
        get: function () {
            return this._bodyProperty;
        },
        set: function (value) {
            this._bodyProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    return LambdaModel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LambdaModel;
