import LambdaModel from './lambda-model';

export default class LambdaManager {
    public static instance:LambdaManager;
    private _rawHandler;
    private _event;
    private _context;
    private _callback;
    private _exports;

    private _queryParams;
    private _pathParams;
    private _method;
    private _headers;

    private _lambdas:LambdaModel[] = [];
    private _targets:Object[] = [];

    private addLambda(target) {
        let lambdaModel = this.getLambda(target);
        if (lambdaModel == null) {
            let instance = new target.constructor();
            lambdaModel = new LambdaModel();
            lambdaModel.name = instance.constructor.name;
            lambdaModel.instance = instance;
            this._lambdas.push(lambdaModel);
        }
    }

    public setTarget(target) {
        this._targets.push(target);
    }

    private setLambdaProperties(lambda:LambdaModel) {
        if (lambda) {
            if (lambda.callbackProperty) { lambda.instance[lambda.callbackProperty] = this.callback; }
            if (lambda.eventProperty) { lambda.instance[lambda.eventProperty] = this.event; }
            if (lambda.contextProperty) { lambda.instance[lambda.contextProperty] = this.context; }
        }
    }

    private executeHandler(lambda:LambdaModel) {
        if (lambda) {
            if (lambda.handlerMethod) { lambda.instance[lambda.handlerMethod](); }
        }
    }

    private executeHttpRequest(lambda:LambdaModel) {
        if (!lambda) { return; }
        switch (this.method) {
            case 'GET': this.executeGetRequest(lambda); break;
            case 'PUT': this.executePutRequest(lambda); break;
            case 'POST': this.executePostRequest(lambda); break;
            case 'PATCH': this.patchRequest(lambda); break;
            case 'OPTIONS': this.optionsRequest(lambda); break;
            case 'HEAD': this.headRequest(lambda); break;
            case 'DELETE': this.deleteRequest(lambda); break;
        }
    }

    public prepareHttpRequestVariables() {
        if (this.event) {
            this.queryParams = this.event.queryParams;
            this.pathParams = this.event.pathParams;
            this.method = this.event.method;
            this.headers = this.event.headers;
        }
    }

    public processLambdas() {
        let length = this._targets.length;
        let instance;
        for (let i = 0; i < length;i++) {
            instance = new this._targets[i]();
            let lambda = this.getLambda(instance);
            this.setLambdaProperties(lambda);
            this.executeHandler(lambda);
            this.executeHttpRequest(lambda);
        }
    }

    public getLambda(target) {
        let length = this._lambdas.length;
        for (let i = 0; i < length;i++) {
            if (this._lambdas[i].name == target.constructor.name) {
                return this._lambdas[i];
            }
        }
        return null;
    }

    public addGetMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.getMethod = method;
    }

    public addPostMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.postMethod = method;
    }

    public addPutMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.putMethod = method;
    }

    public addPatchMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.patchMethod = method;
    }

    public addOptionsMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.optionsMethod = method;
    }

    public addDeleteMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.deleteMethod = method;
    }

    public addHeadMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.headMethod = method;
    }

    public addHandlerMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.handlerMethod= method;
    }

    public addCallbackProperty(target, property) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.callbackProperty = property;
    }

    public addEventProperty(target, property) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.eventProperty = property;
    }

    public addContextProperty(target, property) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.contextProperty = property;
    }

    private executeGetRequest(lambda:LambdaModel){
        if (!lambda) {return;}
        if (lambda.getMethod) {
            lambda.instance[lambda.getMethod]();
        }
    }

    private executePostRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.postMethod) {
            lambda.instance[lambda.postMethod]();
        }
    }

    private executePutRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.putMethod) {
            lambda.instance[lambda.putMethod]();
        }
    }

    private deleteRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.deleteMethod) {
            lambda.instance[lambda.deleteMethod]();
        }
    }

    private headRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.headMethod) {
            lambda.instance[lambda.headMethod]();
        }

    }

    private optionsRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.optionsMethod) {
            lambda.instance[lambda.optionsMethod]();
        }
    }

    private patchRequest(lambda:LambdaModel) {
        if (!lambda) {return;}
        if (lambda.patchMethod) {
            lambda.instance[lambda.patchMethod]();
        }
    }

    set event(value) {
        this._event = value;
    }

    set context(value) {
        this._context = value;
    }

    set callback(value) {
        this._callback = value;
    }

    get callback() {
        return this._callback;
    }

    get rawHandler() {
        return this._rawHandler;
    }

    get event() {
        return this._event;
    }

    get context() {
        return this._context;
    }

    get exports() {
        return this._exports;
    }

    set exports(value) {
        this._exports = value;
    }

    set rawHandler(value) {
        this._rawHandler = value;
    }

    get queryParams() {
        return this._queryParams;
    }

    set queryParams(value) {
        this._queryParams = value;
    }

    get pathParams() {
        return this._pathParams;
    }

    set pathParams(value) {
        this._pathParams = value;
    }

    get method() {
        return this._method;
    }

    set method(value) {
        this._method = value;
    }

    get headers() {
        return this._headers;
    }

    set headers(value) {
        this._headers = value;
    }

}
