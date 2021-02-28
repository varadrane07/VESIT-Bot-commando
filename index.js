const { CommandoClient } = require('discord.js-commando');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const client = new CommandoClient({
	commandPrefix: process.env.prefix,
	owner: '329909277818880011',
	invite: 'https://discord.gg/brapPEGjwg',
});

this.bot = client;

client.registry
	.registerGroups([
		['certis', 'Certificates group of Commands'],
		['misc', 'Miscellaneous Commands'],
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('the prefix &', { type: 'LISTENING' });
});

client.on('error', console.error);
client.login(process.env.bot_token);