import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Get, Post, Put, Patch, Delete, Options, Head, Any} from "../src/lib/api-gateway";
import {invoke, proxyEvent, httpApiRequest} from "./helpers";

@Lambda()
class HttpVerbsLambda {
    @Callback() callback;

    @Get()
    public getRequest() { this.callback(null, 'get'); }

    @Put()
    @Post()
    public putAndPostRequest() { this.callback(null, 'put-or-post'); }

    @Patch()
    public patchRequest() { this.callback(null, 'patch'); }

    @Delete()
    public deleteRequest() { this.callback(null, 'delete'); }

    @Options()
    public optionsRequest() { this.callback(null, 'options'); }

    @Head()
    public headRequest() { this.callback(null, 'head'); }

    @Any()
    public anyRequest() { this.callback(null, 'any'); }
}

describe('HTTP verb mapping', () => {
    it('routes each verb to its decorated method', () => {
        assert.equal(invoke(proxyEvent({httpMethod: 'GET'})).message, 'get');
        assert.equal(invoke(proxyEvent({httpMethod: 'PATCH'})).message, 'patch');
        assert.equal(invoke(proxyEvent({httpMethod: 'DELETE'})).message, 'delete');
        assert.equal(invoke(proxyEvent({httpMethod: 'OPTIONS'})).message, 'options');
        assert.equal(invoke(proxyEvent({httpMethod: 'HEAD'})).message, 'head');
    });

    it('supports multiple verbs on one method', () => {
        assert.equal(invoke(proxyEvent({httpMethod: 'PUT'})).message, 'put-or-post');
        assert.equal(invoke(proxyEvent({httpMethod: 'POST'})).message, 'put-or-post');
    });

    it('falls back to @Any() for verbs without a mapping', () => {
        assert.equal(invoke(proxyEvent({httpMethod: 'TRACE'})).message, 'any');
    });

    it('reads the method from a passthrough template event', () => {
        let result = invoke({context: {'http-method': 'DELETE'}});
        assert.equal(result.message, 'delete');
    });

    it('reads the method from an HTTP API payload 2.0 event', () => {
        assert.equal(invoke(httpApiRequest('PATCH', '/')).message, 'patch');
        assert.equal(invoke(httpApiRequest('PUT', '/')).message, 'put-or-post');
    });

    it('reads the method from event.method', () => {
        assert.equal(invoke({method: 'PATCH'}).message, 'patch');
    });
});
