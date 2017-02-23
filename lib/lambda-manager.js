"use strict";
var lambda_model_1 = require('./lambda-model');
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
    LambdaManager.prototype.executeHandler = function (lambda) {
        if (lambda) {
            if (lambda.handlerMethod) {
                lambda.instance[lambda.handlerMethod]();
            }
        }
    };
    LambdaManager.prototype.executeHttpRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        switch (this.method) {
            case 'GET':
                this.executeGetRequest(lambda);
                break;
            case 'PUT':
                this.executePutRequest(lambda);
                break;
            case 'POST':
                this.executePostRequest(lambda);
                break;
            case 'PATCH':
                this.patchRequest(lambda);
                break;
            case 'OPTIONS':
                this.optionsRequest(lambda);
                break;
            case 'HEAD':
                this.headRequest(lambda);
                break;
            case 'DELETE':
                this.deleteRequest(lambda);
                break;
        }
    };
    LambdaManager.prototype.prepareHttpRequestVariables = function () {
        if (this.event) {
            this.queryParams = this.event.queryParams;
            this.pathParams = this.event.pathParams;
            this.method = this.event.method;
            this.headers = this.event.headers;
        }
    };
    LambdaManager.prototype.processLambdas = function () {
        var length = this._targets.length;
        var instance;
        for (var i = 0; i < length; i++) {
            instance = new this._targets[i]();
            var lambda = this.getLambda(instance);
            this.setLambdaProperties(lambda);
            this.executeHandler(lambda);
            this.executeHttpRequest(lambda);
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
    LambdaManager.prototype.addGetMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.getMethod = method;
    };
    LambdaManager.prototype.addPostMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.postMethod = method;
    };
    LambdaManager.prototype.addPutMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.putMethod = method;
    };
    LambdaManager.prototype.addPatchMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.patchMethod = method;
    };
    LambdaManager.prototype.addOptionsMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.optionsMethod = method;
    };
    LambdaManager.prototype.addDeleteMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.deleteMethod = method;
    };
    LambdaManager.prototype.addHeadMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.headMethod = method;
    };
    LambdaManager.prototype.addHandlerMethod = function (target, method) {
        this.addLambda(target);
        var lambda = this.getLambda(target);
        lambda.handlerMethod = method;
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
    LambdaManager.prototype.executeGetRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.getMethod) {
            lambda.instance[lambda.getMethod]();
        }
    };
    LambdaManager.prototype.executePostRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.postMethod) {
            lambda.instance[lambda.postMethod]();
        }
    };
    LambdaManager.prototype.executePutRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.putMethod) {
            lambda.instance[lambda.putMethod]();
        }
    };
    LambdaManager.prototype.deleteRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.deleteMethod) {
            lambda.instance[lambda.deleteMethod]();
        }
    };
    LambdaManager.prototype.headRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.headMethod) {
            lambda.instance[lambda.headMethod]();
        }
    };
    LambdaManager.prototype.optionsRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.optionsMethod) {
            lambda.instance[lambda.optionsMethod]();
        }
    };
    LambdaManager.prototype.patchRequest = function (lambda) {
        if (!lambda) {
            return;
        }
        if (lambda.patchMethod) {
            lambda.instance[lambda.patchMethod]();
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
    Object.defineProperty(LambdaManager.prototype, "exports", {
        get: function () {
            return this._exports;
        },
        set: function (value) {
            this._exports = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "queryParams", {
        get: function () {
            return this._queryParams;
        },
        set: function (value) {
            this._queryParams = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "pathParams", {
        get: function () {
            return this._pathParams;
        },
        set: function (value) {
            this._pathParams = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "method", {
        get: function () {
            return this._method;
        },
        set: function (value) {
            this._method = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaManager.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        set: function (value) {
            this._headers = value;
        },
        enumerable: true,
        configurable: true
    });
    return LambdaManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LambdaManager;
