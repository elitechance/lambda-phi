/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */

import LambdaManager from "./lambda-manager";
import LambdaModel from "./lambda-model";

export class ApiGateway {

    private static queryParams;
    private static pathParams;
    private static method;
    private static headers;
    private static body;

    public static queryParamsAlias;
    public static pathParamsAlias;
    public static methodAlias;
    public static headersAlias;
    public static bodyAlias;

    public static addGetMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.getMethod = method;
    }

    public static addPostMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.postMethod = method;
    }

    public static addPutMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.putMethod = method;
    }

    public static addPatchMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.patchMethod = method;
    }

    public static addOptionsMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.optionsMethod = method;
    }

    public static addDeleteMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.deleteMethod = method;
    }

    public static addHeadMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.headMethod = method;
    }

    public static addHandlerMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.handlerMethod= method;
    }

    public static addPostConstructorMethod(target, method) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.postConstructorMethod = method;
    }

    public static addHeadersProperty(target, property) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.headersProperty = property;
    }

    public static addQueryParamsProperty(target, property) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.queryParamsProperty = property;
    }

    public static addMethodProperty(target, property) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.methodProperty = property;
    }

    public static addBodyProperty(target, property) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.bodyProperty = property;
    }

    public static addPathParamsProperty(target, property) {
        LambdaManager.instance.addLambda(target);
        let lambda = LambdaManager.instance.getLambda(target);
        lambda.pathParamsProperty = property;
    }

    public static executeHttpRequest(lambda:LambdaModel) {
        if (!lambda) { return; }
        switch (ApiGateway.method) {
            case 'GET': ApiGateway.executeGetRequest(lambda); break;
            case 'PUT': ApiGateway.executePutRequest(lambda); break;
            case 'POST': ApiGateway.executePostRequest(lambda); break;
            case 'PATCH': ApiGateway.executePatchRequest(lambda); break;
            case 'OPTIONS': ApiGateway.executeOptionsRequest(lambda); break;
            case 'HEAD': ApiGateway.executeHeadRequest(lambda); break;
            case 'DELETE': ApiGateway.executeDeleteRequest(lambda); break;
        }
    }

    private static executeGetRequest(lambda:LambdaModel){
        if (!lambda) {return;}
        if (lambda.getMethod) {
            lambda.instance[lambda.getMethod]();
        }
    }

    private static executePostRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.postMethod) {
            lambda.instance[lambda.postMethod]();
        }
    }

    private static executePutRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.putMethod) {
            lambda.instance[lambda.putMethod]();
        }
    }

    private static executeDeleteRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.deleteMethod) {
            lambda.instance[lambda.deleteMethod]();
        }
    }

    private static executeHeadRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.headMethod) {
            lambda.instance[lambda.headMethod]();
        }

    }

    private static executeOptionsRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.optionsMethod) {
            lambda.instance[lambda.optionsMethod]();
        }
    }

    private static executePatchRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.patchMethod) {
            lambda.instance[lambda.patchMethod]();
        }
    }

    public static prepareHttpRequestVariables(event) {
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
    }

    public static setLambdaProperties(lambda:LambdaModel) {
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
    }
}

export function Get() {
    return function(target: Object, methodName: string) {
        ApiGateway.addGetMethod(target, methodName);
    }
}

export function Post() {
    return function(target: Object, methodName: string) {
        ApiGateway.addPostMethod(target, methodName);
    }
}

export function Put() {
    return function(target: Object, methodName: string) {
        ApiGateway.addPutMethod(target, methodName);
    }
}

export function Patch() {
    return function(target: Object, methodName: string) {
        ApiGateway.addPatchMethod(target, methodName);
    }
}

export function Options() {
    return function(target: Object, methodName: string) {
        ApiGateway.addOptionsMethod(target, methodName);
    }
}

export function Delete() {
    return function(target: Object, methodName: string) {
        ApiGateway.addDeleteMethod(target, methodName);
    }
}

export function Head() {
    return function(target: Object, methodName: string) {
        ApiGateway.addHeadMethod(target, methodName);
    }
}

/**
 * "alias" will be the alternative name defined in Body Mapping Templates
 */

export function Headers(alias?:string) {
    ApiGateway.headersAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addHeadersProperty(target, propertyKey);
    }
}

export function QueryParams(alias?:string) {
    ApiGateway.queryParamsAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addQueryParamsProperty(target, propertyKey);
    }
}

export function PathParams(alias?:string) {
    ApiGateway.pathParamsAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addPathParamsProperty(target, propertyKey);
    }
}

export function Method(alias?:string) {
    ApiGateway.methodAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addMethodProperty(target, propertyKey);
    }
}

export function Body(alias?:string) {
    ApiGateway.bodyAlias = alias;
    return function(target: Object, propertyKey: string ) {
        ApiGateway.addBodyProperty(target, propertyKey);
    }
}

