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
        this.event = null;
        this.context = null;
        this.queryParams = null;
        this.pathParams = null;
        this.method = null;
        this.headers = null;
        this.body = null;
        this.stageVariables = null;
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
    ApiGateway.addStageVariablesProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.stageVariablesProperty = property;
    };
    ApiGateway.addPathParamsProperty = function (target, property) {
        var lambda = lambda_manager_1.default.instance.upsertLambdaModel(target);
        lambda.pathParamsProperty = property;
    };
    ApiGateway.getHttpVerbMethods = function (lambda, method) {
        var methods = [];
        for (var _i = 0, _a = lambda.httpVerbs; _i < _a.length; _i++) {
            var verb = _a[_i];
            if (verb.name === method) {
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
    ApiGateway.setPathConfig = function (config) {
        ApiGateway.pathConfig = config;
    };
    ApiGateway.prototype.executeHttpRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        var methods = ApiGateway.getHttpVerbMethods(lambda, this.method);
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
    ApiGateway.prototype.getObjectValue = function (object, name) {
        var info = name.split('.');
        // Ugly hack I know.
        try {
            if (info.length == 1) {
                return object[name];
            }
            if (info.length == 2) {
                return object[info[0]][info[1]];
            }
            if (info.length == 3) {
                return object[info[0]][info[1]][info[2]];
            }
            if (info.length == 4) {
                return object[info[0]][info[1]][info[2]][info[3]];
            }
            if (info.length == 5) {
                return object[info[0]][info[1]][info[2]][info[3]][info[4]];
            }
            if (info.length == 6) {
                return object[info[0]][info[1]][info[2]][info[3]][info[4]][info[5]];
            }
        }
        catch (error) {
            return "";
        }
    };
    ApiGateway.prototype.getAliasValue = function (event, alias) {
        if (typeof alias === 'string') {
            return this.getObjectValue(event, alias);
        }
        if (alias instanceof Array) {
            var value = void 0;
            for (var index in alias) {
                value = this.getObjectValue(event, alias[index]);
                if (value != undefined) {
                    return value;
                }
            }
        }
    };
    ApiGateway.prototype.setQueryParams = function () {
        if (ApiGateway.queryParamsAlias) {
            this.queryParams = this.getAliasValue(this.event, ApiGateway.queryParamsAlias);
        }
        if (!ApiGateway.queryParamsAlias) {
            this.queryParams = this.event.queryParams;
        }
        if (!ApiGateway.queryParamsAlias) {
            this.queryParams = this.event.queryStringParameters;
        }
        if (!ApiGateway.queryParamsAlias) {
            if (this.event.params) {
                this.pathParams = this.event.params.querystring;
            }
        }
    };
    ApiGateway.prototype.setPathParams = function () {
        if (ApiGateway.pathParamsAlias) {
            this.pathParams = this.getAliasValue(this.event, ApiGateway.pathParamsAlias);
        }
        if (!this.pathParams) {
            this.pathParams = this.event.pathParams;
        }
        if (!this.pathParams) {
            this.pathParams = this.event.pathParameters;
        }
        if (!this.pathParams) {
            if (this.event.params) {
                this.pathParams = this.event.params.path;
            }
        }
    };
    ApiGateway.prototype.setMethod = function () {
        if (ApiGateway.methodAlias) {
            this.method = this.getAliasValue(this.event, ApiGateway.methodAlias);
        }
        if (!this.method) {
            this.method = this.event.method;
        }
        if (!this.method) {
            this.method = this.event.httpMethod;
        }
        if (!this.method) {
            if (this.event.context) {
                this.method = this.event.context['http-method'];
            }
        }
    };
    ApiGateway.prototype.setHeaders = function () {
        if (ApiGateway.headersAlias) {
            this.headers = this.getAliasValue(this.event, ApiGateway.headersAlias);
        }
        if (!this.headers) {
            this.headers = this.event.headers;
        }
        if (!this.headers) {
            if (this.event.params) {
                this.headers = this.event.params.header;
            }
        }
    };
    ApiGateway.prototype.setBody = function () {
        if (ApiGateway.bodyAlias) {
            this.body = this.getAliasValue(this.event, ApiGateway.bodyAlias);
        }
        if (!this.body) {
            this.body = this.event.body;
        }
        if (!this.body) {
            this.body = this.event['body-json'];
        }
    };
    ApiGateway.prototype.setStageVariables = function () {
        if (ApiGateway.stageVariablesAlias) {
            this.stageVariables = this.getAliasValue(this.event, ApiGateway.stageVariablesAlias);
        }
        if (!this.stageVariables) {
            this.stageVariables = this.event.stageVariables;
        }
        if (!this.stageVariables) {
            this.stageVariables = this.event['stage-variables'];
        }
    };
    ApiGateway.prototype.resetHttpVariables = function () {
        this.queryParams = null;
        this.pathParams = null;
        this.method = null;
        this.headers = null;
        this.body = null;
        this.stageVariables = null;
    };
    ApiGateway.prototype.prepareHttpRequestVariables = function (event, context) {
        this.event = event;
        this.context = context;
        this.resetHttpVariables();
        if (event) {
            this.setQueryParams();
            this.setPathParams();
            this.setMethod();
            this.setHeaders();
            this.setBody();
            this.setStageVariables();
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
    ApiGateway.prototype.getResourcePath = function () {
        var resourcePath;
        if (ApiGateway.pathConfig) {
            resourcePath = this.getObjectValue(this.event, ApiGateway.pathConfig.resourcePathVariable);
        }
        if (!resourcePath) {
            resourcePath = this.getObjectValue(this.event, 'context.resource-path');
        }
        if (!resourcePath) {
            resourcePath = this.getObjectValue(this.event, 'path');
        }
        return resourcePath;
    };
    ApiGateway.prototype.executePathLambdaMethod = function (pathToRegEx, lambda, path) {
        var keys = pathToRegEx.exec(this.getResourcePath());
        var args = ApiGateway.getArgs(keys, pathToRegEx, lambda, path);
        var verbs = ApiGateway.getHttpVerbsByMethodName(lambda, path.methodName);
        if (verbs.length) {
            var verbExists = ApiGateway.verbExists(verbs, this.method);
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
    ApiGateway.prototype.executePath = function (lambda) {
        var pattern;
        var pathToRegEx;
        var success;
        for (var _i = 0, _a = lambda.paths; _i < _a.length; _i++) {
            var path = _a[_i];
            pattern = lambda.basePath + path.pattern;
            pathToRegEx = PathToRegex(pattern);
            if (pathToRegEx.test(this.getResourcePath())) {
                success = this.executePathLambdaMethod(pathToRegEx, lambda, path);
                if (success) {
                    return true;
                }
            }
        }
        return false;
    };
    ApiGateway.prototype.getHeaders = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!this.headers) {
                return {};
            }
        }
        return this.headers;
    };
    ApiGateway.prototype.getQueryParams = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!this.queryParams) {
                return {};
            }
        }
        return this.queryParams;
    };
    ApiGateway.prototype.getPathParams = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!this.pathParams) {
                return {};
            }
        }
        return this.pathParams;
    };
    ApiGateway.prototype.setLambdaProperties = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.headersProperty) {
            lambda.instance[lambda.headersProperty] = this.getHeaders(lambda);
        }
        if (lambda.queryParamsProperty) {
            lambda.instance[lambda.queryParamsProperty] = this.getQueryParams(lambda);
        }
        if (lambda.pathParamsProperty) {
            lambda.instance[lambda.pathParamsProperty] = this.getPathParams(lambda);
        }
        if (lambda.methodProperty) {
            lambda.instance[lambda.methodProperty] = this.method;
        }
        if (lambda.bodyProperty) {
            lambda.instance[lambda.bodyProperty] = this.body;
        }
        if (lambda.stageVariablesProperty) {
            lambda.instance[lambda.stageVariablesProperty] = this.stageVariables;
        }
    };
    return ApiGateway;
}());
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
function StageVariables(alias) {
    ApiGateway.stageVariablesAlias = alias;
    return function (target, propertyKey) {
        ApiGateway.addStageVariablesProperty(target, propertyKey);
    };
}
exports.StageVariables = StageVariables;
function Path(pattern) {
    return function (target, propertyKey) {
        /*
         * We're managing two types of signature using one decorator name
         * If target is an object, @Path is a method decorator, otherwise is a class decorator
         */
        if (typeof target === 'object') {
            ApiGateway.addPathMethod(pattern, target, propertyKey);
        }
        else {
            lambda_manager_1.default.instance.setLambdaPath(target, pattern);
        }
    };
}
exports.Path = Path;
function PathConfig(config) {
    ApiGateway.setPathConfig(config);
    return function (target) {
    };
}
exports.PathConfig = PathConfig;
function PathParam(name) {
    return function (target, propertyKey, index) {
        ApiGateway.addPathParam(name, target, propertyKey, index);
    };
}
exports.PathParam = PathParam;
