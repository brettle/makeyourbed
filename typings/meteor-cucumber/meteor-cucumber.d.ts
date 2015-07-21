/// <reference path="../chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../bluebird/bluebird.d.ts"/>

declare module "meteor-cucumber" {
  interface WebElement {
    ELEMENT: string;
  }

  interface ParsedCssValue {
    type:string;
    hex?:string;
    rgba?:string;
    alpha?:number;
    string?:string;
    unit?:string;
    value?:any;
  }

  interface CssValue {
    property:string;
    value:string;
    parsed:ParsedCssValue;
  }

  interface ElementsValue {
    value:WebElement[];
  }

  interface ElementValue {
    value:WebElement;
  }
  interface WebdriverIO<T> extends Promise<T>{
    url(url: string): WebdriverIO<T>;
    waitForVisible(text: string): WebdriverIO<T>;
    getTitle(): WebdriverIO<string>;
    getText(selector: string): WebdriverIO<string>;
    isExisting(selector: string): WebdriverIO<boolean>;
    elements(selector: string): WebdriverIO<ElementsValue>;
    elements(selector: string, callback:(err:Error, result:any) => void): void;
    element(selector: string): WebdriverIO<ElementValue>;
    element(selector: string, callback:(err:Error, result:any) => void): void;
    elementIdElements(id:string, selector: string): WebdriverIO<WebElement[]>;
    elementIdElements(id:string, selector: string, callback:(err:Error, result:any) => void): void;
    elementIdText(id: string, callback:(err:Error, result:any) => void): void;
    elementIdText(id: string): WebdriverIO<string>;
    elementIdCssProperty(id:string, property:string, callback:(err:Error, result:any) => void): void;
    elementIdCssProperty(id: string, property:string): WebdriverIO<CssValue>;
    elementIdElement(id: string, selector: string, callback:(err:Error, result:any) => void): void;
    elementIdElement(id: string, selector: string): WebdriverIO<WebElement>;
    addCommand(cmd: string, cb: Function, override?: boolean): void;
    getElementIds(id: string, selector: string): WebdriverIO<string[]>;
    getElementIds(selector: string): WebdriverIO<string[]>;
    getElementId(id: string, selector: string): WebdriverIO<string>;
    getElementId(selector: string): WebdriverIO<string>;
    getElementIdText(id: string, selector: string): WebdriverIO<string>;
    getElementIdText(selector: string): WebdriverIO<string>;
    getElementIdCssProperty(id:string, selector:string, property:string): WebdriverIO<ParsedCssValue>;
    getElementIdCssProperty(selector:string, property:string): WebdriverIO<ParsedCssValue>;
    webdrivercss(name:string, optionArray:WebdriverCSSOptionBase[]);
    get(propName: string): WebdriverIO<any>;
  }

  interface DdpClient {
    call(method: string, ...args: any[]): Promise<DdpClient>;
  }

  interface StepDefinitionCode {
    (...stepArgs: any[]): Promise.Thenable<Object>|Object;
  }

  export interface StepDefinitions {
    Given(pattern:RegExp|string, code: StepDefinitionCode): void;
    When(pattern:RegExp|string, code: StepDefinitionCode): void;
    Then(pattern:RegExp|string, code: StepDefinitionCode): void;
  }

  interface Hook {
    (callback: Function): void;
  }

  export interface Hooks {
    Before(code: Hook): void;
  }

  export interface World {
    ddp: DdpClient;
    browser: WebdriverIO<any>;
  }

  interface WebdriverCSSOptionBase {
    name:string;
    exclude?:string[]|Object[];
    hide?:string[];
    remove?:string[];
  }

  interface WebdriverCSSSelectorOptions extends WebdriverCSSOptionBase {
    elem:string;
  }

  interface WebdriverCSSRegionOptions extends WebdriverCSSOptionBase {
    width:number;
    height:number;
    x:number;
    y:number;
  }

}
