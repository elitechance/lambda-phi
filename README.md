# lambda-phi (ALPHA)
Typescript framework for AWS API Gateway and Lambda

Sample Convention
```
import { LambdaHandler, Lambda, Event, Context, Callback} from 'lambda-phi';
import { Get, Put, Post, Delete } from 'lambda-phi/lib/api-gateway';

@Lambda()
class LambdaClass {
    @Context() context;
    @Callback() callback;
    @Event() events;

    test = 'name';

    @Get()
    public getRequest() { console.log("HTTP get request"); }

    @Put()
    public putRequest() { console.log("HTTP put request"); }

    @Post()
    public postRequest() { console.log("HTTP Post request"); }

    @Delete()
    public deleteRequest() { console.log("HTTP Delete request"); }
}

exports.handler = LambdaHandler;

```
