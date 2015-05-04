/// <reference path="../chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../bluebird/bluebird.d.ts"/>

declare module "meteor-cucumber" {
  interface WebElement {
    ELEMENT: string;
  }

  interface WebdriverIO<T> extends Promise<T>{
    url(url: string): WebdriverIO<T>;
    waitForVisible(text: string): WebdriverIO<T>;
    getTitle(): WebdriverIO<string>;
    getText(selector: string): WebdriverIO<string>;
    isExisting(selector: string): WebdriverIO<boolean>;
    elements(selector: string): WebdriverIO<WebElement[]>;
    elements(selector: string, callback:(err:Error, result:any) => void): void;
    element(selector: string, callback:(err:Error, result:any) => void): void;
    elementIdElements(id:string, selector: string, callback:(err:Error, result:any) => void): void;
    elementIdText(id: string, callback:(err:Error, result:any) => void): void;
    elementIdText(id: string): WebdriverIO<string>;
    elementIdElement(id: string, selector: string, callback:(err:Error, result:any) => void): void;
    elementIdElement(id: string, selector: string): WebdriverIO<WebElement>;
    addCommand(cmd: string, cb: Function): void;
    getElementIds(id: string, selector: string): WebdriverIO<string[]>;
    getElementIds(selector: string): WebdriverIO<string[]>;
    getElementId(id: string, selector: string): WebdriverIO<string>;
    getElementId(selector: string): WebdriverIO<string>;
    getElementIdText(id: string, selector: string): WebdriverIO<string>;
    getElementIdText(selector: string): WebdriverIO<string>;
    get(propName: string): WebdriverIO<any>;
  }

  interface DdpClient {
    callAsync(method: string, args: any[]): Promise<DdpClient>;
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
}
