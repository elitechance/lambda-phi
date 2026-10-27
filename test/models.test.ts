import assert = require('node:assert');
import {describe, it} from 'node:test';
import LambdaModel from "../src/lib/lambda-model";
import PathModel from "../src/lib/path-model";
import PathParamModel from "../src/lib/path-param-model";
import HttpVerbModel from "../src/lib/http-verb-model";
import HttpModel from "../src/lib/http-model";

describe('Models', () => {
    it('LambdaModel stores its routing collections', () => {
        let lambda = new LambdaModel();
        let paths = [new PathModel()];
        let pathParams = [new PathParamModel()];
        let httpVerbs = [new HttpVerbModel()];
        lambda.paths = paths;
        lambda.pathParams = pathParams;
        lambda.httpVerbs = httpVerbs;
        lambda.handlerMethod = 'handler';
        assert.strictEqual(lambda.paths, paths);
        assert.strictEqual(lambda.pathParams, pathParams);
        assert.strictEqual(lambda.httpVerbs, httpVerbs);
        assert.equal(lambda.handlerMethod, 'handler');
    });

    it('PathModel stores pattern, method name and HTTP methods', () => {
        let path = new PathModel();
        assert.strictEqual(path.httpMethods, null);
        path.pattern = '/books/:id';
        path.methodName = 'getBook';
        path.httpMethods = [HttpModel.METHOD_GET];
        assert.equal(path.pattern, '/books/:id');
        assert.equal(path.methodName, 'getBook');
        assert.deepEqual(path.httpMethods, ['GET']);
    });

    it('PathParamModel defaults to a null default value', () => {
        let pathParam = new PathParamModel();
        assert.strictEqual(pathParam.defaultValue, null);
        pathParam.defaultValue = 'fallback';
        assert.equal(pathParam.defaultValue, 'fallback');
    });

    it('HttpModel lists all supported methods', () => {
        assert.deepEqual(HttpModel.methods, ['GET', 'POST', 'PATCH', 'OPTIONS', 'PUT', 'HEAD', 'DELETE']);
    });
});
