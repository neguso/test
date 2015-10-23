if (Meteor.isClient) {

	var f = new ReactiveVar(null);

	Meteor.startup(function () {
		console.log('client start');
		Meteor.subscribe('messages');
		Meteor.call('file', function(err, result) { if(err) f.set('error'); f.set(result); });

		Meteor.subscribe('Projects');
		Meteor.subscribe('Tasks');

		Session.setDefault('page', 0);
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

	Template.projects.helpers({
		page: function(){ return Session.get('page'); },
		projects: function() {
			return Projects.find({}, { skip: 5 * Session.get('page'), limit: 5 });
		}
	});

	Template.pages.helpers({
		'pages': function(){
			var ary = [], n = Projects.find({}).count() / 5;
			for(var i = 0; i < n; i++)
				ary.push({ page: i.toString(), active:  });
			//return new ReactiveVar(ary);
			return ary;
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
