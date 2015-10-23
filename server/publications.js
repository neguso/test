Meteor.publish('messages', function() { return messages.find({}, { sort: { timestamp: -1 }, limit: 5 }); });

Meteor.publish('Projects', function() { return Projects.find({}); });
Meteor.publish('Tasks', function() { return Tasks.find({}); });
