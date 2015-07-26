/// <reference path="../typings/meteor/meteor.d.ts"/>

var activityTemplate: Template = Template["activity"];

activityTemplate.events({
  'click .immediate_value': function (e:Meteor.Event, t:Blaze.TemplateInstance):void {
    var vElem:JQuery = t.$('.immediate_value');
    var clone:JQuery = vElem.clone().insertBefore(vElem).
      css('position', 'absolute').animate($("#score").offset(), () => {
        clone.fadeOut(100, () => {
          clone.remove();
        })
      });
  }
});
