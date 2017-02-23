/**
 * Created by Ethan Dave B. Gomez on 2/22/17.
 */
"use strict";
var lambda_manager_1 = require('./lib/lambda-manager');
var lambdaManager = new lambda_manager_1.default();
lambda_manager_1.default.instance = lambdaManager;
function LambdaHandler(event, context, callback) {
    lambdaManager.event = event;
    lambdaManager.prepareHttpRequestVariables();
    lambdaManager.context = context;
    lambdaManager.callback = callback;
    lambdaManager.processLambdas();
}
exports.LambdaHandler = LambdaHandler;
function Lambda() {
    return function (target) {
        lambdaManager.setTarget(target);
    };
}
exports.Lambda = Lambda;
function Context() {
    return function (target, propertyKey) {
        lambdaManager.addContextProperty(target, propertyKey);
    };
}
exports.Context = Context;
function Handler() {
    return function (target, methodName) {
        lambdaManager.addHandlerMethod(target, methodName);
    };
}
exports.Handler = Handler;
function Callback() {
    return function (target, propertyKey) {
        lambdaManager.addCallbackProperty(target, propertyKey);
    };
}
exports.Callback = Callback;
function Event() {
    return function (target, propertyKey) {
        lambdaManager.addEventProperty(target, propertyKey);
    };
}
exports.Event = Event;
