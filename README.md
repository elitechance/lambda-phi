# lambda-phi (ALPHA)
Typescript framework for AWS API Gateway and Lambda

Sample Convention
```
import { LambdaHandler, Lambda, Event, Context, Callback, PostConstructor } from 'lambda-phi';
import { Get, Put, Post, Delete, Headers, PathParams, QueryParams, Method } from 'lambda-phi/lib/api-gateway';

@Lambda()
class LambdaClass {
    @Context() context;
    @Callback() callback;
    @Event() events;
    @Headers() headers; // Content-Type, Authorization, etc..
    @PathParams() pathParams; // /users/{id} --> this.pathParams.id
    @QueryParams() queryParams; // ?param1=value1&param2=value2
    @Method() method; // GET, POST, ...

    @PostConstructor()
    public postConstructor() {
        console.log("post constructor");
    }

    @Get()
    public getRequest() { console.log("HTTP get request", this.headers); }

    @Put()
    public putRequest() { console.log("HTTP put request"); }

    @Post()
    public postRequest() { console.log("HTTP Post request"); }

    @Delete()
    public deleteRequest() { console.log("HTTP Delete request"); }
}

exports.handler = LambdaHandler;

```
