"use strict";
/**
 * Created by EGomez on 5/4/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HttpModel = (function () {
    function HttpModel() {
    }
    return HttpModel;
}());
HttpModel.METHOD_GET = 'GET';
HttpModel.METHOD_POST = 'POST';
HttpModel.METHOD_PATCH = 'PATCH';
HttpModel.METHOD_OPTIONS = 'OPTIONS';
HttpModel.METHOD_PUT = 'PUT';
HttpModel.METHOD_HEAD = 'HEAD';
HttpModel.METHOD_DELETE = 'DELETE';
HttpModel.methods = [
    HttpModel.METHOD_GET,
    HttpModel.METHOD_POST,
    HttpModel.METHOD_PATCH,
    HttpModel.METHOD_OPTIONS,
    HttpModel.METHOD_PUT,
    HttpModel.METHOD_HEAD,
    HttpModel.METHOD_DELETE,
];
exports.default = HttpModel;
