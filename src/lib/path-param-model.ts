/**
 * Created by EGomez on 5/18/17.
 */

export default class PathParamModel {
    private _name:string;
    private _index:number;
    private _methodName:string;
    private _defaultValue:any = null;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get index(): number {
        return this._index;
    }

    set index(value: number) {
        this._index = value;
    }

    get methodName(): string {
        return this._methodName;
    }

    set methodName(value: string) {
        this._methodName = value;
    }

    get defaultValue(): any {
        return this._defaultValue;
    }

    set defaultValue(value: any) {
        this._defaultValue = value;
    }
}
