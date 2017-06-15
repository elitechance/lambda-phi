import LambdaModel from './lambda-model';
import {ApiGateway} from "./api-gateway";
import { LambdaConfig } from "./lambda-config";

export default class LambdaManager {
    public static instance:LambdaManager;
    private _rawHandler;
    private _event;
    private _context;
    private _callback;

    private _lambdaModels:LambdaModel[] = [];
    private _lambdas:Object[] = [];

    public upsertLambdaModel(target):LambdaModel {
        let lambdaModel = this.getLambdaByName(target.constructor.name);
        if (lambdaModel == null) {
            let instance = new target.constructor();
            lambdaModel = new LambdaModel();
            lambdaModel.name = instance.constructor.name;
            lambdaModel.instance = instance;
            this._lambdaModels.push(lambdaModel);
        }
        return lambdaModel;
    }

    public setLambda(target, lambdaConfig:LambdaConfig) {
        target.__path = '';
        target.__lambdaConfig = lambdaConfig;
        if (this._lambdas.indexOf(target) === -1) {
            this._lambdas.push(target);
        }
    }

    public setLambdaPath(target, path) {
        target.__path = path;
        if (this._lambdas.indexOf(target) == -1) {
            this._lambdas.push(target);
        }
    }

    private getEvent(lambda:LambdaModel) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!this.event) {
                return {};
            }
        }
        return this.event;
    }

    private getEventContext() {
        if (this.event.context) { return this.event.context; }
        if (this.event.requestContext) { return this.event.requestContext; }
        return null;
    }

    private setLambdaProperties(lambda:LambdaModel) {
        if (lambda) {
            if (lambda.callbackProperty) { lambda.instance[lambda.callbackProperty] = this.callback; }
            if (lambda.eventProperty) { lambda.instance[lambda.eventProperty] = this.getEvent(lambda); }
            if (lambda.eventContextProperty) { lambda.instance[lambda.eventContextProperty] = this.getEventContext(); }
            if (lambda.contextProperty) { lambda.instance[lambda.contextProperty] = this.context; }
        }
    }

    private executePostConstructor(lambda:LambdaModel) {
        if (lambda) {
            if (lambda.postConstructorMethod) { lambda.instance[lambda.postConstructorMethod](); }
        }
    }

    private executeHandler(lambda:LambdaModel) {
        if (lambda) {
            if (lambda.handlerMethod) { lambda.instance[lambda.handlerMethod](); }
        }
    }

    private setPreLambdaTimeoutMethod(lambda:LambdaModel) {
        if (!lambda) { return; }
        if (!lambda.preLambdaTimeoutMethod) { return; }
        let remainingTime = this.context.getRemainingTimeInMillis();
        let catchTime = remainingTime - lambda.preLambdaTimeoutTime;
        if (catchTime < 0) { return; }
        setTimeout(() => {
            lambda.instance[lambda.preLambdaTimeoutMethod]();
        }, remainingTime - lambda.preLambdaTimeoutTime);
    }

    public processLambdas() {
        let length = this._lambdas.length;
        let hasPath:boolean;
        let target;
        let lambda;

        for (let i = 0; i < length;i++) {
            target = this._lambdas[i];
            lambda = this.getLambdaByName(target.name);
            lambda.basePath = target.__path;
            lambda.config = target.__lambdaConfig;
            this.setLambdaProperties(lambda);
            ApiGateway.setLambdaProperties(lambda);
            this.executePostConstructor(lambda);
            this.executeHandler(lambda);
            this.setPreLambdaTimeoutMethod(lambda);
            hasPath = ApiGateway.executePath(lambda);
            if (!hasPath) {
                ApiGateway.executeHttpRequest(lambda);
            }
        }
    }

    public getLambdaByName(name:string):LambdaModel {
        let length = this._lambdaModels.length;
        for (let i = 0; i < length;i++) {
            if (this._lambdaModels[i].name == name) {
                return this._lambdaModels[i];
            }
        }
        return null;
    }

    public addHandlerMethod(target, method) {
        let lambda = this.upsertLambdaModel(target);
        lambda.handlerMethod = method;
    }

    public addPostConstructorMethod(target, method) {
        let lambda = this.upsertLambdaModel(target);
        lambda.postConstructorMethod = method;
    }

    public addPreLambdaTimeoutMethod(target, method:string, miliSecondsBeforeTimeout:number) {
        let lambda = this.upsertLambdaModel(target);
        lambda.preLambdaTimeoutMethod = method;
        lambda.preLambdaTimeoutTime = miliSecondsBeforeTimeout;
    }

    public addPreLambdaCallbackMethod(target, method:string) {
        let lambda = this.upsertLambdaModel(target);
        lambda.preLambdaCallbackMethod = method;
    }

    public addCallbackProperty(target, property) {
        let lambda = this.upsertLambdaModel(target);
        lambda.callbackProperty = property;
    }

    public addEventProperty(target, property) {
        let lambda = this.upsertLambdaModel(target);
        lambda.eventProperty = property;
    }

    public addEventContextProperty(target, property) {
        let lambda = this.upsertLambdaModel(target);
        lambda.eventContextProperty = property;
    }

    public addContextProperty(target, property) {
        let lambda = this.upsertLambdaModel(target);
        lambda.contextProperty = property;
    }

    private executePreLambdaCallback(lambda:LambdaModel) {
        if (lambda.preLambdaCallbackMethod) {
            lambda.instance[lambda.preLambdaCallbackMethod]();
        }
    }

    set event(value) {
        this._event = value;
    }

    set context(value) {
        this._context = value;
    }

    set callback(callbackFunction) {
        let callbackWrapper = (error:any, message:any) => {
            for(let lambda of this._lambdaModels) {
                this.executePreLambdaCallback(lambda);
            }
            callbackFunction(error, message);
        };
        this._callback = callbackWrapper;
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

    set rawHandler(value) {
        this._rawHandler = value;
    }

}
