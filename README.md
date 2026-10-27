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
* Supports wildcard routes. [See sample](#defining-wildcard-route)
* Supports Node.js 24+ Lambda runtimes. [See sample](#lambda-handler-for-nodejs-24)
* Supports API Gateway REST API, HTTP API and passthrough payloads. [See formats](#api-gateway-payload-formats)

## Requirements

* Node.js 20 or later
* Typescript with `experimentalDecorators` enabled in `tsconfig.json`
* Lambda runtime `nodejs22.x` with `LambdaHandler` or `LambdaAsyncHandler`, `nodejs24.x` or later with `LambdaAsyncHandler`

## Migrating from 1.x

2.0.0 has breaking changes. See [CHANGELOG.md](CHANGELOG.md) for the full list.

* Node.js 20 or later is required.
* On Lambda runtime `nodejs24.x` or later, change `exports.handler = LambdaHandler` to `exports.handler = LambdaAsyncHandler`. See [Lambda handler for Node.js 24+](#lambda-handler-for-nodejs-24).
* Wildcard routes need a name. Change `@Path('/files/*')` to `@Path('/files/*filepath')`, the value is injected as an array of path segments.
* Path params are URL decoded. `/book/hello%20world` injects `hello world` instead of `hello%20world`.
* Passthrough events (`event.params`) now inject the right values. In 1.x `@PathParams()` received `params.querystring` and `@QueryParams()` was empty. If you read the query string from `@PathParams()` as a workaround, read it from `@QueryParams()` instead.
* `@QueryParams()` follows the [fallback order](#queryparams) below. If an event has both `queryParams` and `queryStringParameters`, `queryParams` is now used.
* `@QueryParams('alias')` falls back to the default fields when the alias is missing, instead of injecting `undefined`.

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

## Lambda handler for Node.js 24+

AWS Lambda removed callback handlers starting with the `nodejs24.x` runtime. Use `LambdaAsyncHandler` instead, your lambda classes don't change.
It returns a Promise that resolves when a method calls `this.callback(null, result)` and rejects when it calls `this.callback(error)` or throws.

```javascript
import { LambdaAsyncHandler, Lambda, Callback } from 'lambda-phi';
import { Get } from 'lambda-phi/lib/api-gateway';

@Lambda()
class LambdaClass {
    @Callback() callback;

    @Get()
    public getRequest() { this.callback(null, {statusCode: 200, body: "HTTP get request"}); }
}

exports.handler = LambdaAsyncHandler;
```

`LambdaHandler` still works on `nodejs22.x`, which logs a warning that callback handlers are removed in Node.js 24.

## API Gateway payload formats

lambda-phi reads the request from any of these payloads. The same lambda class works with all of them.

| API Gateway setup | Payload | Response your method passes to `this.callback()` |
|---|---|---|
| REST API, Lambda proxy integration | 1.0 | `{statusCode, headers, body}`, anything else returns `502` |
| REST API, Lambda integration with `Method request passthrough` template | passthrough | Any value |
| HTTP API, payload format version `1.0` | 1.0 | `{statusCode, headers, body}` |
| HTTP API, payload format version `2.0` (default) | 2.0 | `{statusCode, headers, body}`, or any JSON value for a `200` |
| Lambda function URL | 2.0 | `{statusCode, headers, body}`, or any JSON value for a `200` |

### REST API, payload 1.0

* Console: in the method's **Integration request**, turn on **Lambda proxy integration**.
* CLI: `aws apigateway put-integration ... --type AWS_PROXY`
* SAM:

```yaml
Events:
  Books:
    Type: Api
    Properties:
      Path: /books/{id}
      Method: get
```

### REST API, passthrough

* Console: in the method's **Integration request**, turn off **Lambda proxy integration**. Under **Mapping templates**, add content type `application/json` and generate the `Method request passthrough` template.
* CLI: `aws apigateway put-integration ... --type AWS` with the passthrough template in `--request-templates`

### HTTP API, payload 1.0 or 2.0

* Console: edit the route's Lambda integration, under **Advanced settings** choose the **Payload format version**.
* CLI: `aws apigatewayv2 create-integration ... --integration-type AWS_PROXY --payload-format-version 2.0`, or `aws apigatewayv2 update-integration ... --payload-format-version 1.0`
* SAM, `PayloadFormatVersion` defaults to `2.0`:

```yaml
Events:
  Books:
    Type: HttpApi
    Properties:
      Path: /books/{id}
      Method: get
      PayloadFormatVersion: '1.0'
```

Payload 2.0 differences to know:

* Header names are lowercase.
* Repeated headers and query params are joined with commas, there's no `multiValueHeaders` or `multiValueQueryStringParameters`.
* Cookies are in `event.cookies`, use `@Event()` to read them.
* `rawPath` doesn't include the API mapping of a custom domain name. Use payload 1.0 if your routes need it.

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
* event.requestContext.http.method

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

If the alias is missing in the event, it falls back to the default fields in [Event inject fallback](#event-inject-fallback).

### If you want to map it to multiple aliases

The first alias found in the event is used.

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

### Path uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) package for pattern matching. The default resource path is parse from event.context['resource-path'], then event.path, then event.rawPath

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

### Defining wildcard route

Wildcards need a name and the matched path segments are injected as an array.

```javascript
    @Path('/files/*filepath')
    public file(@PathParam('filepath') filepath) {
        this.callback(null, "I got file: "+filepath.join('/')); // /files/docs/a.txt --> docs/a.txt
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

## Development

```
npm install
npm test          # run unit tests
npm run coverage  # run unit tests with coverage report, fails below 95%
npm run test:sam  # run the packed library behind a local API Gateway, needs Docker and AWS SAM CLI
npm run build     # compile to dist/ for npm publish
```

`npm run test:sam` uses [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) `sam local start-api` to send real HTTP requests to a REST API (payload 1.0), an HTTP API (payload 1.0) and an HTTP API (payload 2.0).
It runs `LambdaHandler` on `nodejs22.x` and `LambdaAsyncHandler` on `nodejs24.x`. See [test/sam](test/sam).
