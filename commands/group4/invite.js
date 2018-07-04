const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const oneLine = require('common-tags').oneLine;

module.exports = class InviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['add', 'support'],
      group: 'group4',
      memberName: 'invite',
      description: 'Sends an invite for the bot.',
      details: oneLine `
      Do you like Deya? Do you want it on your very own server?
      This command sends an invite to the bot so you can spread the deya love!
			`,
      examples: ['invite'],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    var embed = new RichEmbed() 
    embed.addField('Usefull link:', '[Invite me](https://discordapp.com/oauth2/authorize?client_id=454618737153409026&scope=bot&permissions=1346452502) | [Vote me](https://discordbots.org/bot/454618737153409026/vote) | [Support server](https://discord.gg/kDAYc8M)') 
    message.channel.send(embed);
  } 
};