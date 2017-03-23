/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lambda_manager_1 = require("./lambda-manager");
var ApiGateway = (function () {
    function ApiGateway() {
    }
    ApiGateway.addGetMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.getMethod = method;
    };
    ApiGateway.addPostMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.postMethod = method;
    };
    ApiGateway.addPutMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.putMethod = method;
    };
    ApiGateway.addPatchMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.patchMethod = method;
    };
    ApiGateway.addOptionsMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.optionsMethod = method;
    };
    ApiGateway.addDeleteMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.deleteMethod = method;
    };
    ApiGateway.addHeadMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.headMethod = method;
    };
    ApiGateway.addAnyMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.anyMethod = method;
    };
    ApiGateway.addHandlerMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.handlerMethod = method;
    };
    ApiGateway.addPostConstructorMethod = function (target, method) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.postConstructorMethod = method;
    };
    ApiGateway.addHeadersProperty = function (target, property) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.headersProperty = property;
    };
    ApiGateway.addQueryParamsProperty = function (target, property) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.queryParamsProperty = property;
    };
    ApiGateway.addMethodProperty = function (target, property) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.methodProperty = property;
    };
    ApiGateway.addBodyProperty = function (target, property) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.bodyProperty = property;
    };
    ApiGateway.addPathParamsProperty = function (target, property) {
        lambda_manager_1.default.instance.addLambda(target);
        var lambda = lambda_manager_1.default.instance.getLambda(target);
        lambda.pathParamsProperty = property;
    };
    ApiGateway.requestMethodHasDefinition = function (method, lambda) {
        switch (method) {
            case 'GET': return !!lambda.getMethod;
            case 'PUT': return !!lambda.putMethod;
            case 'POST': return !!lambda.postMethod;
            case 'PATCH': return !!lambda.patchMethod;
            case 'OPTIONS': return !!lambda.optionsMethod;
            case 'HEAD': return !!lambda.headMethod;
            case 'DELETE': return !!lambda.deleteMethod;
        }
        return false;
    };
    ApiGateway.executeHttpRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (!this.requestMethodHasDefinition(ApiGateway.method, lambda)) {
            return ApiGateway.executeAnyRequest(lambda);
        }
        switch (ApiGateway.method) {
            case 'GET':
                ApiGateway.executeGetRequest(lambda);
                break;
            case 'PUT':
                ApiGateway.executePutRequest(lambda);
                break;
            case 'POST':
                ApiGateway.executePostRequest(lambda);
                break;
            case 'PATCH':
                ApiGateway.executePatchRequest(lambda);
                break;
            case 'OPTIONS':
                ApiGateway.executeOptionsRequest(lambda);
                break;
            case 'HEAD':
                ApiGateway.executeHeadRequest(lambda);
                break;
            case 'DELETE':
                ApiGateway.executeDeleteRequest(lambda);
                break;
        }
    };
    ApiGateway.executeGetRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.getMethod) {
            lambda.instance[lambda.getMethod]();
        }
    };
    ApiGateway.executePostRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.postMethod) {
            lambda.instance[lambda.postMethod]();
        }
    };
    ApiGateway.executePutRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.putMethod) {
            lambda.instance[lambda.putMethod]();
        }
    };
    ApiGateway.executeDeleteRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.deleteMethod) {
            lambda.instance[lambda.deleteMethod]();
        }
    };
    ApiGateway.executeAnyRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.anyMethod) {
            lambda.instance[lambda.anyMethod]();
        }
    };
    ApiGateway.executeHeadRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.headMethod) {
            lambda.instance[lambda.headMethod]();
        }
    };
    ApiGateway.executeOptionsRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.optionsMethod) {
            lambda.instance[lambda.optionsMethod]();
        }
    };
    ApiGateway.executePatchRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.patchMethod) {
            lambda.instance[lambda.patchMethod]();
        }
    };
    ApiGateway.prepareHttpRequestVariables = function (event) {
        if (event) {
            if (ApiGateway.queryParamsAlias) {
                ApiGateway.queryParams = event[ApiGateway.queryParamsAlias];
            }
            else {
                ApiGateway.queryParams = event.queryParams;
            }
            if (ApiGateway.pathParamsAlias) {
                ApiGateway.pathParams = event[ApiGateway.pathParamsAlias];
            }
            else {
                ApiGateway.pathParams = event.pathParams;
            }
            if (ApiGateway.methodAlias) {
                ApiGateway.method = event[ApiGateway.methodAlias];
            }
            else {
                ApiGateway.method = event.method;
            }
            if (ApiGateway.headersAlias) {
                ApiGateway.headers = event[ApiGateway.headersAlias];
            }
            else {
                ApiGateway.headers = event.headers;
            }
            if (ApiGateway.bodyAlias) {
                ApiGateway.headers = event[ApiGateway.bodyAlias];
            }
            else {
                ApiGateway.body = event.body;
            }
        }
    };
    ApiGateway.setLambdaProperties = function (lambda) {
        if (lambda.headersProperty) {
            lambda.instance[lambda.headersProperty] = ApiGateway.headers;
        }
        if (lambda.queryParamsProperty) {
            lambda.instance[lambda.queryParamsProperty] = ApiGateway.queryParams;
        }
        if (lambda.pathParamsProperty) {
            lambda.instance[lambda.pathParamsProperty] = ApiGateway.pathParams;
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
exports.ApiGateway = ApiGateway;
function Get() {
    return function (target, methodName) {
        ApiGateway.addGetMethod(target, methodName);
    };
}
exports.Get = Get;
function Post() {
    return function (target, methodName) {
        ApiGateway.addPostMethod(target, methodName);
    };
}
exports.Post = Post;
function Put() {
    return function (target, methodName) {
        ApiGateway.addPutMethod(target, methodName);
    };
}
exports.Put = Put;
function Patch() {
    return function (target, methodName) {
        ApiGateway.addPatchMethod(target, methodName);
    };
}
exports.Patch = Patch;
function Options() {
    return function (target, methodName) {
        ApiGateway.addOptionsMethod(target, methodName);
    };
}
exports.Options = Options;
function Delete() {
    return function (target, methodName) {
        ApiGateway.addDeleteMethod(target, methodName);
    };
}
exports.Delete = Delete;
function Head() {
    return function (target, methodName) {
        ApiGateway.addHeadMethod(target, methodName);
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
