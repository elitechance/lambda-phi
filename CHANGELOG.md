# Change Log

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

