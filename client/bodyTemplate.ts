/// <reference path="../typings/meteor/meteor.d.ts"/>

var bodyTemplate: Template = Template["body"];
bodyTemplate.helpers({
  activities: [
    {
      index: 0,
      immediate: {
        description: 'Drink a can of Coke',
        "class": "positive",
        value: 1
      },
      delayed: {
        description: 'drink 1 can of coke today',
        value: 1.5
      }
    },
    {
      index: 1,
      immediate: {
        description: 'Drink a cup of coffee',
        "class": "positive",
        value: 1
      },
      delayed: {
        description: 'drink 1 cup of coffee today',
        value: 1
      }
    },
    {
      index: 2,
      immediate: {
        description: 'Smoke a cigar',
        "class": "zero",
        value: 0
      },
      delayed: {
        description: 'smoke 2 cigars today',
        value: -1.5
      }
    },
    {
      index: 3,
      immediate: {
        description: 'Smoke a cigarette',
        "class": "negative",
        value: -1.5
      },
      delayed: {
        description: 'smoke 1 cigarette today',
        value: -1.5
      }
    }
  ]
});
