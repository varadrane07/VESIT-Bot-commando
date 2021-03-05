const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');
const embed = new MessageEmbed()
    .setTitle('VESIT Bot')
    .setColor('#eba210')
    .setFooter('Register command in use')
    .setThumbnail('https://imgur.com/xtiUoG1');

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'register',
			aliases: ['reg', 'signup', 'signin', 'login'],
			group: 'certis',
			memberName: 'register',
			// eslint-disable-next-line quotes
			description: "Registers your information to the Bot's Database",
            argsType: 'single',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10,
            },
		});
    }

    async run(message, args) {
        if(!args) {
            embed.setDescription('You didnt provide an Email, please type your VES Email after `register`');
            message.embed(embed);
            message.delete({ timeout: 5000 });
            return;
        }
        // Setting variables to be stored in Firebase
        else {
            const discordID = message.author.id;
            const emailID = args;

            // Verify College Domain
            if(!emailID.endsWith('@ves.ac.in')) {
                embed.setDescription('Please use your VES mail id to register');
                message.embed(embed);
                message.delete({ timeout: 5000 });
                return;
            }

            // find a user wih the discordID and save it in the variable regMember, then use promise to update the email/ add the new email
            const user = await db.collection('Users').doc(emailID).get();
            if (!user.exists) {
                embed.setDescription(`Email ID : ${emailID}\n
                    Please type below the year you joined college, for eg: 2020`);
                embed.setFooter(`${emailID} is using register command`);
                message.embed(embed).then(() => {
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['You Ran out of time. Start again'] })
                        .then(messages1 => {
                            const joinYear = messages1.first().content;
                            console.log(joinYear);
                            const data = {
                                discordID: discordID,
                                joinYear: joinYear,
                            };
                            // eslint-disable-next-line no-unused-vars
                            const setYear = db.collection('Users').doc(emailID).set(data);
                            embed.setDescription(`EmailID : **${emailID}**\n
                                Year of Joining : **${joinYear}**\n
                                **You have been registered Successfully**`);
                            embed.addField('To see your Certificates, use the &show Command', 'To see other commands, use &help');
                            message.channel.messages.fetch({ limit: 3 }).then((results) => message.channel.bulkDelete(results));
                            message.author.send(embed);
                        });
                    });
            }
            else {
                embed.setDescription('You have already Registered');
                message.author.send(embed);
            }
        }
    }
};