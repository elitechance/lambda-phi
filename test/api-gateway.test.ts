import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {ApiGateway, Any, Headers, QueryParams, Method, StageVariables} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

let captured:any;

@Lambda()
class InvalidAliasLambda {
    @Callback() callback;
    @Headers(['missing', 'alsoMissing']) headers;
    @QueryParams('custom.query') queryParams;
    @StageVariables(42) stageVariables;
    @Method(['context.http-method', 'verb']) method;

    @Any()
    public handle() {
        captured = {
            headers: this.headers,
            queryParams: this.queryParams,
            method: this.method,
            stageVariables: this.stageVariables
        };
        this.callback(null, 'ok');
    }
}

describe('ApiGateway', () => {
    it('ignores aliases that are neither a string nor an array', () => {
        invoke({httpMethod: 'GET', stageVariables: {stage: 'dev'}});
        assert.deepEqual(captured.stageVariables, {stage: 'dev'});
    });

    it('falls back to default fields when no alias in an array matches', () => {
        invoke({httpMethod: 'GET', headers: {a: '1'}});
        assert.deepEqual(captured.headers, {a: '1'});
    });

    it('falls back to default query params when the alias is missing', () => {
        invoke({httpMethod: 'GET', queryStringParameters: {q: 'x'}});
        assert.deepEqual(captured.queryParams, {q: 'x'});
    });

    it('tries the next alias when a deep alias is missing', () => {
        invoke({verb: 'PUT'});
        assert.equal(captured.method, 'PUT');
    });

    it('ignores a missing lambda model', () => {
        let apiGateway = new ApiGateway();
        apiGateway.prepareHttpRequestVariables({httpMethod: 'GET'}, {});
        assert.doesNotThrow(() => apiGateway.setLambdaProperties(null));
        assert.doesNotThrow(() => apiGateway.executeHttpRequest(null));
    });

    it('does not match routes when there is no resource path', () => {
        let apiGateway = new ApiGateway();
        apiGateway.prepareHttpRequestVariables(null, {});
        let lambda:any = {basePath: '', paths: [{pattern: '/'}]};
        assert.equal(apiGateway.executePath(lambda), false);
    });
});
