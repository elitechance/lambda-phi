/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */
"use strict";
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
    ApiGateway.executeHttpRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        switch (lambda_manager_1.default.instance.event.method) {
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
            ApiGateway.queryParams = event.queryParams;
            ApiGateway.pathParams = event.pathParams;
            ApiGateway.method = event.method;
            ApiGateway.headers = event.headers;
        }
    };
    ApiGateway.setLambdaProperties = function (lambda) {
        if (lambda.headersProperty) {
            lambda.instance[lambda.headersProperty] = ApiGateway.headers;
        }
        if (lambda.queryParamsProperty) {
            lambda.instance[lambda.queryParamsProperty] = ApiGateway.queryParams;
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
function Headers() {
    return function (target, propertyKey) {
        ApiGateway.addHeadersProperty(target, propertyKey);
    };
}
exports.Headers = Headers;
