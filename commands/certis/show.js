/* eslint-disable no-undef */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');
const embed = new MessageEmbed()
    .setTitle('VESIT Bot')
    .setColor('#eba210')
    .setFooter('Show command in use')
	.setThumbnail('https://imgur.com/xtiUoG1');

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'show',
			aliases: ['open', 'certificates', 'certificate', 'certi', 'certis'],
			group: 'certis',
			memberName: 'show',
			// eslint-disable-next-line quotes
			description: `Registers your information to the Bot's Database`,
            argsType: 'single',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10,
			},
		});
	}
    async run(message) {
		const discordID = message.author.id;
		const user = await db.collection('Users').where('discordID', '==', `${discordID}`).get();
		if (!user.empty) {
				let Year = 2020;
				let emailID = '2018.name.surname@ves.ac.in';
				const certificates = [];
				user.forEach(doc => {
					const userinfo = doc.data();
					emailID = doc.id;
					Year = parseInt(userinfo.joinYear);

				});
                embed.setDescription(`**Please Select the year of which you want to see your certificates.**\n
                **1️⃣ 1st Year**\nAcademic Year ${Year} - ${Year + 1}\n\n
                **2️⃣ 2nd Year**\nAcademic Year ${Year + 1} - ${Year + 2}\n\n
                **3️⃣ 3rd Year**\nAcademic Year ${Year + 2} - ${Year + 3}\n\n
                **4️⃣ 4th Year**\nAcademic Year ${Year + 3} - ${Year + 4}\n\n`);
			embed.setFooter('Type 1 to 4 to select year');
			message.embed(embed).then (() => {
				const filter = m => message.author.id === m.author.id;

				message.channel.awaitMessages(filter, { maxProcessed: 1, time: 30000, errors: ['You Ran out of time. Type show again'] })
				.then(async messages1 => {
					const certiYear = parseInt(messages1.first().content) - 1 + Year;
					const embed1 = new MessageEmbed()
						.setTitle('VESIT Bot')
						.setColor('#eba210')
						.setThumbnail('https://imgur.com/xtiUoG1');
					embed1.setDescription('Certificates are listed here');
					embed1.setFooter('To see a Particular Certificate, type its number.');
					const certiRef = db.collection('Users').doc(`${emailID}`).collection('Certificates');
					const snapshot = await certiRef.where('year', '==', certiYear).get();
					let count = 1;
					snapshot.forEach(doc => {
						const certi = doc.data();
						certificates.push(certi);
						embed1.addField(`${count}. ${certi.name}`, `${doc.id}`);
						count++;
					});
					if (snapshot.empty) {
						embed1.setDescription('You didnt receive any certificates');
						message.author.send(embed1);
						message.channel.messages.fetch({ limit: 3 }).then((results) => message.channel.bulkDelete(results));
						return;
					}
					message.embed(embed1).then (() => {
						const filter2 = m => message.author.id === m.author.id;
						message.channel.awaitMessages(filter2, { maxProcessed: 1, time: 30000, errors: ['You Ran out of time. Type show again'] })
							.then(async messages => {
								const reqCertino = parseInt(messages.first().content) - 1;
								const embed2 = new MessageEmbed()
									.setTitle(`${certificates[reqCertino].name}`)
									.setDescription(`[Certificate Link](${certificates[reqCertino].link})`)
									.setImage(certificates[reqCertino].link)
									.setFooter('Show command used.')
									.setColor('#ed9d09')
									.setThumbnail('https://imgur.com/xtiUoG1');
								message.channel.messages.fetch({ limit: 5 }).then((results) => message.channel.bulkDelete(results));
								messages.first().author.send(embed2);

							});
					});
				})
				.catch(() => {
					embed.setDescription('There was an error, please try again');
					message.author.send(embed);
				});
			});
		}
    }
};