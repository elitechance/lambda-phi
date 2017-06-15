/**
 * Created by EGomez on 2/23/17.
 */

import PathModel from "./path-model";
import PathParamModel from "./path-param-model";
import HttpVerbModel from "./http-verb-model";
import {LambdaConfig} from "./lambda-config";

export default class LambdaModel {
    private _name;
    private _instance;
    private _paths:Array<PathModel> = [];
    private _basePath:string;
    private _pathParams:PathParamModel[] = [];
    private _httpVerbs:HttpVerbModel[] = [];
    private _config:LambdaConfig;

    /**
     * API Properties
     */
    private _postConstructorMethod;

    private _preLambdaTimeoutMethod:string;
    private _preLambdaTimeoutTime:number;
    private _preLambdaCallbackMethod:string;

    /**
     * Lambda Properties
     */
    private _eventProperty;
    private _eventContextProperty;
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
    private _stageVariablesProperty;

    private _anyMethod;

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

    get eventContextProperty() {
        return this._eventContextProperty;
    }

    set eventContextProperty(value) {
        this._eventContextProperty = value;
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

    get anyMethod() {
        return this._anyMethod;
    }

    set anyMethod(value) {
        this._anyMethod = value;
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

    get preLambdaTimeoutMethod(): string {
        return this._preLambdaTimeoutMethod;
    }

    set preLambdaTimeoutMethod(value: string) {
        this._preLambdaTimeoutMethod = value;
    }

    get preLambdaTimeoutTime(): number {
        return this._preLambdaTimeoutTime;
    }

    set preLambdaTimeoutTime(value: number) {
        this._preLambdaTimeoutTime = value;
    }

    get preLambdaCallbackMethod(): string {
        return this._preLambdaCallbackMethod;
    }

    set preLambdaCallbackMethod(value: string) {
        this._preLambdaCallbackMethod = value;
    }

    get paths(): Array<PathModel> {
        return this._paths;
    }

    set paths(value: Array<PathModel>) {
        this._paths = value;
    }

    get basePath(): string {
        return this._basePath;
    }

    set basePath(value: string) {
        this._basePath = value;
    }

    get pathParams(): PathParamModel[] {
        return this._pathParams;
    }

    set pathParams(value: PathParamModel[]) {
        this._pathParams = value;
    }

    get httpVerbs(): HttpVerbModel[] {
        return this._httpVerbs;
    }

    set httpVerbs(value: HttpVerbModel[]) {
        this._httpVerbs = value;
    }

    get config(): LambdaConfig {
        return this._config;
    }

    set config(value: LambdaConfig) {
        this._config = value;
    }

    get stageVariablesProperty() {
        return this._stageVariablesProperty;
    }

    set stageVariablesProperty(value) {
        this._stageVariablesProperty = value;
    }

}
