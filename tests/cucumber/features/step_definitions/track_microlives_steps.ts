/// <reference path="../../../../typings/meteor/node.d.ts"/>
/// <reference path="../../../../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../../../../typings/chai/chai-should.d.ts"/>
/// <reference path="../../../../typings/meteor-cucumber/meteor-cucumber.d.ts"/>
import mc = require('meteor-cucumber');
import url = require('url');

interface MyWorld extends mc.World {
  rowSelector: string;
}

'use strict';
function defineSteps() {
  var self = <mc.StepDefinitions>this;
  // You can use normal require here, cucumber is NOT run in a Meteor context (by design)

  self.Given(/^I am a new user$/, function () {
    var self = <mc.World>this;
    // no callbacks! DDP has been promisified so you can just return it
    return self.ddp.callAsync('reset', []); // this.ddp is a connection to the mirror
  });

  self.When(/^I navigate to "([^"]*)"$/, function (relativePath:string) {
    var self = <mc.World>this;
    // WebdriverIO supports Promises/A+ out the box, so you can return that too
    return self.browser. // this.browser is a pre-configured WebdriverIO + PhantomJS instance
      url(url.resolve(process.env.HOST, relativePath)); // process.env.HOST always points to the mirror
  });

  self.When(/^I see the microlives table$/, function () {
    var self = <mc.World>this;      // you can use chai-as-promised in step definitions also
    return self.browser.
      waitForVisible('table.microlives');
  });

  self.Then(/^column (\d*) should be labeled "([^"]*)"$/, function (column:number, label:string) {
    var self = <mc.World>this;      // you can use chai-as-promised in step definitions also
    return self.browser.
      getText(`//table[@class='microlives']/tr/th[${column}]`).should.eventually.equal(label);
    });

  self.When(/^I look at "([^"]*)"$/, function (lifestyle:string) {
    var self = <MyWorld>this;
    self.rowSelector = `//table/tr/td[text()[contains(., '${lifestyle}')]]/..`;
    return self.browser.isExisting(self.rowSelector).should.eventually.be.true;
  });

  self.Then(/the Microlives column should say "([^"]*)"$/, function (microlives:string) {
    var self = <MyWorld>this;
    return self.browser.
      getText(`${self.rowSelector}/td[2]`).should.eventually.equal(microlives);
  });
}

export = defineSteps;
