import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {ApiGateway, Any, Path} from "../src/lib/api-gateway";
import LambdaManager from "../src/lib/lambda-manager";
import {invoke} from "./helpers";

let calls:string[] = [];

// @Lambda above @Path: @Path runs first and registers the class, then @Lambda resets the base path.
@Lambda()
@Path('/ignored')
class ManagerLambda {
    @Callback() callback;

    public handler() { calls.push('handler'); }

    public postConstructor() { calls.push('postConstructor'); }

    @Path('/route')
    public route() { this.callback(null, 'route'); }

    @Any()
    public fallback() { this.callback(null, 'any'); }
}

ApiGateway.addHandlerMethod(ManagerLambda.prototype, 'handler');
ApiGateway.addPostConstructorMethod(ManagerLambda.prototype, 'postConstructor');

describe('LambdaManager', () => {
    it('exposes the shared instance', () => {
        assert.ok(LambdaManager.instance instanceof LambdaManager);
        assert.equal(LambdaManager.instance.getLambdaByName('ManagerLambda').name, 'ManagerLambda');
        assert.strictEqual(LambdaManager.instance.getLambdaByName('Unknown'), null);
    });

    it('runs handler and post constructor methods registered programmatically', () => {
        calls = [];
        invoke({httpMethod: 'GET'});
        assert.deepEqual(calls, ['postConstructor', 'handler']);
    });

    it('registers a class even when @Path is applied before @Lambda', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/route'}).message, 'route');
        assert.equal(invoke({httpMethod: 'GET', path: '/ignored/route'}).message, 'any');
    });

    it('stores a raw handler', () => {
        let handler = () => {};
        LambdaManager.instance.rawHandler = handler;
        assert.strictEqual(LambdaManager.instance.rawHandler, handler);
    });

    it('replaces the handler method through addHandlerMethod', () => {
        calls = [];
        LambdaManager.instance.addHandlerMethod(ManagerLambda.prototype, 'postConstructor');
        invoke({httpMethod: 'GET'});
        assert.deepEqual(calls, ['postConstructor', 'postConstructor']);
    });
});
