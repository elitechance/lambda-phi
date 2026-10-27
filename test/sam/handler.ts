import { LambdaHandler, LambdaAsyncHandler, Lambda, Callback } from 'lambda-phi';
import { Get, Post, Any, Path, PathParam, Headers, QueryParams, Method, Body } from 'lambda-phi/lib/api-gateway';

@Lambda()
class Books {
    @Callback() callback;
    @Headers() headers;
    @QueryParams() queryParams;
    @Method() method;
    @Body() body;

    @Path('/:api/books')
    @Get()
    public list() { this.reply('list'); }

    @Path('/:api/books')
    @Post()
    public create() { this.reply('create'); }

    @Path('/:api/books/:id')
    public book(@PathParam('id') id) { this.reply('book:' + id); }

    @Any()
    public any() { this.reply('any'); }

    private reply(route:string) {
        let headers = this.headers || {};
        this.callback(null, {
            statusCode: 200,
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                route: route,
                method: this.method,
                query: this.queryParams,
                body: this.body,
                header: headers['x-test'] || headers['X-Test']
            })
        });
    }
}

exports.handler = LambdaHandler;
exports.asyncHandler = LambdaAsyncHandler;
