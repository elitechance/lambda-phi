"use strict";
/**
 * Created by EGomez on 2/23/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LambdaModel = (function () {
    function LambdaModel() {
        this._paths = [];
        this._pathParams = [];
        this._httpVerbs = [];
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
    Object.defineProperty(LambdaModel.prototype, "eventContextProperty", {
        get: function () {
            return this._eventContextProperty;
        },
        set: function (value) {
            this._eventContextProperty = value;
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
    Object.defineProperty(LambdaModel.prototype, "anyMethod", {
        get: function () {
            return this._anyMethod;
        },
        set: function (value) {
            this._anyMethod = value;
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
    Object.defineProperty(LambdaModel.prototype, "preLambdaTimeoutMethod", {
        get: function () {
            return this._preLambdaTimeoutMethod;
        },
        set: function (value) {
            this._preLambdaTimeoutMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "preLambdaTimeoutTime", {
        get: function () {
            return this._preLambdaTimeoutTime;
        },
        set: function (value) {
            this._preLambdaTimeoutTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "preLambdaCallbackMethod", {
        get: function () {
            return this._preLambdaCallbackMethod;
        },
        set: function (value) {
            this._preLambdaCallbackMethod = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "paths", {
        get: function () {
            return this._paths;
        },
        set: function (value) {
            this._paths = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "basePath", {
        get: function () {
            return this._basePath;
        },
        set: function (value) {
            this._basePath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "pathParams", {
        get: function () {
            return this._pathParams;
        },
        set: function (value) {
            this._pathParams = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "httpVerbs", {
        get: function () {
            return this._httpVerbs;
        },
        set: function (value) {
            this._httpVerbs = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaModel.prototype, "stageVariablesProperty", {
        get: function () {
            return this._stageVariablesProperty;
        },
        set: function (value) {
            this._stageVariablesProperty = value;
        },
        enumerable: true,
        configurable: true
    });
    return LambdaModel;
}());
exports.default = LambdaModel;
