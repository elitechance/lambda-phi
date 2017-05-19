"use strict";
/**
 * Created by EGomez on 5/18/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PathParamModel = (function () {
    function PathParamModel() {
        this._defaultValue = null;
    }
    Object.defineProperty(PathParamModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathParamModel.prototype, "index", {
        get: function () {
            return this._index;
        },
        set: function (value) {
            this._index = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathParamModel.prototype, "methodName", {
        get: function () {
            return this._methodName;
        },
        set: function (value) {
            this._methodName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathParamModel.prototype, "defaultValue", {
        get: function () {
            return this._defaultValue;
        },
        set: function (value) {
            this._defaultValue = value;
        },
        enumerable: true,
        configurable: true
    });
    return PathParamModel;
}());
exports.default = PathParamModel;
