Meteor.publish('messages', function() { return messages.find({}, { sort: { timestamp: -1 }, limit: 5 }); });
