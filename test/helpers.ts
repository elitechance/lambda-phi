import {LambdaHandler} from "../src/lambda-phi";

/**
 * Each test file runs in its own process (node --test), so the LambdaManager
 * singleton and ApiGateway static aliases never leak between files.
 */

export interface InvokeResult {
    error:any;
    message:any;
    called:boolean;
}

export function fakeContext(remainingTimeInMillis:number = 30000) {
    return {
        getRemainingTimeInMillis: () => remainingTimeInMillis
    };
}

export function invoke(event:any, context:any = fakeContext()):InvokeResult {
    let result:InvokeResult = {error: undefined, message: undefined, called: false};
    LambdaHandler(event, context, (error, message) => {
        result.error = error;
        result.message = message;
        result.called = true;
    });
    return result;
}

export function proxyEvent(overrides:any = {}) {
    let event:any = {
        httpMethod: 'GET',
        path: '/',
        headers: {'Content-Type': 'application/json'},
        queryStringParameters: {q: 'search'},
        pathParameters: {id: '42'},
        body: '{"name":"phi"}',
        stageVariables: {stage: 'dev'},
        requestContext: {requestId: 'req-1'}
    };
    for (let key in overrides) { event[key] = overrides[key]; }
    return event;
}

export function passthroughEvent(overrides:any = {}) {
    let event:any = {
        'body-json': {name: 'phi'},
        params: {
            path: {id: '42'},
            querystring: {q: 'search'},
            header: {'Content-Type': 'application/json'}
        },
        'stage-variables': {stage: 'dev'},
        context: {'http-method': 'GET', 'resource-path': '/'}
    };
    for (let key in overrides) { event[key] = overrides[key]; }
    return event;
}

// HTTP API payload format 2.0, based on the AWS API Gateway developer guide sample
export function httpApiEvent(overrides:any = {}) {
    let event:any = {
        version: '2.0',
        routeKey: '$default',
        rawPath: '/',
        rawQueryString: 'q=search',
        cookies: ['cookie1'],
        headers: {'content-type': 'application/json'},
        queryStringParameters: {q: 'search'},
        requestContext: {
            http: {method: 'GET', path: '/', protocol: 'HTTP/1.1', sourceIp: '192.0.2.1', userAgent: 'agent'},
            requestId: 'req-2',
            routeKey: '$default',
            stage: '$default'
        },
        body: '{"name":"phi"}',
        pathParameters: {id: '42'},
        isBase64Encoded: false,
        stageVariables: {stage: 'dev'}
    };
    for (let key in overrides) { event[key] = overrides[key]; }
    return event;
}

export function httpApiRequest(method:string, rawPath:string) {
    let event = httpApiEvent({rawPath: rawPath});
    event.requestContext.http.method = method;
    event.requestContext.http.path = rawPath;
    return event;
}
