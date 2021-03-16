/* eslint-disable no-undef */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'show',
			aliases: ['open', 'certificates', 'certificate', 'certi', 'certis', 's'],
			group: 'certis',
			memberName: 'show',
			// eslint-disable-next-line quotes
			description: `Registers your information to the Bot's Database`,
            argsType: 'single',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}
    async run(message) {
		const discordID = message.author.id;
		const embed = new MessageEmbed()
			.setTitle('VESIT Certificates Bot')
			.setColor('#eba210')
			.setThumbnail('https://imgur.com/xtiUoG1.png')
			.setTimestamp();
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
                embed.setDescription(`**Which year's Certificate you want to see ?**\n⚪ Type \`1\` for : **1st Year** (FE) ⚪\nAcademic Year ${Year} - ${Year + 1}\n\n🟢 Type \`2\` for : **2nd Year** (SE) 🟢\nAcademic Year ${Year + 1} - ${Year + 2}\n\n🔴 Type \`3\` for : **3rd Year** (TE) 🔴\nAcademic Year ${Year + 2} - ${Year + 3}\n\n🔵 Type \`4\` for : **4th Year** (BE) 🔵\nAcademic Year ${Year + 3} - ${Year + 4}\n\n`);
			message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
			message.embed(embed).then (() => {
				const filter = m => message.author.id === m.author.id;

				message.channel.awaitMessages(filter, { maxProcessed: 1, time: 30000, errors: ['time'] })
				.then(async messages1 => {
					const certiYear = parseInt(messages1.first().content) - 1 + Year;
					const embed1 = new MessageEmbed()
						.setTitle('VESIT Bot')
						.setColor('#eba210')
						.setTimestamp()
						.setThumbnail('https://imgur.com/xtiUoG1.png');
					embed1.setDescription('**Certificates are listed here**');
					embed1.setFooter('👆 To see a Particular Certificate, type its number.');
					const certiRef = db.collection('Users').doc(`${emailID}`).collection('Certificates');
					const snapshot = await certiRef.where('year', '==', certiYear).get();
					let count = 1;
					if (snapshot.empty) {
						// eslint-disable-next-line quotes
						embed1.setDescription(`🛑 You haven't received any certificates in that year\n\nPlease select another year using the \`${process.env.prefix}show\` command`);
						message.channel.messages.fetch({ limit: 2 }).then((results) => message.channel.bulkDelete(results));
						message.author.send(embed1);
						return;
					}
					snapshot.forEach(doc => {
						const certi = doc.data();
						certificates.push(certi);
						embed1.addField(`\`${count}.\` ${certi.name}`, `${certi.description}`);
						count++;
					});
					message.channel.messages.fetch({ limit: 2 }).then((results) => message.channel.bulkDelete(results));
					message.embed(embed1).then (() => {
						const filter2 = m => message.author.id === m.author.id;
						message.channel.awaitMessages(filter2, { maxProcessed: 1, time: 30000, errors: ['time'] })
							.then(async messages => {
								const reqCertino = parseInt(messages.first().content) - 1;
								const embed2 = new MessageEmbed()
									.setTitle(`🎉 ${certificates[reqCertino].name} 🎉`)
									.setDescription(`${certificates[reqCertino].description}\n\n[LinkedIN URL](${certificates[reqCertino].link})`)
									.setImage(certificates[reqCertino].link)
									.setFooter('Show command used.')
									.setColor('#ed9d09')
									.setTimestamp()
									.setThumbnail('https://imgur.com/xtiUoG1.png');
								message.channel.messages.fetch({ limit: 2 }).then((results) => message.channel.bulkDelete(results));
								messages.first().author.send(embed2);

							})
							.catch(() => {
								message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
								embed.setDescription(`❌ You didnt select a Certificate, use ${process.env.prefix}show command again and select a certificate`);
								message.author.send(embed).then(msg => {
									msg.delete({ timeout: 10000 });
								});
							});
					});
				})
				.catch(() => {
					message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
					embed.setDescription(`❌ You didnt type a year, use ${process.env.prefix}show command`);
					message.author.send(embed).then(msg => {
						msg.delete({ timeout: 10000 });
					});
				});
			});

		}
		else {
			embed.setDescription(`You are not registered. Use the ${process.env.prefix}register command to register first`);
			message.channel.messages.fetch({ limit: 1 }).then((results) => message.channel.bulkDelete(results));
			message.author.send(embed);
		}
    }
};