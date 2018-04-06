# lambda-phi

Typescript framework for AWS API Gateway and Lambda

## Features

* Supports HTTP verbs method mapping. [See Sample Convention](#sample-convention)
* Supports event inject fallback. [See Sample](#event-inject-fallback)
* Supports body mapping [variable alias](#body-mapping-variable-alias).
* Supports multiple HTTP verbs to a method. [See sample](#multiple-methods-in-a-function).
* Supports catch all http verbs. [See sample](#forward-all-method-types-to-a-function).
* Supports method call before lambda function timeout. [See sample](#prelambdatimeout)
* Supports method call before running lambda callback(). [See sample](#prelambdacallback)
* Supports route mapping and path parameter parsing. [See sample](#path-examples)

## Sample Convention

```javascript
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
```

## Event inject fallback

This framework adds fallback to common `event` mapping fields, specially if you're using default passthrough or proxy template

### @Body()

* event.body
* event['body-json']

### @Header()

* event.headers
* event.params.header

### @Method()

* event.method
* event.httpMethod
* event.context['http-method']

### @PathParams()

* event.pathParams
* event.pathParameters
* event.params.path

### @QueryParams()

* event.queryParams
* event.queryStringParameters
* event.params.querystring

### @StageVariables()

* event.stageVariables
* event['stage-variables]

### @EventContext()

* event.context
* event.requestContext

## Body mapping variable alias

### If you're using different Body Mapping variables, you can use the alias feature.

```javascript
//...
class A {
  //...
  @QueryParams('qParams') qParams;
  //...
}
//...
```

### If you want to map it to multiple aliases

```javascript
//...
class A {
  //...
  @PathParams(['pParams', 'pathParams', 'pathParameters'])
  pathParams;
  //...
}
//...
```

### If you want to map it to a deeper variable, like event.context['http-method'].

```javascript
//...
class A {
  //...
  @Method('context.http-method') method;
  //...
}
//...
```

## Multiple methods in a function.

```javascript
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

## Forward all method types to a function.

```javascript
//...
class UsingAny {
    // This method will be called if the method type is PUT,POST,GET, etc..
    @Any()
    public otherwiseMethod() { this.callback(null, "I'm a passthrough method"); }
    //...
}
//...
```

## PreLambdaTimeout

If you want to call a method 2 seconds before your lambda function reach its timeout limit

```javascript
    @PreLambdaTimeout(2000)
    public beforeLambdaTimeout() {
        console.log("run me before timeout ",  this.context.getRemainingTimeInMillis());
    }
```

## PreLambdaCallback

If you want to call a method before running lambda callback() function

```javascript
    tasks:string[] = [];

    @PreLambdaCallback()
    public beforeLambdaCallback() {
       this.tasks.push("Do this pre callback task");
    }

    @Any()
    public anyHandler() {
        this.tasks.push("Do this task");
        this.callback(null, this.tasks);
    }
```

Output: `["Do this task","Do this pre callback task"]`

## Path Examples

### Path uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) package for pattern matching. The default resource path is parse from event.context['resource-path']

### In this example, `myPath()` will be triggered if the request path is `/my/path`

```javascript
    @Path('/my/path')
    public myPath() {
        this.callback(null, "serving /my/path/ request");
    }
```

### Setting default base path

```javascript
@Path('/v1')
@Lambda()
class WithBasePath {

    @Path('/my/path')
    public myPath() {
        this.callback(null, "this matches /v1/my/path request");
    }

    @Path('/my/path2')
    public myPath2() {
        this.callback(null, "this matches /v1/my/path2 request");
    }
}
```

### Configure a different resource path variable. This will target event.context['resource-path']

```javascript
@PathConfig({resourcePathVariable: 'context.resource-path'})
@Lambda()
class WithBasePath {

    @Path('/sample/path')
    public samplePath() {
        this.callback(null, "this matches /sample/path request");
    }

}
```

### Defining route with path parameter support

```javascript
    @Path('/book/:id')
    public book(@PathParam('id') bookId) {
        this.callback(null, "I got bookId: "+bookId);
    }

    @Path('/book/:id/:author')
    public book(@PathParam('id') bookId, @PathParam('author') author) {
        this.callback(null, "I got bookId: "+bookId+", author: "+author);
    }
```

### Defining route with HTTP filter

```javascript
    @Path('/allow/get/and/post')
    @Post()
    @Get()
    public allowGetAndPost() {
        this.callback(null, "You can only trigger this method with GET and POST requests")
    }
```
