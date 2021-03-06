const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['av', 'display'],
			group: 'misc',
			memberName: 'avatar',
			description: 'Shows your Avatar',
		});
	}

	run(message) {
		let user = message.mentions.users.first();
		if (!user) user = message.author;
		console.log(this);
		const embed = new MessageEmbed()
			.setImage(
				user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
			.setTitle(user.username)
			.setColor('#fffffe');
		return message.embed(embed);
	}
};