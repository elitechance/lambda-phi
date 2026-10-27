import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Any, Path, PathConfig} from "../src/lib/api-gateway";
import {invoke} from "./helpers";

@PathConfig({resourcePathVariable: 'custom.route'})
@Lambda()
class PathConfigLambda {
    @Callback() callback;

    @Path('/sample/path')
    public samplePath() { this.callback(null, 'sample'); }

    @Any()
    public fallback() { this.callback(null, 'any'); }
}

describe('@PathConfig', () => {
    it('reads the resource path from the configured variable', () => {
        assert.equal(invoke({httpMethod: 'GET', custom: {route: '/sample/path'}}).message, 'sample');
    });

    it('falls back to event.path when the configured variable is missing', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/sample/path'}).message, 'sample');
    });
});
