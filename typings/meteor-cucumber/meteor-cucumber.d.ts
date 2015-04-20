/// <reference path="../chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../bluebird/bluebird.d.ts"/>

declare module "meteor-cucumber" {
  interface WebdriverIO {
    url(url: string): WebdriverIO;
    call(callback: Promise.Thenable<WebdriverIO>): WebdriverIO;
    waitForVisible(text: string): WebdriverIO;
    getTitle(): WebdriverIO;
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
    browser: WebdriverIO;
  }
}
