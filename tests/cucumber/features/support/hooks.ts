/// <reference path="../../../../typings/meteor-cucumber/meteor-cucumber.d.ts"/>
/// <reference path="../../../../typings/bluebird/bluebird.d.ts"/>
import mc = require('meteor-cucumber');
import Promise = require('bluebird');

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
        if (err) return cb(err, result);
        var ids:string[] = [];
        for (var i = 0; i < result.value.length; i++) {
          ids.push(result.value[i].ELEMENT);
        }
        cb(err, ids);
      }
    });
    self.browser.getElementIds = <any>Promise.promisify(self.browser.getElementIds);

    self.browser.addCommand('getElementId', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      var cb = <Function>arguments[arguments.length-1];
      if (arguments.length === 2) {
        selector = id;
        id = null;
        self.element(selector, handleResult);
      } else {
        self.elementIdElement(id, selector, handleResult);
      }
      function handleResult(err:Error, result:any): void {
        if (err) return cb(err, result);
        if (!result) return cb(new Error("No element matching id=${id} and selector=${selector}"), null);
        cb(err, result.value.ELEMENT);
      }
    });
    self.browser.getElementId = <any>Promise.promisify(self.browser.getElementId);

    self.browser.addCommand('getElementIdText', function(id:string, selector:string) {
      var self = <mc.WebdriverIO<any>>this;
      var cb = <Function>arguments[arguments.length-1];
      self.getElementId(id, selector).then(handleResult).catch(function (err:Error) { cb(err); });
      function handleResult(id:string): void {
        self.elementIdText(id, function(err: Error, result: any): void {
          if (err) return cb(err, result);
          cb(err, result.value);
        });
      }
    });
    self.browser.getElementIdText = <any>Promise.promisify(self.browser.getElementIdText);

    cb();
  });
}

module.exports = defineHooks;
