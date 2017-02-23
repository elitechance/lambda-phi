"use strict";
var lambda_model_1 = require('./lambda-model');
var api_gateway_1 = require("./api-gateway");
var LambdaManager = (function () {
    function LambdaManager() {
        this._lambdas = [];
        this._targets = [];
    }
    LambdaManager.prototype.addLambda = function (target) {
        var lambdaModel = this.getLambda(target);
        if (lambdaModel == null) {
            var instance = new target.constructor();
            lambdaModel = new lambda_model_1.default();
            lambdaModel.name = instance.constructor.name;
            lambdaModel.instance = instance;
            this._lambdas.push(lambdaModel);
        }
    };
    LambdaManager.prototype.setTarget = function (target) {
        this._targets.push(target);
    };
    LambdaManager.prototype.setLambdaProperties = function (lambda) {
        if (lambda) {
            if (lambda.callbackProperty) {
                lambda.instance[lambda.callbackProperty] = this.callback;
            }
            if (lambda.eventProperty) {
                lambda.instance[lambda.eventProperty] = this.event;
            }
            if (lambda.contextProperty) {
                lambda.instance[lambda.contextProperty] = this.context;
            }
        }
    };
    LambdaManager.prototype.executePostConstructor = function (lambda) {
        if (lambda) {
            if (lambda.postConstructorMethod) {
                lambda.instance[lambda.postConstructorMethod]();
            }
        }
    };
    LambdaManager.prototype.executeHandler = function (lambda) {
        if (lambda) {
            if (lambda.handlerMethod) {
                lambda.instance[lambda.handlerMethod]();
            }
        }
    };
    LambdaManager.prototype.processLambdas = function () {
        var length = this._targets.length;
        var instance;
        for (var i = 0; i < length; i++) {
            instance = new this._targets[i]();
            var lambda = this.getLambda(instance);
            this.setLambdaProperties(lambda);
            api_gateway_1.ApiGateway.setLambdaProperties(lambda);
            this.executePostConstructor(lambda);
            this.executeHandler(lambda);
            api_gateway_1.ApiGateway.executeHttpRequest(lambda);
        }
    };
    LambdaManager.prototype.getLambda = function (target) {
        var length = this._lambdas.length;
        for (var i = 0; i < length; i++) {
            if (this._lambdas[i].name == target.constructor.name) {
                return this._lambdas[i];
            }
        }
        return null;
    };
    LambdaManager.prototype.addHandlerMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.handlerMethod = method;
    };
    LambdaManager.prototype.addPostConstructorMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.postConstructorMethod = method;
    };
    LambdaManager.prototype.addCallbackProperty = function (target, property) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.callbackProperty = property;
    };
    LambdaManager.prototype.addEventProperty = function (target, property) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.eventProperty = property;
    };
    LambdaManager.prototype.addContextProperty = function (target, property) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.contextProperty = property;
    };
    Object.defineProperty(LambdaManager.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (value) {
            this._event = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (value) {
            this._context = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        set: function (value) {
            this._callback = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "rawHandler", {
        get: function () {
            return this._rawHandler;
        },
        set: function (value) {
            this._rawHandler = value;
        },
        enumerable: true,
        configurable: true
    });
    return LambdaManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LambdaManager;
