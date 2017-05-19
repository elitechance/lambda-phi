"use strict";
/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var lambda_manager_1 = require("./lambda-manager");
var http_model_1 = require("./http-model");
var path_model_1 = require("./path-model");
var PathToRegex = require("path-to-regexp");
var path_param_model_1 = require("./path-param-model");
var http_verb_model_1 = require("./http-verb-model");
var ApiGateway = (function () {
    function ApiGateway() {
    }
    ApiGateway.addHttpVerbMethod = function (name, target, methodName) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        var httpVerb = new http_verb_model_1.default();
        httpVerb.name = name;
        httpVerb.methodName = methodName;
        lambda.httpVerbs.push(httpVerb);
    };
    ApiGateway.addAnyMethod = function (target, method) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.anyMethod = method;
    };
    ApiGateway.addHandlerMethod = function (target, method) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.handlerMethod = method;
    };
    ApiGateway.addPostConstructorMethod = function (target, method) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.postConstructorMethod = method;
    };
    ApiGateway.addPathMethod = function (pattern, target, method) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        var path = new path_model_1.default();
        path.pattern = pattern;
        path.methodName = method;
        lambda.paths.push(path);
    };
    ApiGateway.addPathParam = function (name, target, methodName, index) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        var pathParamModel = new path_param_model_1.default();
        pathParamModel.defaultValue = null;
        pathParamModel.name = name;
        pathParamModel.index = index;
        pathParamModel.methodName = methodName;
        lambda.pathParams.push(pathParamModel);
    };
    ApiGateway.addHeadersProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.headersProperty = property;
    };
    ApiGateway.addQueryParamsProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.queryParamsProperty = property;
    };
    ApiGateway.addMethodProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.methodProperty = property;
    };
    ApiGateway.addBodyProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.bodyProperty = property;
    };
    ApiGateway.addPathParamsProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.pathParamsProperty = property;
    };
    ApiGateway.getHttpVerbMethods = function (lambda) {
        var methods = [];
        for (var _i = 0, _a = lambda.httpVerbs; _i < _a.length; _i++) {
            var verb = _a[_i];
            if (verb.name === ApiGateway.method) {
                methods.push(verb.methodName);
            }
        }
        return methods;
    };
    ApiGateway.methodHasPath = function (lambda, methodName) {
        for (var _i = 0, _a = lambda.paths; _i < _a.length; _i++) {
            var path = _a[_i];
            if (path.methodName === methodName) {
                return true;
            }
        }
        return false;
    };
    ApiGateway.executeHttpRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        var methods = ApiGateway.getHttpVerbMethods(lambda);
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var method = methods_1[_i];
            if (!ApiGateway.methodHasPath(lambda, method)) {
                lambda.instance[method]();
                return;
            }
        }
        ApiGateway.executeAnyRequest(lambda);
    };
    ApiGateway.executeAnyRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.anyMethod) {
            lambda.instance[lambda.anyMethod]();
        }
    };
    ApiGateway.getAliasValue = function (event, alias) {
        if (typeof alias === 'string') {
            return event[alias];
        }
        if (alias instanceof Array) {
            var value = void 0;
            for (var index in alias) {
                value = event[alias[index]];
                if (value != undefined) {
                    return value;
                }
            }
        }
    };
    ApiGateway.setQueryParams = function () {
        if (ApiGateway.queryParamsAlias) {
            ApiGateway.queryParams = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.queryParamsAlias);
        }
        else {
            ApiGateway.queryParams = ApiGateway.event.queryParams;
        }
    };
    ApiGateway.setPathParams = function () {
        if (ApiGateway.pathParamsAlias) {
            ApiGateway.pathParams = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.pathParamsAlias);
        }
        else {
            ApiGateway.pathParams = ApiGateway.event.queryParams;
        }
    };
    ApiGateway.setMethod = function () {
        if (ApiGateway.methodAlias) {
            ApiGateway.method = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.methodAlias);
        }
        else {
            ApiGateway.method = ApiGateway.event.method;
            if (!ApiGateway.method) {
                ApiGateway.method = ApiGateway.context.httpMethod;
            }
        }
    };
    ApiGateway.setHeaders = function () {
        if (ApiGateway.headersAlias) {
            ApiGateway.headers = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.headersAlias);
        }
        else {
            ApiGateway.headers = ApiGateway.event.headers;
        }
    };
    ApiGateway.setBody = function () {
        if (ApiGateway.bodyAlias) {
            ApiGateway.body = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.bodyAlias);
        }
        else {
            ApiGateway.body = ApiGateway.event.body;
        }
    };
    ApiGateway.prepareHttpRequestVariables = function (event, context) {
        ApiGateway.event = event;
        ApiGateway.context = context;
        if (event) {
            ApiGateway.setQueryParams();
            ApiGateway.setPathParams();
            ApiGateway.setMethod();
            ApiGateway.setHeaders();
            ApiGateway.setBody();
        }
        else {
            ApiGateway.method = context.httpMethod;
        }
    };
    ApiGateway.getHttpVerbsByMethodName = function (lambda, methodName) {
        var verbs = [];
        for (var _i = 0, _a = lambda.httpVerbs; _i < _a.length; _i++) {
            var verb = _a[_i];
            if (verb.methodName === methodName) {
                verbs.push(verb.name);
            }
        }
        return verbs;
    };
    ApiGateway.verbExists = function (verbs, verb) {
        for (var _i = 0, verbs_1 = verbs; _i < verbs_1.length; _i++) {
            var currentVerb = verbs_1[_i];
            if (currentVerb === verb) {
                return true;
            }
        }
        return false;
    };
    ApiGateway.getArgs = function (keys, pathToRegEx, lambda, path) {
        var args = [];
        var value;
        var i = 1;
        var _loop_1 = function (key) {
            value = keys[i++];
            lambda.pathParams.map(function (pathParam) {
                if (pathParam.methodName === path.methodName && key.name == pathParam.name) {
                    args[pathParam.index] = value;
                }
                return pathParam;
            });
        };
        for (var _i = 0, _a = pathToRegEx.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_1(key);
        }
        return args;
    };
    ApiGateway.executePathLambdaMethod = function (pathToRegEx, lambda, path) {
        var keys = pathToRegEx.exec(ApiGateway.context.resourcePath);
        var args = ApiGateway.getArgs(keys, pathToRegEx, lambda, path);
        var verbs = ApiGateway.getHttpVerbsByMethodName(lambda, path.methodName);
        if (verbs.length) {
            var verbExists = ApiGateway.verbExists(verbs, ApiGateway.context.httpMethod);
            if (verbExists) {
                lambda.instance[path.methodName].apply(lambda.instance, args);
                return true;
            }
            return false;
        }
        else {
            lambda.instance[path.methodName].apply(lambda.instance, args);
            return true;
        }
    };
    ApiGateway.executePath = function (lambda) {
        var pattern;
        var pathToRegEx;
        for (var _i = 0, _a = lambda.paths; _i < _a.length; _i++) {
            var path = _a[_i];
            pattern = lambda.basePath + path.pattern;
            pathToRegEx = PathToRegex(pattern);
            if (pathToRegEx.test(ApiGateway.context.resourcePath)) {
                return ApiGateway.executePathLambdaMethod(pathToRegEx, lambda, path);
            }
        }
        return false;
    };
    ApiGateway.getHeaders = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.headers) {
                return {};
            }
        }
        return ApiGateway.headers;
    };
    ApiGateway.getQueryParams = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.queryParams) {
                return {};
            }
        }
        return ApiGateway.queryParams;
    };
    ApiGateway.getPathParams = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.pathParams) {
                return {};
            }
        }
        return ApiGateway.pathParams;
    };
    ApiGateway.setLambdaProperties = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.headersProperty) {
            lambda.instance[lambda.headersProperty] = ApiGateway.getHeaders(lambda);
        }
        if (lambda.queryParamsProperty) {
            lambda.instance[lambda.queryParamsProperty] = ApiGateway.getQueryParams(lambda);
        }
        if (lambda.pathParamsProperty) {
            lambda.instance[lambda.pathParamsProperty] = ApiGateway.getPathParams(lambda);
        }
        if (lambda.methodProperty) {
            lambda.instance[lambda.methodProperty] = ApiGateway.method;
        }
        if (lambda.bodyProperty) {
            lambda.instance[lambda.bodyProperty] = ApiGateway.body;
        }
    };
    return ApiGateway;
}());
ApiGateway.event = null;
ApiGateway.context = null;
exports.ApiGateway = ApiGateway;
function Get() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_GET, target, methodName);
    };
}
exports.Get = Get;
function Post() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_POST, target, methodName);
    };
}
exports.Post = Post;
function Put() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_PUT, target, methodName);
    };
}
exports.Put = Put;
function Patch() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_PATCH, target, methodName);
    };
}
exports.Patch = Patch;
function Options() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_OPTIONS, target, methodName);
    };
}
exports.Options = Options;
function Delete() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_DELETE, target, methodName);
    };
}
exports.Delete = Delete;
function Head() {
    return function (target, methodName) {
        ApiGateway.addHttpVerbMethod(http_model_1.default.METHOD_HEAD, target, methodName);
    };
}
exports.Head = Head;
function Any() {
    return function (target, methodName) {
        ApiGateway.addAnyMethod(target, methodName);
    };
}
exports.Any = Any;
/**
 * "alias" will be the alternative name defined in Body Mapping Templates
 */
function Headers(alias) {
    ApiGateway.headersAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addHeadersProperty(target, propertyKey);
    };
}
exports.Headers = Headers;
function QueryParams(alias) {
    ApiGateway.queryParamsAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addQueryParamsProperty(target, propertyKey);
    };
}
exports.QueryParams = QueryParams;
function PathParams(alias) {
    ApiGateway.pathParamsAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addPathParamsProperty(target, propertyKey);
    };
}
exports.PathParams = PathParams;
function Method(alias) {
    ApiGateway.methodAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addMethodProperty(target, propertyKey);
    };
}
exports.Method = Method;
function Body(alias) {
    ApiGateway.bodyAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addBodyProperty(target, propertyKey);
    };
}
exports.Body = Body;
function Path(pattern) {
    return function (target, propertyKey) {
        if (typeof target === 'object') {
            ApiGateway.addPathMethod(pattern, target, propertyKey);
        }
        else {
            lambda_manager_1.default.instance.setLambdaPath(target, pattern);
        }
    };
}
exports.Path = Path;
function PathParam(name) {
    return function (target, propertyKey, index) {
        ApiGateway.addPathParam(name, target, propertyKey, index);
    };
}
exports.PathParam = PathParam;
