"use strict";
/**
 * Created by EGomez on 5/18/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HttpVerbModel = (function () {
    function HttpVerbModel() {
    }
    Object.defineProperty(HttpVerbModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpVerbModel.prototype, "methodName", {
        get: function () {
            return this._methodName;
        },
        set: function (value) {
            this._methodName = value;
        },
        enumerable: true,
        configurable: true
    });
    return HttpVerbModel;
}());
exports.default = HttpVerbModel;
