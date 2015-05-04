/// <reference path="../../../../typings/meteor/node.d.ts"/>
/// <reference path="../../../../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../../../../typings/chai/chai-should.d.ts"/>
/// <reference path="../../../../typings/meteor-cucumber/meteor-cucumber.d.ts"/>
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

'use strict';
function defineSteps() {
  var self = <mc.StepDefinitions>this;
  var listPathTemplate = '//text()[contains(.,"${listName}:")]/../following-sibling::ol[1]';
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

  self.When(/^I look at the page$/, function () {
    var self = <mc.World>this;      // you can use chai-as-promised in step definitions also
    return self.browser;
  });

  self.Then(/^I see a (Do|Don't) list$/, function (listName:string) {
    var self = <mc.World>this;
    var listPath = listPathTemplate.replace("${listName}", listName);
    return self.browser.
      isExisting(listPath).should.eventually.be.true;
  });

  self.When(/^I look at the (Do|Don't) list$/, function (listName:string) {
    var self = <MyWorld>this;
    self.listPath = listPathTemplate.replace("${listName}", listName);
    return self.browser.
      isExisting(self.listPath).should.eventually.be.true;
  });


  self.Then(/^it is ordered by descending( absolute)? immediate value and then by descending( absolute)? delayed value$/, function (column:number, label:string) {
    var self = <MyWorld>this;
    var elementsPromise = Promise.promisify(self.browser.elements, self.browser);
    var elementIdElementPromise = Promise.promisify(self.browser.elementIdElement, self.browser);
    var elementIdTextPromise = Promise.promisify(self.browser.elementIdText, self.browser);
    return elementsPromise(`${self.listPath}/li`).
      then(function(state:any) { return state.value; }).
      map(function(e:mc.WebElement) {
          return Promise.props(<Value>{
            immediate: (<any>elementIdElementPromise(e.ELEMENT, './details/summary/*[@class="immediate_value"]')).
              get('value').
              get('ELEMENT').
              then(function(id:string) {
                return elementIdTextPromise(id);
              }).
              then(function (state:any) {
                var s:string = state.value;
                var v:number = Math.abs(parseFloat(s));
                console.log(`immediate: state=${state}, s=${s}, v=${v}`);
                return isNaN(v) ? 0 : v;
              }).
              catch(function () { return 0; }),
            delayed: (<any>elementIdElementPromise(e.ELEMENT, './details/*[@class="delayed_value"]')).
              get('value').
              get('ELEMENT').
              then(function(id:string) {
                return elementIdTextPromise(id);
              }).
              then(function (state:any) {
                var s:string = state.value;
                var v:number = Math.abs(parseFloat(s));
                console.log(`delayed: state=${state}, s=${s}, v=${v}`);
                return v;
                })
          })
        }).
      all().
      tap(console.log).
      then(function (values:Value[]) {
        for (var i = 0; i < values.length-1; i++) {
          values[i+1].immediate.should.be.at.most(<number>(values[i].immediate));
          if (values[i+1].immediate === values[i].immediate) {
            values[i+1].delayed.should.be.at.most(<number>(values[i].delayed));
          }
        }
        return this;
      });
    });

    self.Then(/^each action should have a short summary$/, function () {
      var self = <MyWorld>this;
      var elementsPromise = Promise.promisify(self.browser.elements, self.browser);
      var elementIdElementPromise = Promise.promisify(self.browser.elementIdElement, self.browser);
      var elementIdTextPromise = Promise.promisify(self.browser.elementIdText, self.browser);
      return (<any>elementsPromise(`${self.listPath}/li`)).
        get('value').
        map(function(e:mc.WebElement) {
          return (<any>elementIdElementPromise(e.ELEMENT, './details/summary')).
            get('value').
            get('ELEMENT').
            then(function (id:string) {
              return elementIdTextPromise(id);
            }).
            get('value').
            should.eventually.exist;
          }).
        all();
      });
}

export = defineSteps;
