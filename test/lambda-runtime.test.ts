import assert = require('node:assert');
import {describe, it} from 'node:test';
import {spawnSync} from 'node:child_process';
import path = require('node:path');

describe('AWS Lambda Node.js runtime', () => {
    // The Lambda bootstrap starts node with --no-experimental-require-module,
    // so ESM only dependencies can not be loaded from this CommonJS package.
    it('loads the library without require(esm)', () => {
        let entry = path.join(__dirname, '../src/lambda-phi.js');
        let apiGateway = path.join(__dirname, '../src/lib/api-gateway.js');
        let result = spawnSync(process.execPath, [
            '--no-experimental-require-module',
            '-e', 'require(' + JSON.stringify(entry) + '); require(' + JSON.stringify(apiGateway) + ');'
        ], {encoding: 'utf8'});
        assert.equal(result.status, 0, result.stderr);
    });
});
