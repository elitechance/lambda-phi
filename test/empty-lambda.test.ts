import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Any} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

@Lambda()
class EmptyLambda {
}

@Lambda()
class RealLambda {
    @Callback() callback;

    @Any()
    public handle() { this.callback(null, 'real'); }
}

describe('@Lambda() without decorated members', () => {
    it('is skipped and does not stop other lambdas', () => {
        let result;
        assert.doesNotThrow(() => { result = invoke({httpMethod: 'GET'}); });
        assert.equal(result.message, 'real');
    });
});
