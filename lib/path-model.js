"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by EGomez on 5/4/17.
 */
var PathModel = (function () {
    function PathModel() {
        this._httpMethods = null;
    }
    Object.defineProperty(PathModel.prototype, "pattern", {
        get: function () {
            return this._pattern;
        },
        set: function (value) {
            this._pattern = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathModel.prototype, "httpMethods", {
        get: function () {
            return this._httpMethods;
        },
        set: function (value) {
            this._httpMethods = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathModel.prototype, "methodName", {
        get: function () {
            return this._methodName;
        },
        set: function (value) {
            this._methodName = value;
        },
        enumerable: true,
        configurable: true
    });
    return PathModel;
}());
exports.default = PathModel;
