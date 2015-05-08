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
      var cb = <Function>arguments[arguments.length-1];
      if (arguments.length === 2) {
        selector = id;
        self.elements(selector, handleResult);
      } else {
        self.elementIdElements(id, selector, handleResult);
      }
      function handleResult(err:Error, result:any): void {
        if (err)
          cb(err, result);
        else {
          var ids:string[] = [];
          for (var i = 0; i < result.value.length; i++) {
            ids.push(result.value[i].ELEMENT);
          }
          cb(err, ids);
        }
        return;
      }
    });
    self.browser.getElementIds = <any>Promise.promisify(self.browser.getElementIds);

    self.browser.addCommand('getElementId', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      var cb = <Function>arguments[arguments.length-1];
      console.log(`getElementId(${arguments})`);
      if (arguments.length === 2 || selector == undefined) {
        selector = id;
        id = null;
        self.element(selector, handleResult);
      } else {
        self.elementIdElement(id, selector, handleResult);
      }
      function handleResult(err:Error, result:any): void {
        if (err) {
          console.log(`err = ${JSON.stringify(err)}`);
          cb(err, result);
        }
        else if (!result)
          cb(new Error("No element matching id=${id} and selector=${selector}"), null);
        else
          cb(err, result.value.ELEMENT);
        return;
      }
    });
    self.browser.getElementId = <any>Promise.promisify(self.browser.getElementId);

    self.browser.addCommand('getElementIdText', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      var cb = <Function>arguments[arguments.length-1];
      self.getElementId(id, selector).then(handleResult).catch(function (err:Error) { cb(err); });
      function handleResult(id:string): void {
        self.elementIdText(id, function(err: Error, result: any): void {
          if (err)
            cb(err, result);
          else
            cb(err, result.value);
          return;
        });
      }
    });
    self.browser.getElementIdText = <any>Promise.promisify(self.browser.getElementIdText);

    self.browser.addCommand('getElementIdCssProperty', function(id:string, selector:string, property: string) {
      var self = <mc.WebdriverIO<any>>this;
      var cb = <Function>arguments[arguments.length-1];
      if (arguments.length === 3) {
        id = selector;
        selector = undefined;
      }
      self.getElementId(id, selector).then(handleResult).catch(function (err:Error) { cb(err); });
      function handleResult(id:string): void {
        self.elementIdCssProperty(id, property, function(err: Error, result: any): void {
          if (err)
            cb(err, result);
          else {
            console.log(`elementIdCssProperty(${id}) => ${JSON.stringify(result)}`);
            result = parseCSS([result], property);
            console.log(`After parsing: ${JSON.stringify(result)}`);
            cb(err, result.parsed);
          }
          return;
        });
      }
    });
    self.browser.getElementIdText = <any>Promise.promisify(self.browser.getElementIdText);

    cb();
  });
}

module.exports = defineHooks;
