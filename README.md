# lambda-phi (ALPHA)
Typescript framework for AWS API Gateway and Lambda

Api Gateway: Body Mapping Templates config
```
{
  "method": "$context.httpMethod",
  "body" : $input.json('$'),
  "headers": {
    #foreach($param in $input.params().header.keySet())
    "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext),#end

    #end
  },
  "queryParams": {
    #foreach($param in $input.params().querystring.keySet())
    "$param": "$util.escapeJavaScript($input.params().querystring.get($param))" #if($foreach.hasNext),#end

    #end
  },
  "pathParams": {
    #foreach($param in $input.params().path.keySet())
    "$param": "$util.escapeJavaScript($input.params().path.get($param))" #if($foreach.hasNext),#end

    #end
  }  
}
```

Sample Convention
```
import { LambdaHandler, Lambda, Event, Context, Callback, PostConstructor } from 'lambda-phi';
import { Get, Put, Post, Delete, Headers, PathParams, QueryParams, Method, Body } from 'lambda-phi/lib/api-gateway';

@Lambda()
class LambdaClass {
    @Context() context;
    @Callback() callback;
    @Event() event;
    @Headers() headers; // Content-Type, Authorization, etc..
    @PathParams() pathParams; // /users/{id} --> this.pathParams.id
    @QueryParams() queryParams; // ?param1=value1&param2=value2
    @Method() method; // GET, POST, ...
    @Body() body; // HTTP request body content

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

If you're using different Body Mapping variables, you can use the alias feature.

```typescript
//...
class A {
    //...
    @QueryParams('qParams') qParams;
    //...
}
//...
```
