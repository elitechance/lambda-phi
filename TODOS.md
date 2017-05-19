# TODOS

* ~~Trigger a method before calling _callback_ @PreLambdaCallback~~
* Support for Routes
    - ~~@Path( '/generic/route' )~~
    - ~~@Path( '/route/path/with/method/filter/')~~
    - ~~@Path( '/route/with/path/variable/:id')~~
    - ~~@Path( '/route/with/regex/*' )~~

* Support for base path    
```typescript
@Path('/v1')
class SampleClass {
    @Path('/child/path') // route --> /v1/child/path
    baseChildPath() {
    }
    
    @Path('/child/path2') // route --> /v1/child/path2
    baseChildPath2() {
    }
}
```

* Support for path param
```typescript
class PathParamClass {
    @Path('/book/:id')
    baseChildPath(@PathParam('id') id:number) {
    }
    
}
```
