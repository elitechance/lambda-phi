/**
 * Created by EGomez on 5/4/17.
 */

export default class HttpModel {
    public static readonly METHOD_GET:string = 'GET';
    public static readonly METHOD_POST:string = 'POST';
    public static readonly METHOD_PATCH:string = 'PATCH';
    public static readonly METHOD_OPTIONS:string = 'OPTIONS';
    public static readonly METHOD_PUT:string = 'PUT';
    public static readonly METHOD_HEAD:string = 'HEAD';
    public static readonly METHOD_DELETE:string = 'DELETE';

    public static readonly methods:Array<string> = [
        HttpModel.METHOD_GET,
        HttpModel.METHOD_POST,
        HttpModel.METHOD_PATCH,
        HttpModel.METHOD_OPTIONS,
        HttpModel.METHOD_PUT,
        HttpModel.METHOD_HEAD,
        HttpModel.METHOD_DELETE,
    ]
}