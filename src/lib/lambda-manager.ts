import LambdaModel from './lambda-model';
import {ApiGateway} from "./api-gateway";

export default class LambdaManager {
    public static instance:LambdaManager;
    private _rawHandler;
    private _event;
    private _context;
    private _callback;

    private _lambdas:LambdaModel[] = [];
    private _targets:Object[] = [];

    public addLambda(target) {
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
        let length = this._targets.length;
        let instance;
        for (let i = 0; i < length;i++) {
            instance = new this._targets[i]();
            let lambda = this.getLambda(instance);
            this.setLambdaProperties(lambda);
            ApiGateway.setLambdaProperties(lambda);
            this.executePostConstructor(lambda);
            this.executeHandler(lambda);
            this.setPreLambdaTimeoutMethod(lambda);
            ApiGateway.executeHttpRequest(lambda);
        }
    }

    public getLambda(target):LambdaModel {
        let length = this._lambdas.length;
        for (let i = 0; i < length;i++) {
            if (this._lambdas[i].name == target.constructor.name) {
                return this._lambdas[i];
            }
        }
        return null;
    }

    public addHandlerMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.handlerMethod = method;
    }

    public addPostConstructorMethod(target, method) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.postConstructorMethod = method;
    }

    public addPreLambdaTimeoutMethod(target, method:string, miliSecondsBeforeTimeout:number) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.preLambdaTimeoutMethod = method;
        lambda.preLambdaTimeoutTime = miliSecondsBeforeTimeout;
    }

    public addPreLambdaCallbackMethod(target, method:string) {
        this.addLambda(target);
        let lambda = this.getLambda(target);
        lambda.preLambdaCallbackMethod = method;
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
            for(let lambda of this._lambdas) {
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
