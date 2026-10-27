import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Any, Path} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

// @Path must sit above @Lambda: decorators apply bottom-up and @Lambda resets the base path.
@Path('/v1')
@Lambda()
class BasePathLambda {
    @Callback() callback;

    @Path('/my/path')
    public myPath() { this.callback(null, 'my-path'); }

    @Any()
    public fallback() { this.callback(null, 'any'); }
}

describe('Class level @Path', () => {
    it('prefixes method routes with the base path', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/v1/my/path'}).message, 'my-path');
        assert.equal(invoke({httpMethod: 'GET', path: '/my/path'}).message, 'any');
    });
});
