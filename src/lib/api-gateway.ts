/**
 * Created by Ethan Dave B. Gomez on 2/23/17.
 */

import LambdaManager from "./lambda-manager";

export function Get() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addGetMethod(target, methodName);
    }
}

export function Post() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addPostMethod(target, methodName);
    }
}

export function Put() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addPutMethod(target, methodName);
    }
}

export function Patch() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addPatchMethod(target, methodName);
    }
}

export function Options() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addOptionsMethod(target, methodName);
    }
}

export function Delete() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addDeleteMethod(target, methodName);
    }
}

export function Head() {
    return function(target: Object, methodName: string) {
        LambdaManager.instance.addHeadMethod(target, methodName);
    }
}

