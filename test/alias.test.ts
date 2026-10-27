import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Any, Headers, QueryParams, PathParams, Method, Body, StageVariables} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

let captured:any;

@Lambda()
class AliasLambda {
    @Callback() callback;
    @Headers(['hdrs', 'w.x.y.z']) headers;
    @QueryParams('qParams') queryParams;
    @PathParams(['pParams', 'pathParameters', 'a.b.c.d.e']) pathParams;
    @Method('request.meta.verb') method;
    @Body('payload') body;
    @StageVariables('s.t.a.g.e.v') stageVariables;

    @Any()
    public handle() {
        captured = {
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

describe('Body mapping variable alias', () => {
    it('reads values from a single string alias', () => {
        invoke({hdrs: {a: '1'}, qParams: {q: 'x'}, payload: 'data'});
        assert.deepEqual(captured.headers, {a: '1'});
        assert.deepEqual(captured.queryParams, {q: 'x'});
        assert.equal(captured.body, 'data');
    });

    it('uses the first defined value from an alias array', () => {
        invoke({pathParameters: {id: '2'}});
        assert.deepEqual(captured.pathParams, {id: '2'});
        invoke({pParams: {id: '1'}, pathParameters: {id: '2'}});
        assert.deepEqual(captured.pathParams, {id: '1'});
    });

    it('reads deep values from a dotted alias', () => {
        invoke({request: {meta: {verb: 'PUT'}}});
        assert.equal(captured.method, 'PUT');
    });

    it('reads values up to six levels deep', () => {
        invoke({w: {x: {y: {z: {a: '4'}}}}, a: {b: {c: {d: {e: {id: '5'}}}}}, s: {t: {a: {g: {e: {v: {stage: 'prod'}}}}}}});
        assert.deepEqual(captured.headers, {a: '4'});
        assert.deepEqual(captured.pathParams, {id: '5'});
        assert.deepEqual(captured.stageVariables, {stage: 'prod'});
    });

    it('falls back to default fields when the alias is missing', () => {
        invoke({httpMethod: 'POST', headers: {b: '2'}, body: 'fallback', stageVariables: {stage: 'dev'}});
        assert.equal(captured.method, 'POST');
        assert.deepEqual(captured.headers, {b: '2'});
        assert.equal(captured.body, 'fallback');
        assert.deepEqual(captured.stageVariables, {stage: 'dev'});
    });
});
