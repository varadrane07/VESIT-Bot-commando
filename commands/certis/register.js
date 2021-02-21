const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

const embed = new MessageEmbed()
    .setTitle('VESIT Bot')
    .setColor('#eba210')
    .setFooter('Register command in use');

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'register',
			aliases: ['reg', 'signup', 'signin'],
			group: 'certis',
			memberName: 'register',
			// eslint-disable-next-line quotes
			description: `Registers your information to the Bot's Database`,
            argsType: 'single',
		});
	}

    async run(message, args) {
        if(!args) {
            embed.setDescription('You didnt provide an Email, please type your VES Email after `register`');
            return message.reply(embed);
        }
        // Setting variables to be stored in Firebase
        else {
            const discordID = message.author.id;
            const emailID = args;
            const joinYear = args.substring(0, 4);

            // Verify College Domain
            if(!emailID.endsWith('@ves.ac.in')) {
                embed.setDescription('Please use your VES mail id to register');
                return message.reply(embed);
            }

            // find a user wih the discordID and save it in the variable regMember, then use promise to update the email/ add the new email
            let regMember;
            // Once user updated in database
            embed.setDescription('You have been registered successfully')
                .setFooter('Registration Completed');
            return message.reply(embed);
        }
    }
};