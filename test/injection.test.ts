import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback, Context, Event, EventContext} from "../src/lambda-phi";
import {Any, Headers, QueryParams, PathParams, Method, Body, StageVariables} from "../src/lib/api-gateway";
import {invoke, proxyEvent, passthroughEvent, httpApiRequest, fakeContext} from "./helpers";

let captured:any;

@Lambda()
class InjectionLambda {
    @Callback() callback;
    @Context() context;
    @Event() event;
    @EventContext() eventContext;
    @Headers() headers;
    @QueryParams() queryParams;
    @PathParams() pathParams;
    @Method() method;
    @Body() body;
    @StageVariables() stageVariables;

    @Any()
    public handle() {
        captured = {
            context: this.context,
            event: this.event,
            eventContext: this.eventContext,
            headers: this.headers,
            queryParams: this.queryParams,
            pathParams: this.pathParams,
            method: this.method,
            body: this.body,
            stageVariables: this.stageVariables
        };
        this.callback(null, 'ok');
    }
}

describe('Lambda property injection', () => {
    it('injects event, context and a wrapped callback', () => {
        let event = proxyEvent();
        let context = fakeContext();
        let result = invoke(event, context);
        assert.equal(result.called, true);
        assert.equal(result.message, 'ok');
        assert.strictEqual(captured.event, event);
        assert.strictEqual(captured.context, context);
    });

    it('injects event context from requestContext (proxy) or context (passthrough)', () => {
        invoke(proxyEvent());
        assert.deepEqual(captured.eventContext, {requestId: 'req-1'});
        invoke(passthroughEvent());
        assert.deepEqual(captured.eventContext, {'http-method': 'GET', 'resource-path': '/'});
    });
});

describe('API Gateway property injection', () => {
    it('injects values from a Lambda proxy event', () => {
        invoke(proxyEvent({httpMethod: 'POST'}));
        assert.deepEqual(captured.headers, {'Content-Type': 'application/json'});
        assert.deepEqual(captured.queryParams, {q: 'search'});
        assert.deepEqual(captured.pathParams, {id: '42'});
        assert.equal(captured.method, 'POST');
        assert.equal(captured.body, '{"name":"phi"}');
        assert.deepEqual(captured.stageVariables, {stage: 'dev'});
    });

    it('injects values from an HTTP API payload 2.0 event', () => {
        invoke(httpApiRequest('POST', '/'));
        assert.deepEqual(captured.headers, {'content-type': 'application/json'});
        assert.deepEqual(captured.queryParams, {q: 'search'});
        assert.deepEqual(captured.pathParams, {id: '42'});
        assert.equal(captured.method, 'POST');
        assert.equal(captured.body, '{"name":"phi"}');
        assert.deepEqual(captured.stageVariables, {stage: 'dev'});
        assert.equal(captured.eventContext.requestId, 'req-2');
    });

    it('injects headers, method, body and stage variables from a passthrough event', () => {
        invoke(passthroughEvent());
        assert.deepEqual(captured.headers, {'Content-Type': 'application/json'});
        assert.equal(captured.method, 'GET');
        assert.deepEqual(captured.body, {name: 'phi'});
        assert.deepEqual(captured.stageVariables, {stage: 'dev'});
    });

    it('injects query params from a passthrough event', () => {
        invoke(passthroughEvent());
        assert.deepEqual(captured.queryParams, {q: 'search'});
    });

    it('injects path params from a passthrough event', () => {
        invoke(passthroughEvent());
        assert.deepEqual(captured.pathParams, {id: '42'});
    });

    it('injects path params from a passthrough event with an empty query string', () => {
        invoke(passthroughEvent({params: {path: {id: '42'}, querystring: {}}}));
        assert.deepEqual(captured.pathParams, {id: '42'});
        assert.deepEqual(captured.queryParams, {});
    });

    it('injects query params from event.queryParams', () => {
        invoke({queryParams: {q: 'mapped'}});
        assert.deepEqual(captured.queryParams, {q: 'mapped'});
    });

    it('prefers event.queryParams over event.queryStringParameters', () => {
        invoke({queryParams: {q: 'mapped'}, queryStringParameters: {q: 'proxy'}});
        assert.deepEqual(captured.queryParams, {q: 'mapped'});
    });

    it('injects path params from params.path when there is no query string', () => {
        invoke({params: {path: {id: '7'}}});
        assert.deepEqual(captured.pathParams, {id: '7'});
    });

    it('injects null event context when the event has none', () => {
        invoke({httpMethod: 'GET'});
        assert.strictEqual(captured.eventContext, null);
    });

    it('resets values between invocations', () => {
        invoke(proxyEvent());
        invoke({httpMethod: 'GET'});
        assert.equal(captured.headers, undefined);
        assert.equal(captured.queryParams, undefined);
        assert.equal(captured.body, undefined);
        assert.equal(captured.stageVariables, undefined);
    });
});
