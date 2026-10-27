import assert = require('node:assert');
import {describe, it} from 'node:test';
import {LambdaAsyncHandler, Lambda, Callback, PreLambdaCallback} from "../src/lambda-phi";
import {Get, Post, Delete} from "../src/lib/api-gateway";
import {fakeContext} from "./helpers";

let calls:string[] = [];

@Lambda()
class AsyncLambda {
    @Callback() callback;

    @PreLambdaCallback()
    public beforeCallback() { calls.push('preLambdaCallback'); }

    @Get()
    public getRequest() { this.callback(null, 'get'); }

    @Post()
    public postRequest() {
        setTimeout(() => this.callback(new Error('failed')), 1);
    }

    @Delete()
    public deleteRequest() { throw new Error('thrown'); }
}

describe('LambdaAsyncHandler', () => {
    it('takes two parameters, so the Node.js 24+ runtime accepts it', () => {
        assert.equal(LambdaAsyncHandler.length, 2);
    });

    it('resolves with the callback message', async () => {
        calls = [];
        let result = await LambdaAsyncHandler({httpMethod: 'GET'}, fakeContext(10));
        assert.equal(result, 'get');
        assert.deepEqual(calls, ['preLambdaCallback']);
    });

    it('rejects with the callback error', async () => {
        await assert.rejects(LambdaAsyncHandler({httpMethod: 'POST'}, fakeContext(10)), /failed/);
    });

    it('rejects when a handler method throws', async () => {
        await assert.rejects(LambdaAsyncHandler({httpMethod: 'DELETE'}, fakeContext(10)), /thrown/);
    });
});
