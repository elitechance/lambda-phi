import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback, Context, PostConstructor, PreLambdaCallback, PreLambdaTimeout} from "../src/lambda-phi";
import {Any} from "../src/lib/api-gateway";
import {invoke, fakeContext} from "./helpers";

let calls:string[] = [];
let onTimeout:() => void = () => {};

@Lambda()
class LifecycleLambda {
    @Callback() callback;
    @Context() context;

    @PostConstructor()
    public postConstructor() { calls.push('postConstructor'); }

    @PreLambdaCallback()
    public beforeCallback() { calls.push('preLambdaCallback'); }

    @PreLambdaTimeout(40)
    public beforeTimeout() {
        calls.push('preLambdaTimeout');
        onTimeout();
    }

    @Any()
    public handle() {
        calls.push('handler');
        this.callback(null, calls.slice());
    }
}

describe('Lifecycle hooks', () => {
    it('runs post constructor, handler, then pre-callback before the real callback', () => {
        calls = [];
        // Remaining time below the pre-timeout threshold, so no timer is left running.
        let result = invoke({httpMethod: 'GET'}, fakeContext(10));
        assert.deepEqual(result.message, ['postConstructor', 'handler']);
        assert.deepEqual(calls, ['postConstructor', 'handler', 'preLambdaCallback']);
    });

    it('calls the pre-timeout method before the lambda times out', () => {
        calls = [];
        return new Promise<void>((resolve) => {
            onTimeout = resolve;
            invoke({httpMethod: 'GET'}, fakeContext(60));
        }).then(() => {
            assert.equal(calls[calls.length - 1], 'preLambdaTimeout');
        });
    });

    it('skips the pre-timeout method when remaining time is already too short', () => {
        calls = [];
        invoke({httpMethod: 'GET'}, fakeContext(10));
        return new Promise<void>((resolve) => setTimeout(resolve, 50)).then(() => {
            assert.equal(calls.indexOf('preLambdaTimeout'), -1);
        });
    });
});
