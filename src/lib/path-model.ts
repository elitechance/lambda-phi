import PathParamModel from "../../lib/path-param-model";
/**
 * Created by EGomez on 5/4/17.
 */

export default class PathModel {

    private _methodName:string;

    private _pattern:string;

    private _httpMethods:Array<string> = null;

    get pattern(): string {
        return this._pattern;
    }

    set pattern(value: string) {
        this._pattern = value;
    }

    get httpMethods(): Array<string> {
        return this._httpMethods;
    }

    set httpMethods(value: Array<string>) {
        this._httpMethods = value;
    }

    get methodName(): string {
        return this._methodName;
    }

    set methodName(value: string) {
        this._methodName = value;
    }

}
