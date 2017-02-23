/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */
"use strict";
var lambda_manager_1 = require("./lambda-manager");
function Get() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addGetMethod(target, methodName);
    };
}
exports.Get = Get;
function Post() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addPostMethod(target, methodName);
    };
}
exports.Post = Post;
function Put() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addPutMethod(target, methodName);
    };
}
exports.Put = Put;
function Patch() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addPatchMethod(target, methodName);
    };
}
exports.Patch = Patch;
function Options() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addOptionsMethod(target, methodName);
    };
}
exports.Options = Options;
function Delete() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addDeleteMethod(target, methodName);
    };
}
exports.Delete = Delete;
function Head() {
    return function (target, methodName) {
        lambda_manager_1.default.instance.addHeadMethod(target, methodName);
    };
}
exports.Head = Head;
