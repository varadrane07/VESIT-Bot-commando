const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: process.env.prefix,
	owner: '329909277818880011',
	invite: 'https://discord.gg/brapPEGjwg',
});

client.registry
	.registerDefaultTypes()
	.registerDefaultCommands()
	.registerDefaultGroups()
	.registerGroups([
		['certis', 'Certificates group of Commands'],
		['misc', 'Miscellaneous Commands'],
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('bot prefix is `&`');
});

client.on('error', console.error);

client.login(process.env.bot_token);