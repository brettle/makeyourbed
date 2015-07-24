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

'use strict';
function defineSteps() {

  function containsClass(c:string):string {
    return `contains(concat(' ', normalize-space(@class), ' '), ' ${c} ')`;
  }

  var self = <mc.StepDefinitions>this;
  var listPathTemplate = '//text()[contains(.,"${listName}:")]/../following-sibling::ul[1]';
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

  self.Then(new RegExp("^I see a (Do|Don't) list$"), function (listName:string) {
    var self = <mc.World>this;
    var listPath = listPathTemplate.replace("${listName}", listName);
    return self.browser.
      isExisting(listPath).should.eventually.be.true;
  });

  self.When(new RegExp("^I look at the (Do|Don't) list$"), function (listName:string) {
    var self = <MyWorld>this;
    self.listPath = listPathTemplate.replace("${listName}", listName);
    return self.browser.
      isExisting(self.listPath).should.eventually.be.true;
  });


  self.Then(/^it is ordered by descending( absolute)? immediate value and then by descending( absolute)? delayed value$/, function (column:number, label:string) {
    var self = <MyWorld>this;
    var values:Value[] = [];
    return self.browser.elements(`${self.listPath}/li`).
      then( (result:mc.ElementsValue) =>
        Promise.each<mc.WebElement>(result.value, (elem:mc.WebElement) =>
          Promise.props(<Value>{
            immediate: (<any>self.browser.getElementIdText(elem.ELEMENT, `.//*[${containsClass("immediate_value")}]`)).
              catch( (err) => '0').
              then((s:string) => {
                var v:number = Math.abs(parseFloat(s));
                return isNaN(v) ? 0 : v;
              }),
            delayed: (<any>self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.delayed_value').webElement(elem).getText('.delayed_value')).
              then( (s:string) => {
                var v:number = Math.abs(parseFloat(s));
                return self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.details', 500, true).then(()=>v);
                })
          }).then((v:Value) => (values.push(v) || true) )
        )
      ).
      then( () => {
        for (var i = 0; i < values.length-1; i++) {
          values[i+1].immediate.should.be.at.most(<number>(values[i].immediate));
          if (values[i+1].immediate === values[i].immediate) {
            values[i+1].delayed.should.be.at.most(<number>(values[i].delayed));
          }
        }
        return this;
      });
    });

    self.Then(/^each action has a (green|red) checkbox to its left$/, function (color:string) {
      var self = <MyWorld>this;
      var colorRegExp:RegExp;
      require('webdrivercss').init(self.browser);
      self.browser.webdrivercss = <any>Promise.promisify(self.browser.webdrivercss);

      var lisXpath:string = `${self.listPath}/li`;
      return self.browser.getElementIds(lisXpath).then( (ids:string[]) => {
        var selectorOptsArray:mc.WebdriverCSSSelectorOptions[] = [];
        var names:string[] = [];
        for (let i = 0; i < ids.length; i++) {
          var liXpath = `${lisXpath}[position()=${i+1}]`;
          var detailsXpath = `${liXpath}/div`;
          names.push(`${i+1}`);
          selectorOptsArray.push({
            name: `${i+1}`,
            elem: liXpath,
            exclude: [detailsXpath]
          });
        }
        return self.browser.webdrivercss(color, selectorOptsArray).
          then( (res) => {
            names.forEach(function(name:string) {
              res[name].length.should.equal(1);
              res[name][0].isWithinMisMatchTolerance.should.be.true;
            });
          });
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
            (<any>self.browser.webElement(elem).click('*=Details').webElement(elem).waitForVisible('.delayed_value').webElement(elem).getText('.details').
            should.eventually.match(/(\+|-)?\d+(\.\d*)?.* if you .* (by |today|this (week|month|year))/)).
            webElement(elem).click('*=Details').webElement(elem).waitForVisible('.details', 500, true)));
    });
}

export = defineSteps;
