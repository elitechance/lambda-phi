"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lambda_model_1 = require("./lambda-model");
var LambdaManager = (function () {
    function LambdaManager() {
        this._lambdaModels = [];
        this._lambdas = [];
    }
    LambdaManager.prototype.upsertLambdaModel = function (target) {
        var lambdaModel = this.getLambdaByName(target.constructor.name);
        if (lambdaModel == null) {
            var instance = new target.constructor();
            lambdaModel = new lambda_model_1.default();
            lambdaModel.name = instance.constructor.name;
            lambdaModel.instance = instance;
            this._lambdaModels.push(lambdaModel);
        }
        return lambdaModel;
    };
    LambdaManager.prototype.setLambda = function (target, lambdaConfig) {
        target.__path = '';
        target.__lambdaConfig = lambdaConfig;
        if (this._lambdas.indexOf(target) === -1) {
            this._lambdas.push(target);
        }
    };
    LambdaManager.prototype.setLambdaPath = function (target, path) {
        target.__path = path;
        if (this._lambdas.indexOf(target) == -1) {
            this._lambdas.push(target);
        }
    };
    LambdaManager.prototype.getEvent = function (lambda) {
        if (lambda.config && !lambda.config.allowNullInjection) {
            if (!this.event) {
                return {};
            }
        }
        return this.event;
    };
    LambdaManager.prototype.getEventContext = function () {
        if (this.event.context) {
            return this.event.context;
        }
        if (this.event.requestContext) {
            return this.event.requestContext;
        }
        return null;
    };
    LambdaManager.prototype.setLambdaProperties = function (lambda) {
        if (lambda) {
            if (lambda.callbackProperty) {
                lambda.instance[lambda.callbackProperty] = this.callback;
            }
            if (lambda.eventProperty) {
                lambda.instance[lambda.eventProperty] = this.getEvent(lambda);
            }
            if (lambda.eventContextProperty) {
                lambda.instance[lambda.eventContextProperty] = this.getEventContext();
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
    LambdaManager.prototype.setPreLambdaTimeoutMethod = function (lambda) {
        if (!lambda) {
            return;
        }
        if (!lambda.preLambdaTimeoutMethod) {
            return;
        }
        var remainingTime = this.context.getRemainingTimeInMillis();
        var catchTime = remainingTime - lambda.preLambdaTimeoutTime;
        if (catchTime < 0) {
            return;
        }
        setTimeout(function () {
            lambda.instance[lambda.preLambdaTimeoutMethod]();
        }, remainingTime - lambda.preLambdaTimeoutTime);
    };
    LambdaManager.prototype.processLambdas = function () {
        var length = this._lambdas.length;
        var hasPath;
        var target;
        var lambda;
        for (var i = 0; i < length; i++) {
            target = this._lambdas[i];
            lambda = this.getLambdaByName(target.name);
            lambda.basePath = target.__path;
            lambda.config = target.__lambdaConfig;
            this.setLambdaProperties(lambda);
            this.apiGateway.setLambdaProperties(lambda);
            this.executePostConstructor(lambda);
            this.executeHandler(lambda);
            this.setPreLambdaTimeoutMethod(lambda);
            hasPath = this.apiGateway.executePath(lambda);
            if (!hasPath) {
                this.apiGateway.executeHttpRequest(lambda);
            }
        }
    };
    LambdaManager.prototype.getLambdaByName = function (name) {
        var length = this._lambdaModels.length;
        for (var i = 0; i < length; i++) {
            if (this._lambdaModels[i].name == name) {
                return this._lambdaModels[i];
            }
        }
        return null;
    };
    LambdaManager.prototype.addHandlerMethod = function (target, method) {
        var lambda = this.upsertLambdaModel(target);
        lambda.handlerMethod = method;
    };
    LambdaManager.prototype.addPostConstructorMethod = function (target, method) {
        var lambda = this.upsertLambdaModel(target);
        lambda.postConstructorMethod = method;
    };
    LambdaManager.prototype.addPreLambdaTimeoutMethod = function (target, method, miliSecondsBeforeTimeout) {
        var lambda = this.upsertLambdaModel(target);
        lambda.preLambdaTimeoutMethod = method;
        lambda.preLambdaTimeoutTime = miliSecondsBeforeTimeout;
    };
    LambdaManager.prototype.addPreLambdaCallbackMethod = function (target, method) {
        var lambda = this.upsertLambdaModel(target);
        lambda.preLambdaCallbackMethod = method;
    };
    LambdaManager.prototype.addCallbackProperty = function (target, property) {
        var lambda = this.upsertLambdaModel(target);
        lambda.callbackProperty = property;
    };
    LambdaManager.prototype.addEventProperty = function (target, property) {
        var lambda = this.upsertLambdaModel(target);
        lambda.eventProperty = property;
    };
    LambdaManager.prototype.addEventContextProperty = function (target, property) {
        var lambda = this.upsertLambdaModel(target);
        lambda.eventContextProperty = property;
    };
    LambdaManager.prototype.addContextProperty = function (target, property) {
        var lambda = this.upsertLambdaModel(target);
        lambda.contextProperty = property;
    };
    LambdaManager.prototype.executePreLambdaCallback = function (lambda) {
        if (lambda.preLambdaCallbackMethod) {
            lambda.instance[lambda.preLambdaCallbackMethod]();
        }
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
        set: function (callbackFunction) {
            var _this = this;
            var callbackWrapper = function (error, message) {
                for (var _i = 0, _a = _this._lambdaModels; _i < _a.length; _i++) {
                    var lambda = _a[_i];
                    _this.executePreLambdaCallback(lambda);
                }
                callbackFunction(error, message);
            };
            this._callback = callbackWrapper;
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
    Object.defineProperty(LambdaManager.prototype, "apiGateway", {
        get: function () {
            return this._apiGateway;
        },
        set: function (value) {
            this._apiGateway = value;
        },
        enumerable: true,
        configurable: true
    });
    return LambdaManager;
}());
exports.default = LambdaManager;
