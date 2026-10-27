import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback, Event} from "../src/lambda-phi";
import {Any, Headers, QueryParams, PathParams} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

let captured:any;

@Lambda({allowNullInjection: false})
class NoNullLambda {
    @Callback() callback;
    @Event() event;
    @Headers() headers;
    @QueryParams() queryParams;
    @PathParams() pathParams;

    @Any()
    public handle() {
        captured = {
            event: this.event,
            headers: this.headers,
            queryParams: this.queryParams,
            pathParams: this.pathParams
        };
        this.callback(null, 'ok');
    }
}

describe('allowNullInjection: false', () => {
    it('injects empty objects instead of missing values', () => {
        invoke({httpMethod: 'GET'});
        assert.deepEqual(captured.headers, {});
        assert.deepEqual(captured.queryParams, {});
        assert.deepEqual(captured.pathParams, {});
    });

    it('injects an empty event object when the event is null', () => {
        invoke(null);
        assert.deepEqual(captured.event, {});
    });
});
