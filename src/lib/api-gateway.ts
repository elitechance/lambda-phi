/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */

import LambdaManager from "./lambda-manager";
import LambdaModel from "./lambda-model";
import HttpModel from "./http-model";
import PathModel from "./path-model";
import PathToRegex = require('path-to-regexp');
import PathParamModel from "./path-param-model";
import HttpVerbModel from "./http-verb-model";

export class ApiGateway {

    private static event = null;
    private static context = null;

    private static queryParams;
    private static pathParams;
    private static method;
    private static headers;
    private static body;
    private static stageVariables;

    private static pathConfig:any;

    public static queryParamsAlias;
    public static pathParamsAlias;
    public static methodAlias;
    public static headersAlias;
    public static bodyAlias;
    public static stageVariablesAlias;

    public static addHttpVerbMethod(name:string, target, methodName) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        let httpVerb = new HttpVerbModel();
        httpVerb.name = name;
        httpVerb.methodName = methodName;
        lambda.httpVerbs.push(httpVerb);
    }

    public static addAnyMethod(target, method) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.anyMethod = method;
    }

    public static addHandlerMethod(target, method) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.handlerMethod= method;
    }

    public static addPostConstructorMethod(target, method) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.postConstructorMethod = method;
    }

    public static addPathMethod(pattern:string, target, method) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        let path = new PathModel();
        path.pattern = pattern;
        path.methodName = method;
        lambda.paths.push(path);
    }

    public static addPathParam(name:string, target, methodName, index:number) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        let pathParamModel = new PathParamModel();
        pathParamModel.defaultValue = null;
        pathParamModel.name = name;
        pathParamModel.index = index;
        pathParamModel.methodName = methodName;
        lambda.pathParams.push(pathParamModel);
    }


    public static addHeadersProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.headersProperty = property;
    }

    public static addQueryParamsProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.queryParamsProperty = property;
    }

    public static addMethodProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.methodProperty = property;
    }

    public static addBodyProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.bodyProperty = property;
    }

    public static addStageVariablesProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.stageVariablesProperty = property;
    }

    public static addPathParamsProperty(target, property) {
        let lambda = LambdaManager.instance.upsertLambdaModel(target);
        lambda.pathParamsProperty = property;
    }

    private static getHttpVerbMethods(lambda:LambdaModel):string[] {
        let methods = [];
        for(let verb of lambda.httpVerbs) {
            if (verb.name === ApiGateway.method) {
                methods.push(verb.methodName);
            }
        }
        return methods;
    }

    private static methodHasPath(lambda:LambdaModel, methodName:string):boolean {
        for(let path of lambda.paths) {
            if (path.methodName === methodName) {
                return true;
            }
        }
        return false;
    }

    public static setPathConfig(config:any) {
        ApiGateway.pathConfig = config;
    }

    public static executeHttpRequest(lambda:LambdaModel) {
        if (!lambda) { return; }
        let methods = ApiGateway.getHttpVerbMethods(lambda);
        for (let method of methods) {
            if (!ApiGateway.methodHasPath(lambda, method)) {
                lambda.instance[method]();
                return;
            }
        }
        ApiGateway.executeAnyRequest(lambda);
    }

    private static executeAnyRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.anyMethod) {
            lambda.instance[lambda.anyMethod]();
        }
    }

    private static getObjectValue(object:any, name:string) {
        let info = name.split('.');
        // Ugly hack I know.
        try {
            if (info.length == 1) { return object[name]; }
            if (info.length == 2) { return object[info[0]][info[1]]; }
            if (info.length == 3) { return object[info[0]][info[1]][info[2]]; }
            if (info.length == 4) { return object[info[0]][info[1]][info[2]][info[3]]; }
            if (info.length == 5) { return object[info[0]][info[1]][info[2]][info[3]][info[4]]; }
            if (info.length == 6) { return object[info[0]][info[1]][info[2]][info[3]][info[4]][info[5]]; }
        }
        catch (error) {
            return "";
        }
    }

    private static getAliasValue(event, alias:any) {
        if (typeof alias === 'string') {
            return this.getObjectValue(event, alias);
        }
        if (alias instanceof Array) {
            let value;
            for(let index in alias) {
                value = this.getObjectValue(event, alias[index]);
                if (value != undefined) {
                    return value;
                }
            }
        }
    }

    private static setQueryParams() {
        if (ApiGateway.queryParamsAlias) {
            ApiGateway.queryParams = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.queryParamsAlias);
        }
        if (!ApiGateway.queryParamsAlias) {
            ApiGateway.queryParams = ApiGateway.event.queryParams;
        }
        if (!ApiGateway.queryParamsAlias) {
            ApiGateway.queryParams = ApiGateway.event.queryStringParameters;
        }
        if (!ApiGateway.queryParamsAlias) {
            if (ApiGateway.event.params) {
                ApiGateway.pathParams = ApiGateway.event.params.querystring;
            }
        }
    }

    private static setPathParams() {
        if (ApiGateway.pathParamsAlias) {
            ApiGateway.pathParams = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.pathParamsAlias);
        }
        if (!ApiGateway.pathParams) {
            ApiGateway.pathParams = ApiGateway.event.pathParams;
        }
        if (!ApiGateway.pathParams) {
            ApiGateway.pathParams = ApiGateway.event.pathParameters;
        }
        if (!ApiGateway.pathParams) {
            if (ApiGateway.event.params) {
                ApiGateway.pathParams = ApiGateway.event.params.path;
            }
        }
    }

    private static setMethod() {
        if (ApiGateway.methodAlias) {
            ApiGateway.method = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.methodAlias);
        }
        if (!ApiGateway.method) {
            ApiGateway.method = ApiGateway.event.method;
        }
        if (!ApiGateway.method) {
            ApiGateway.method = ApiGateway.event.httpMethod;
        }
        if (!ApiGateway.method) {
            if (ApiGateway.event.context) {
                ApiGateway.method = ApiGateway.event.context['http-method'];
            }
        }

    }

    private static setHeaders() {
        if (ApiGateway.headersAlias) {
            ApiGateway.headers = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.headersAlias);
        }
        if (!ApiGateway.headers) {
            ApiGateway.headers = ApiGateway.event.headers;
        }
        if (!ApiGateway.headers) {
            if (ApiGateway.event.params) {
                ApiGateway.headers = ApiGateway.event.params.header;
            }
        }
    }

    private static setBody() {
        if (ApiGateway.bodyAlias) {
            ApiGateway.body = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.bodyAlias);
        }
        if (!ApiGateway.body) {
            ApiGateway.body = ApiGateway.event.body;
        }
        if (!ApiGateway.body) {
            ApiGateway.body = ApiGateway.event['body-json'];
        }
    }

    private static setStageVariables() {
        if (ApiGateway.stageVariablesAlias) {
            ApiGateway.stageVariables = ApiGateway.getAliasValue(ApiGateway.event, ApiGateway.stageVariablesAlias);
        }
        if (!ApiGateway.stageVariables) {
            ApiGateway.stageVariables = ApiGateway.event.stageVariables;
        }
        if (!ApiGateway.stageVariables) {
            ApiGateway.stageVariables = ApiGateway.event['stage-variables'];
        }
    }

    public static prepareHttpRequestVariables(event, context) {
        ApiGateway.event = event;
        ApiGateway.context = context;

        if (event) {
            ApiGateway.setQueryParams();
            ApiGateway.setPathParams();
            ApiGateway.setMethod();
            ApiGateway.setHeaders();
            ApiGateway.setBody();
            ApiGateway.setStageVariables();
        }
    }

    private static getHttpVerbsByMethodName(lambda:LambdaModel, methodName:string):string[] {
        let verbs:string[] = [];
        for(let verb of lambda.httpVerbs) {
            if (verb.methodName === methodName) {
                verbs.push(verb.name);
            }
        }
        return verbs;
    }

    private static verbExists(verbs:string[], verb:string):boolean {
        for(let currentVerb of verbs) {
            if (currentVerb === verb) {
                return true;
            }
        }
        return false;
    }

    private static getArgs(keys, pathToRegEx, lambda:LambdaModel, path:PathModel) {
        let args = [];
        let value;
        let i = 1;
        for (let key of pathToRegEx.keys) {
            value = keys[i++];
            lambda.pathParams.map(pathParam => {
                if (pathParam.methodName === path.methodName && key.name == pathParam.name) {
                    args[pathParam.index] = value;
                }
                return pathParam;
            });
        }
        return args;
    }

    private static getResourcePath() {
        let resourcePath;
        if (ApiGateway.pathConfig) {
            resourcePath = this.getObjectValue(ApiGateway.event, ApiGateway.pathConfig.resourcePathVariable);
        }
        if (!resourcePath) {
            resourcePath = this.getObjectValue(ApiGateway.event, 'context.resource-path');
        }
        if (!resourcePath) {
            resourcePath = this.getObjectValue(ApiGateway.event, 'path');
        }
        return resourcePath;
    }

    private static executePathLambdaMethod(pathToRegEx, lambda:LambdaModel, path:PathModel):boolean {
        let keys = pathToRegEx.exec(this.getResourcePath());
        let args = ApiGateway.getArgs(keys, pathToRegEx, lambda, path);
        let verbs = ApiGateway.getHttpVerbsByMethodName(lambda, path.methodName);
        if (verbs.length) {
            let verbExists = ApiGateway.verbExists(verbs, ApiGateway.method);
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
    }

    public static executePath(lambda:LambdaModel):boolean {
        let pattern;
        let pathToRegEx;
        let success;
        for(let path of lambda.paths) {
            pattern = lambda.basePath + path.pattern;
            pathToRegEx = PathToRegex(pattern);
            if (pathToRegEx.test(this.getResourcePath())) {
               success = ApiGateway.executePathLambdaMethod(pathToRegEx, lambda, path);
               if (success) { return true; }
            }
        }
        return false;
    }

    private static getHeaders(lambda:LambdaModel) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.headers) {
                return {}
            }
        }
        return ApiGateway.headers;
    }

    private static getQueryParams(lambda:LambdaModel) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.queryParams) {
                return {}
            }
        }
        return ApiGateway.queryParams;
    }

    private static getPathParams(lambda:LambdaModel) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!ApiGateway.pathParams) {
                return {}
            }
        }
        return ApiGateway.pathParams;
    }

    public static setLambdaProperties(lambda:LambdaModel) {
        if (!lambda) { return; }
        if (lambda.headersProperty) {
            lambda.instance[lambda.headersProperty] = ApiGateway.getHeaders(lambda);
        }
        if (lambda.queryParamsProperty) {
            lambda.instance[lambda.queryParamsProperty] = ApiGateway.getQueryParams(lambda);
        }
        if (lambda.pathParamsProperty) {
            lambda.instance[lambda.pathParamsProperty] = ApiGateway.getPathParams(lambda)
        }
        if (lambda.methodProperty) {
            lambda.instance[lambda.methodProperty] = ApiGateway.method;
        }
        if (lambda.bodyProperty) {
            lambda.instance[lambda.bodyProperty] = ApiGateway.body;
        }
        if (lambda.stageVariablesProperty) {
            lambda.instance[lambda.stageVariablesProperty] = ApiGateway.stageVariables;
        }
    }
}

