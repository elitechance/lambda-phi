import assert from 'node:assert';
import {describe, it} from 'node:test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';

const apis = [
    {path: 'rest', name: 'REST API (payload 1.0)'},
    {path: 'http1', name: 'HTTP API (payload 1.0)'},
    {path: 'http2', name: 'HTTP API (payload 2.0)'}
];

async function request(method, path, options = {}) {
    let response = await fetch(baseUrl + path, {method: method, headers: options.headers, body: options.body});
    let text = await response.text();
    assert.equal(response.status, 200, text);
    return JSON.parse(text);
}

for (let api of apis) {
    describe(api.name, () => {
        it('routes GET with headers and query params', async () => {
            let result = await request('GET', '/' + api.path + '/books?q=x', {headers: {'x-test': '1'}});
            assert.equal(result.route, 'list');
            assert.equal(result.method, 'GET');
            assert.deepEqual(result.query, {q: 'x'});
            assert.equal(result.header, '1');
        });

        it('routes POST with body', async () => {
            let result = await request('POST', '/' + api.path + '/books', {body: '{"title":"phi"}'});
            assert.equal(result.route, 'create');
            assert.equal(result.body, '{"title":"phi"}');
        });

        it('injects path params', async () => {
            let result = await request('GET', '/' + api.path + '/books/42');
            assert.equal(result.route, 'book:42');
        });

        it('URL decodes path params', async () => {
            let result = await request('GET', '/' + api.path + '/books/hello%20world');
            assert.equal(result.route, 'book:hello world');
        });

        it('falls back to @Any() for unmapped verbs', async () => {
            let result = await request('DELETE', '/' + api.path + '/books');
            assert.equal(result.route, 'any');
        });
    });
}
