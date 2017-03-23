# lambda-phi
Typescript framework for AWS API Gateway and Lambda


Features
* Supports all HTTP verbs (GET, POST, PUT, DELETE, etc..) for method mapping [See Sample Convention](#sample-convention)
* Supports body mapping [variable alias](#body-mapping-variable-alias).
* Supports multiple HTTP verbs to a method. [See sample](#multiple-methods-in-a-function).
* Supports catch all http verbs. [See sample](#forward-all-method-types-to-a-function).
* Supports method call before lambda function timeout. [See sample](#prelambdatimeout-decorator)

This framework assumes this body mapping template in API Gateway
```javascript
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

#### Sample Convention
```typescript
import { LambdaHandler, Lambda, Event, Context, Callback, PostConstructor } from 'lambda-phi';
import { Get, Put, Post, Delete, Headers, PathParams, QueryParams, Method, Body } from 'lambda-phi/lib/api-gateway';

@Lambda()
class LambdaClass {
    @Context() context;
    @Callback() callback;
    @Event() event;
    @Headers() headers; // Content-Type, Authorization, etc..
    @PathParams() pathParams; // /users/{id} --> this.pathParams.id
    @QueryParams() queryParams; // ?param1=value1 --> this.queryParams.param1
    @Method() method; // GET, POST, ...
    @Body() body; // HTTP request body content

    @PostConstructor()
    public postConstructor() {
        console.log("post constructor");
    }

    @Get()
    public getRequest() { this.callback(null, "HTTP get request"); }

    @Put()
    public putRequest() { this.callback(null, "HTTP put request"); }

    @Post()
    public postRequest() { this.callback(null, "HTTP Post request"); }

    @Delete()
    public deleteRequest() { this.callback(null, "HTTP Delete request"); }
}

exports.handler = LambdaHandler;
````

#### Body mapping variable alias
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

#### Multiple methods in a function.

```typescript
//...
class PutAndPost {
    //...
    @Put()
    @Post()
    public putAndPostMethod() { this.callback(null, "HTTP put request"); }
    //...
}
//...
```

#### Forward all method types to a function.

```typescript
//...
class UsingAny {
    // This method will be called if the method type is PUT,POST,GET, etc..
    @Any()
    public otherwiseMethod() { this.callback(null, "I'm a passthrough method"); }
    //...
}
//...
```

#### PreLambdaTimeout Decorator
If you want to call a method 2 seconds before your lambda function reach its timeout limit

```typescript
    @PreLambdaTimeout(2000)
    public beforeLambdaTimeout() {
        console.log("run me before timeout ", this.context.getRemainingTimeInMillis());
    }
```
