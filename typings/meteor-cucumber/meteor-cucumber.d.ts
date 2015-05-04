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
    elementIdText(id: string): WebdriverIO<string>;
    elementIdElement(id: string, selector: string): WebdriverIO<WebElement>;
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

  export interface World {
    ddp: DdpClient;
    browser: WebdriverIO<any>;
  }
}
