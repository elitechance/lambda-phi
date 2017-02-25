/**
 * Created by EGomez on 2/23/17.
 */

export default class LambdaModel {
    private _name;
    private _instance;

    /**
     * API Properties
     */
    private _postConstructorMethod;

    /**
     * Lambda Properties
     */
    private _eventProperty;
    private _callbackProperty;
    private _contextProperty;
    private _handlerMethod;

    /**
     * Api Gateway Properties
     */

    private _queryParamsProperty;
    private _pathParamsProperty;
    private _headersProperty;
    private _bodyProperty;
    private _methodProperty;

    private _getMethod;
    private _postMethod;
    private _patchMethod;
    private _headMethod;
    private _optionsMethod;
    private _putMethod;
    private _deleteMethod;

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get instance() {
        return this._instance;
    }

    set instance(value) {
        this._instance = value;
    }


    get eventProperty() {
        return this._eventProperty;
    }

    set eventProperty(value) {
        this._eventProperty = value;
    }

    get handlerMethod() {
        return this._handlerMethod;
    }

    set handlerMethod(value) {
        this._handlerMethod = value;
    }

    get callbackProperty() {
        return this._callbackProperty;
    }

    set callbackProperty(value) {
        this._callbackProperty = value;
    }

    get queryParamsProperty() {
        return this._queryParamsProperty;
    }

    set queryParamsProperty(value) {
        this._queryParamsProperty = value;
    }

    get pathParamsProperty() {
        return this._pathParamsProperty;
    }

    set pathParamsProperty(value) {
        this._pathParamsProperty = value;
    }

    get methodProperty() {
        return this._methodProperty;
    }

    set methodProperty(value) {
        this._methodProperty = value;
    }

    get contextProperty() {
        return this._contextProperty;
    }

    set contextProperty(value) {
        this._contextProperty = value;
    }

    get getMethod() {
        return this._getMethod;
    }

    set getMethod(value) {
        this._getMethod = value;
    }

    get postMethod() {
        return this._postMethod;
    }

    set postMethod(value) {
        this._postMethod = value;
    }

    get patchMethod() {
        return this._patchMethod;
    }

    set patchMethod(value) {
        this._patchMethod = value;
    }

    get headMethod() {
        return this._headMethod;
    }

    set headMethod(value) {
        this._headMethod = value;
    }

    get optionsMethod() {
        return this._optionsMethod;
    }

    set optionsMethod(value) {
        this._optionsMethod = value;
    }

    get putMethod() {
        return this._putMethod;
    }

    set putMethod(value) {
        this._putMethod = value;
    }

    get deleteMethod() {
        return this._deleteMethod;
    }

    set deleteMethod(value) {
        this._deleteMethod = value;
    }

    get postConstructorMethod() {
        return this._postConstructorMethod;
    }

    set postConstructorMethod(value) {
        this._postConstructorMethod = value;
    }

    get headersProperty() {
        return this._headersProperty;
    }

    set headersProperty(value) {
        this._headersProperty = value;
    }

    get bodyProperty() {
        return this._bodyProperty;
    }

    set bodyProperty(value) {
        this._bodyProperty = value;
    }
}
