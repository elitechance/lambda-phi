"use strict";
/**
 * Created by EGomez on 5/18/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HttpVerbMethodModel = (function () {
    function HttpVerbMethodModel() {
    }
    Object.defineProperty(HttpVerbMethodModel.prototype, "verb", {
        get: function () {
            return this._verb;
        },
        set: function (value) {
            this._verb = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpVerbMethodModel.prototype, "methodName", {
        get: function () {
            return this._methodName;
        },
        set: function (value) {
            this._methodName = value;
        },
        enumerable: true,
        configurable: true
    });
    return HttpVerbMethodModel;
}());
exports.default = HttpVerbMethodModel;
