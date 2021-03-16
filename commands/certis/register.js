const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'register',
			aliases: ['reg', 'signup', 'signin', 'login', 'r'],
			group: 'certis',
			memberName: 'register',
			// eslint-disable-next-line quotes
			description: "Registers your information to the Bot's Database",
            argsType: 'single',
            throttling: {
                usages: 2,
                duration: 10,
            },
		});
    }

    async run(message, args) {
        const embed = new MessageEmbed()
            .setTitle('VESIT Certificate Bot')
            .setColor('#eba210')
            .setFooter('Register command in use')
            .setThumbnail('https://imgur.com/xtiUoG1.png')
            .setTimestamp();
        if(!args) {
            message.delete();
            embed.setDescription(`🛑 Oops, you didnt provide an Email\n\n➥ Correct command is: \`${process.env.prefix}register [VES_Email]\``);
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 15000 });
            });
            return;
        }
        // Setting variables to be stored in Firebase
        else {
            const discordID = message.author.id;
            const emailID = args;

            // Verify College Domain
            if(!emailID.endsWith('@ves.ac.in')) {
                embed.setDescription(`❕ Please use your VES EmailID to register ❕\n➥ Correct command is: \`${process.env.prefix}register [VES_Email]\``);
                message.delete();
                message.reply(embed).then(msg => {
                    msg.delete({ timeout: 15000 });
                });
                return;
            }

            // find a user wih the discordID and save it in the variable regMember, then use promise to update the email/ add the new email
            const user = await db.collection('Users').where('discordID', '==', discordID).get();
            if (user.empty) {
                embed.setDescription(`${message.author.username} is Registering...\n\n✅ **Email ID : ${emailID}**\n☝ Check your email again\n\n❕ Join Year: \n**Type your join year below this message**\n*eg. 2020*`);
                message.delete();
                message.embed(embed).then(() => {
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['You Ran out of time. Start again'] })
                        .then(messages1 => {
                            const joinYear = messages1.first().content;
                            const data = {
                                discordID: discordID,
                                joinYear: joinYear,
                            };
                            // eslint-disable-next-line no-unused-vars
                            const setYear = db.collection('Users').doc(emailID).set(data);
                            embed.setDescription(`${message.author.username} has **Registered Successfully**👍\n\n✅ **Email ID : ${emailID}**\nYour certificates with this email will be shown to you\n\n✅ Join Year: ${joinYear}`);
                            embed.addField('What to do next?', `Use \`${process.env.prefix}show\` to see your certificates, and \`${process.env.prefix}help\` to see all commands`);
                            embed.setFooter('Register command used');
                            message.channel.messages.fetch({ limit: 2 }).then((results) => message.channel.bulkDelete(results));
                            message.author.send(embed);
                        });
                    });
            }
            else {
                let registeredmail = String;
                let regdiscordID = String;
                let join = String;
                user.forEach(doc => {
                    const userInfo = doc.data();
                    registeredmail = doc.id;
                    regdiscordID = userInfo.discordID;
                    join = userInfo.joinYear;
                });
                embed.setDescription(`❕ **You have already Registered with the following credentials**\n\nEmail ID: \`${registeredmail}\`\nJoining Year : \`${join}\`\nDiscord Username : <@!${regdiscordID}>\n\nUse the \`${process.env.prefix}show\` command to see your certificates.`);
                message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
                message.channel.send(embed).then(msg => {
                    msg.delete({ timeout: 20000 });
                });
            }
        }
    }
};