/**
 * Created by EGomez on 5/18/17.
 */

export default class HttpVerbModel {
    private _name:string;
    private _methodName:string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get methodName(): string {
        return this._methodName;
    }

    set methodName(value: string) {
        this._methodName = value;
    }
}
