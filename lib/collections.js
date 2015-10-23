messages = new Mongo.Collection("messages");

Projects = new Mongo.Collection('projects');
Tasks = new Mongo.Collection('tasks');


if(Meteor.isServer)
{
	Meteor.startup(function() {

		if(Projects.find({}).count() === 0) {

			// seed projects collection
			for (let i = 0; i < 100; i++) {
				let id = Projects.insert({name: 'awesome project number ' + i.toString()});

				// seed tasks collection
				for (let j = 0; j < 50; j++ )
					Tasks.insert({ project: id, name: 'fabulous task ' + j.toString() });
			}
		}

	});
}
