/// <reference path="../../../../typings/meteor-cucumber/meteor-cucumber.d.ts"/>
/// <reference path="../../../../typings/bluebird/bluebird.d.ts"/>
import mc = require('meteor-cucumber');
import Promise = require('bluebird');

var parseCSS = require('webdriverio/lib/helpers/parseCSS.js');

'use strict';
function defineHooks():void
{
  var self = <mc.Hooks>this;
  this.Before(function(cb:Function):void {
    var self = <mc.World>this;
    self.browser.addCommand('getElementIds', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      if (arguments.length === 1) {
        selector = id;
        return self.elements(selector).then(handleResult);
      } else {
        return self.elementIdElements(id, selector).then(handleResult);
      }
      function handleResult(result:any): string[] {
        var ids:string[] = [];
        for (var i = 0; i < result.value.length; i++) {
          ids.push(result.value[i].ELEMENT);
        }
        return ids;
      }
    }, true);

    self.browser.addCommand('getElementId', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      if (arguments.length === 1 || selector == undefined) {
        selector = id;
        id = null;
        return self.element(selector).then(handleResult);
      } else {
        return self.elementIdElement(id, selector).then(handleResult);
      }
      function handleResult(result:any): string {
        if (!result)
          throw new Error("No element matching id=${id} and selector=${selector}");
        else
          return result.value.ELEMENT;
      }
    }, true);

    self.browser.addCommand('getElementIdText', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      return self.getElementId(id, selector).then(
        (id2:string) => {
          return self.elementIdText(id2).then(
            (result:any) => {
              return result.value;
              });
        });
    }, true);

    self.browser.addCommand('getElementIdCssProperty', function(id:string, selector:string, property: string) {
      var self = <mc.WebdriverIO<any>>this;
      if (arguments.length === 3) {
        id = selector;
        selector = undefined;
      }
      return self.getElementId(id, selector).then(
        (id2:string) => self.elementIdCssProperty(id2, property).then(
          (result:any) => parseCSS([result], property).parsed));
    }, true);

    self.browser.addCommand('webElement', (elem:mc.WebElement) => ({ value: elem }), true);

    cb();
  });
}

module.exports = defineHooks;
