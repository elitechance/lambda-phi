# Change Log

2.0.0

* Upgrade typescript to 7.x, @types/node to 26.x and path-to-regexp to 8.x
* Remove deprecated @types/path-to-regexp
* Requires Node.js 20 or later
* Add `LambdaAsyncHandler` for Node.js 24+ Lambda runtimes, which no longer support callback handlers
* Support API Gateway HTTP API payload format 2.0, method from `requestContext.http.method` and path from `rawPath`
* Compile target is now ES2022
* Breaking: wildcard routes need a name, `@Path('/files/*filepath')`. Value is injected as an array of path segments
* Breaking: path params are now URL decoded
* Breaking: fix @PathParams() on passthrough events, it was injecting `params.querystring` instead of `params.path`
* Breaking: fix @QueryParams() on passthrough events, it was always empty instead of `params.querystring`
* Breaking: @QueryParams() now follows the documented fallback order `event.queryParams`, `event.queryStringParameters`, `event['params'].querystring`
* Breaking: @QueryParams('alias') falls back to the default fields when the alias is missing, like the other decorators
* Fix alias array skipping the remaining aliases when a deep alias like `context.http-method` is missing
* Fix crash `Cannot set properties of null (setting 'basePath')` when a @Lambda() class has no decorated members
* Fix @Path type signature when used as a class decorator
* Add unit tests, `npm test` and `npm run coverage`
* Add AWS SAM local API Gateway tests for REST API and HTTP API payloads on Node.js 22 and 24, `npm run test:sam`

  1.0.29

* Add readme and change log in build needed for npm publish

  1.0.28

* Add typescript declaration
* Fix README formatting and follow common standard

  1.0.27

* Fix repositories
* Add build script

  1.0.26

* Fix lambda-phi.d.ts

  1.0.25

* Convert ApiGateway static methods
* Use instance class of ApiGateway to avoid race condition

  1.0.24

* Fix variable setting, reset for every new event

  1.0.23

* Fix method check

  1.0.22

* Add fallback document to README.md

  1.0.21

* Support for stage variables inject
* Support for event context using @EventContext decorator

  1.0.20

* Add fallback for method inject
* Add fallback for body inject
* Add fallback for queryParams inject
* Add fallback for pathParams inject
* Add fallback for headers inject

  1.0.19

* Fix package.json to apply .d.ts path

  1.0.18

* Publishing types

  1.0.17

* Handle better fallback on resource path

  1.0.16

* Add default resource path

  1.0.15

* Support for deeper variable access in name alias like @Method('context.http-method')
* Fix README.md to use javascript syntax in code template

  1.0.13

* Support for class @Path to define base path route
* Support for method @Path to define route pattern
* Support for method parameter @PathParam to define path param
* Support for configurable parameter injection. Allow null or default for empty object `{}`

  1.0.12

* Bug fix on empty lambda
* Add fallback when getting HTTP method, using context.httpMethod

  1.0.11

* New method decorator @PreLambdaCallback - method will be executed before running lambda callback() function

  1.0.10

* Support for multiple Aliases

  1.0.9

* Add @PreLambdaTimeout(miliSecondsBeforeTimeout). Given the remaining time before timeout, execute a method

  1.0.8

* Add new decorator @Any, acts like a default method
* Add usage of @Any in README
