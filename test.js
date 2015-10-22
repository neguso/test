if (Meteor.isClient) {

	var f = new ReactiveVar(null);

	Meteor.startup(function () {
		console.log('client start');
		Meteor.subscribe('messages');
		Meteor.call('file', function(err, result) { if(err) f.set('error'); f.set(result); });
	});

	Meteor.methods({
		data: function() { console.log('data'); }
	});

	Template.body.helpers({
		status: function() { return Meteor.status().status; },
		file: function() { return f.get(); }
	});

	Template.body.onRendered(function() {
		// Initialize collapse button
		$(".button-collapse").sideNav();
		// Initialize collapsible (uncomment the line below if you use the dropdown variation)
		//$('.collapsible').collapsible();

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
    'click button': function (event, template) {
			var input = template.find('input');
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

	Meteor.methods({
		insert: function(text) {
			messages.insert({ text: text, timestamp: new Date() });
		},
		file: function() { return Assets.getText('data.txt'); }
	});
}
