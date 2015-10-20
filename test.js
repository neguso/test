var messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
	Meteor.subscribe('messages');

	Template.body.helpers({
		status: function() { return Meteor.status().status; }
	});

	Template.messagesboard.helpers({
		messages: function() {
			return messages.find({}, { sort: { timestamp: 1 } })
				.map(function(message) {
					message.time = moment(message.timestamp).calendar();
					return message;
				});
		}
  });

  Template.messagesinput.events({
    'click button': function () {
			var input = Template.instance().find('input');
			Meteor.call('insert', input.value);
			input.value = '';
    },
		'keypress input': function(event) {
			if(event.charCode === 13)
			{
				Meteor.call('insert', event.target.value);
				event.target.value = '';
			}
		}
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
		messages.remove({});
		Meteor.publish('messages', function() { return messages.find({}, { sort: { timestamp: -1 }, limit: 5 }); });
  });

	Meteor.methods({
		insert: function(text) {
			messages.insert({ text: text, timestamp: new Date() });
		}

	});
}
