import assert = require('node:assert');
import {describe, it} from 'node:test';
import {Lambda, Callback} from "../src/lambda-phi";
import {Get, Post, Any, Path, PathParam} from "../src/lib/api-gateway";
import {invoke, httpApiRequest} from "./helpers";

@Lambda()
class PathLambda {
    @Callback() callback;

    @Path('/books')
    @Get()
    public listBooks() { this.callback(null, 'list'); }

    @Path('/books')
    @Post()
    public createBook() { this.callback(null, 'create'); }

    @Path('/books/:id')
    public getBook(@PathParam('id') id) { this.callback(null, 'book:' + id); }

    @Path('/books/:id/authors/:author')
    public getAuthor(@PathParam('author') author, @PathParam('id') id) {
        this.callback(null, 'book:' + id + ',author:' + author);
    }

    @Path('/files/*filepath')
    public getFile(@PathParam('filepath') filepath) { this.callback(null, 'file:' + filepath.join('/')); }

    @Get()
    public plainGet() { this.callback(null, 'plain-get'); }

    @Any()
    public fallback() { this.callback(null, 'any'); }
}

describe('@Path routing', () => {
    it('matches a route filtered by HTTP verb', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/books'}).message, 'list');
        assert.equal(invoke({httpMethod: 'POST', path: '/books'}).message, 'create');
    });

    it('falls back to @Any() when the route matches but the verb does not', () => {
        assert.equal(invoke({httpMethod: 'DELETE', path: '/books'}).message, 'any');
    });

    it('injects path params by name, regardless of argument order', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/books/7'}).message, 'book:7');
        assert.equal(invoke({httpMethod: 'GET', path: '/books/7/authors/ann'}).message, 'book:7,author:ann');
    });

    it('injects wildcard segments as an array', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/files/docs/a.txt'}).message, 'file:docs/a.txt');
    });

    it('reads the resource path from an HTTP API payload 2.0 event', () => {
        assert.equal(invoke(httpApiRequest('GET', '/books')).message, 'list');
        assert.equal(invoke(httpApiRequest('POST', '/books')).message, 'create');
        assert.equal(invoke(httpApiRequest('GET', '/books/hello%20world')).message, 'book:hello world');
    });

    it('reads the resource path from context.resource-path', () => {
        let result = invoke({context: {'http-method': 'GET', 'resource-path': '/books/9'}});
        assert.equal(result.message, 'book:9');
    });

    it('uses verb methods without @Path when no route matches', () => {
        assert.equal(invoke({httpMethod: 'GET', path: '/unknown'}).message, 'plain-get');
        assert.equal(invoke({httpMethod: 'PUT', path: '/unknown'}).message, 'any');
    });
});