export function Get() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_GET, target, methodName);
    }
}

export function Post() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_POST, target, methodName);
    }
}

export function Put() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_PUT, target, methodName);
    }
}

export function Patch() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_PATCH, target, methodName);
    }
}

export function Options() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_OPTIONS, target, methodName);
    }
}

export function Delete() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_DELETE, target, methodName);
    }
}

export function Head() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHttpVerbMethod(HttpModel.METHOD_HEAD, target, methodName);
    }
}

export function Any() {
    return function(target: Object, methodName: string) {
        ApiGateway.addAnyMethod(target, methodName);
    }
}

/**
 * "alias" will be the alternative name defined in Body Mapping Templates
 */

export function Headers(alias?:any) {
    ApiGateway.headersAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addHeadersProperty(target, propertyKey);
    }
}

export function QueryParams(alias?:any) {
    ApiGateway.queryParamsAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addQueryParamsProperty(target, propertyKey);
    }
}

export function PathParams(alias?:any) {
    ApiGateway.pathParamsAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addPathParamsProperty(target, propertyKey);
    }
}

export function Method(alias?:any) {
    ApiGateway.methodAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addMethodProperty(target, propertyKey);
    }
}

export function Body(alias?:any) {
    ApiGateway.bodyAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addBodyProperty(target, propertyKey);
    }
}

export function StageVariables(alias?:any) {
    ApiGateway.stageVariablesAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addStageVariablesProperty(target, propertyKey);
    }
}

export function Path(pattern:string) {
    return function(target: Object, propertyKey: string ) {
        /*
         * We're managing two types of signature using one decorator name
         * If target is an object, @Path is a method decorator, otherwise is a class decorator
         */
        if (typeof target === 'object') {
            ApiGateway.addPathMethod(pattern, target, propertyKey);
        }
        else {
            LambdaManager.instance.setLambdaPath(target, pattern);
        }
    }
}

export function PathConfig(config:any) {
    ApiGateway.setPathConfig(config);
    return function(target:any) {
    }
}
export function PathParam(name:string) {
    return function(target: Object, propertyKey: string, index:number ) {
        ApiGateway.addPathParam(name, target, propertyKey, index);
    }
}

