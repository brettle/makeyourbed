/// <reference path="../../../../typings/meteor/node.d.ts"/>
/// <reference path="../../../../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../../../../typings/meteor-cucumber/meteor-cucumber.d.ts"/>
/// <reference path="../../../../typings/bluebird/bluebird.d.ts"/>
import mc = require('meteor-cucumber');
import url = require('url');
import chai = require('chai');
import Promise = require('bluebird');

interface MyWorld extends mc.World {
  listPath: string;
}

interface Value {
  immediate: number|Promise<number>,
  delayed: number|Promise<number>
}

interface ResolvedValue {
  immediate: number,
  delayed: number
}


'use strict';
function defineSteps() {

  function containsClass(c:string):string {
    return `contains(concat(' ', normalize-space(@class), ' '), ' ${c} ')`;
  }

  var self = <mc.StepDefinitions>this;
  // You can use normal require here, cucumber is NOT run in a Meteor context (by design)

  self.Given(/^I am a new user$/, function () {
    var self = <mc.World>this;
    // no callbacks! DDP has been promisified so you can just return it
    return self.ddp.call('reset'); // this.ddp is a connection to the mirror
  });

  self.When(new RegExp('^I navigate to "([^"]*)"$'), function (relativePath:string) {
    var self = <mc.World>this;
    // WebdriverIO supports Promises/A+ out the box, so you can return that too
    return self.browser. // this.browser is a pre-configured WebdriverIO + PhantomJS instance
      url(url.resolve(process.env.HOST, relativePath)); // process.env.HOST always points to the mirror
  });

  self.When(/^I look at the page$/, function () {
    var self = <mc.World>this;      // you can use chai-as-promised in step definitions also
    return self.browser;
  });

  self.Then(/^the actions are listed in descending order by sign\(immediate_value\), abs\(immediate_value\), abs\(delayed_value\)$/, function () {
    var self = <MyWorld>this;
    var values:Value[] = [];
    return self.browser.elements(`.//ul/li`).
      then( (result:mc.ElementsValue) =>
        Promise.each<mc.WebElement>(result.value, (elem:mc.WebElement) =>
          Promise.props(<Value>{
            immediate: (<any>self.browser.getElementIdText(elem.ELEMENT, `.//*[${containsClass("immediate_value")}]`)).
              catch( (err) => '0').
              then((s:string) => {
                var v:number = parseFloat(s);
                return isNaN(v) ? 0 : v;
              }),
            delayed: (<any>self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.delayed_value').webElement(elem).getText('.delayed_value')).
              then( (s:string) => {
                var v:number = parseFloat(s);
                return self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.details', 500, true).then(()=>v);
                })
          }).then((v:Value) => (values.push(v) || true) )
        )
      ).
      then( () => {
        for (var i = 0; i < values.length-1; i++) {
          function sign(x:number):number {
            return (x > 0) ? 1 : ((x < 0) ? -1 : 0);
          }
          var v0:ResolvedValue = <ResolvedValue>values[i];
          var v1:ResolvedValue = <ResolvedValue>values[i+1];

          console.log(`v[${i}].immediate: ${v0.immediate}`);
          console.log(`sign(v[${i}].immediate): ${sign(v0.immediate)}`);
          console.log(`v[${i+1}].immediate: ${v1.immediate}`);
          console.log(`sign(v[${i+1}].immediate): ${sign(v1.immediate)}`);
          console.log('');
          sign(v1.immediate).should.be.at.most(sign(v0.immediate));
          if (sign(v1.immediate) === sign(v0.immediate)) {
            Math.abs(v1.immediate).should.be.at.most(Math.abs(v0.immediate));
            if (Math.abs(v1.immediate) === Math.abs(v0.immediate))
              Math.abs(v1.delayed).should.be.at.most(Math.abs(v0.delayed));
          }
        }
        return this;
      });
    });

    self.Then(/^each action should have a short summary$/, function () {
      var self = <MyWorld>this;
      return self.browser.elements(`//ul/li`).
        then( (result:mc.ElementsValue) =>
          Promise.each<mc.WebElement>(result.value, (elem:mc.WebElement) =>
            self.browser.webElement(elem).getText('./div/div').should.eventually.exist));
    });

    self.When(/^each action should have a details link which displays the value of reaching the target by a deadline$/, function () {
      var self = <MyWorld>this;
      return self.browser.elements(`//ul/li`).
        then( (result:mc.ElementsValue) =>
          Promise.each<mc.WebElement>(result.value, (elem:mc.WebElement) =>
            self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.delayed_value').webElement(elem).getText('.details').
            should.eventually.match(/(\+|-)?\d+(\.\d*)?.* if you .* (by |today|this (week|month|year))/).
            webElement(elem).click('*=Details').webElement(elem).waitForVisible('.details', 500, true)));
    });
}

export = defineSteps;
