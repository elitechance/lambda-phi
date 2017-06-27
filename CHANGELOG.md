# Change Log

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
* Support for configurable parameter injection.  Allow null or default for empty object `{}`

1.0.12
* Bug fix on empty lambda
* Add fallback when getting HTTP method, using context.httpMethod

1.0.11
* New method decorator @PreLambdaCallback
    - method will be executed before running lambda callback() function

1.0.10
* Support for multiple Aliases

1.0.9
* Add @PreLambdaTimeout(miliSecondsBeforeTimeout). Given the remaining time before timeout, execute a method

1.0.8
* Add new decorator @Any, acts like a default method
* Add usage of @Any in README

