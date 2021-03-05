const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

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
        const embed = new MessageEmbed()
            .setTitle('VESIT Certificate Bot')
            .setColor('#eba210')
            .setFooter('Register command in use')
            .setThumbnail('https://imgur.com/xtiUoG1.png');
        if(!args) {
            message.delete();
            embed.setDescription(`🛑 Oops, you didnt provide an Email 🛑\n
            ➥ Correct command is: ${process.env.prefix}register [VES_email]`);
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 10000 });
            });
            return;
        }
        // Setting variables to be stored in Firebase
        else {
            const discordID = message.author.id;
            const emailID = args;

            // Verify College Domain
            if(!emailID.endsWith('@ves.ac.in')) {
                embed.setDescription('❕ Please use your VES EmailID to register ❕');
                message.delete();
                message.reply(embed).then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            }

            // find a user wih the discordID and save it in the variable regMember, then use promise to update the email/ add the new email
            const user = await db.collection('Users').doc(emailID).get();
            if (!user.exists) {
                embed.setDescription(`${message.author.username} is Registering...`);
                embed.addField(`✅ **Email ID : ${emailID}**`, '☝ Check your email again');
                embed.addField('❕ Join Year: ', 'Type your join year below this message\n*eg. 2020*');
                message.delete();
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
                            embed.setDescription(`${message.author.username} has **Registered Successfully**👍`);
                            embed.spliceFields(1, 1, [{ name: `✅ Join Year: ${joinYear}`, value: '👆 Check your Joining Year too' }]);
                            embed.addField(`Use ${process.env.prefix}show to see your certificates, and ${process.env.prefix}help to see all commands`);
                            embed.setFooter('Register command in use');
                            message.channel.messages.fetch({ limit: 2 }).then((results) => message.channel.bulkDelete(results));
                            message.author.send(embed);
                        });
                    });
            }
            else {
                embed.setDescription('❕ You have already Registered');
                message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
                message.author.send(embed);
            }
        }
    }
};