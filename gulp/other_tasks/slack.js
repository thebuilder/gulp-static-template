var SLACK_DOMAIN = process.env.SLACK_DOMAIN || "SLACK_DOMAIN";
var SLACK_TOKEN = process.env.SLACK_TOKEN || "SLACK_TOKEN";

var defaultChannel = "#default_channel";

/**
 * Send a message to a Slack channel.
 * text {string} - The text to send to Slack
 * attachments {object} [] - See https://api.slack.com/docs/attachments for a full list of valid attachments
 * done {function} [] - Callback function
 */
function sendMessage(text, attachment, done) {
	//Get imports
	var Slack = require('node-slack');
	var gutil = require('gulp-util');

	if (!text) {
		gutil.log(gutil.colors.red('No text supplied'));
		return;
	}

	//Create Slack instance
	var slack = new Slack(SLACK_DOMAIN, SLACK_TOKEN);

	//Create the message object, that will be sent to Slack.
	var message = {
		text: text
	};

	//Set the channel and user name
	message.username = attachment.username || process.env.USER || 'Gulp';
	message.channel = attachment.channel || defaultChannel; //Set the default channel here.

	//Log to console that the message is sent to Slack
	gutil.log(gutil.colors.blue(message.channel) + " - " + message.text);

	return slack.send(message, done);
}

module.exports = sendMessage;