/**
 * Created by Ethan Dave B. Gomez on 2/22/17.
 */

import LambdaManager from './lib/lambda-manager';
import {ApiGateway} from "./lib/api-gateway";

let lambdaManager = new LambdaManager();
LambdaManager.instance = lambdaManager;

export function LambdaHandler(event, context, callback) {
    lambdaManager.event = event;
    ApiGateway.prepareHttpRequestVariables(event);

    lambdaManager.context = context;
    lambdaManager.callback = callback;
    lambdaManager.processLambdas();
}

export function Lambda() {
    return function(target:any) {
        lambdaManager.setTarget(target);
    }
}

export function PostConstructor() {
    return function(target: Object, methodName: string) {
        lambdaManager.addPostConstructorMethod(target, methodName);
    }
}

export function Context() {
    return function(target: Object, propertyKey: string ) {
        lambdaManager.addContextProperty(target, propertyKey);
    }
}

export function Callback() {
    return function(target: Object, propertyKey: string ) {
        lambdaManager.addCallbackProperty(target, propertyKey);
    }
}

export function Event() {
    return function(target: Object, propertyKey: string ) {
        lambdaManager.addEventProperty(target, propertyKey);
    }
}
