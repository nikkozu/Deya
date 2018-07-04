const { RichEmbed } = require('discord.js');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js')
const commando = require('discord.js-commando');
//const { draw, shhhuffle } = require('/app/Weeb/Utils.js')
const ms = require("ms");

 function shuffle(arr) {
        for (let i = arr.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }
        return arr;
    }

   function draw(list) {
        const shuffled = shuffle(list);
        return shuffled[Math.floor(Math.random() * shuffled.length)];
    }

module.exports = class UrbanDictionaryCommand extends commando.Command {
constructor(client) {
    super(client, {
        name: 'giveaway',
        aliases: ['creategiveaway', 'giveawaycreate'],
        group: 'util',
        memberName: 'giveaway',
        description: 'Creates a giveaway for a set amount of time.',
        examples: ["+giveaway \"Things\" 10h"],
        args: [
          {
            key: 'channel',
            prompt: 'What channel do you want the giveaway in?',
            type: 'channel'
          },
            {
                key: 'question',
                prompt: 'What is the giveaway prize?',
                type: 'string',
            },
           {
                key: 'copunt',
                prompt: 'How many winners?',
                type: 'integer'
            },
            {
                key: 'time',
                prompt: 'How long should the giveaway last?',
                type: 'string',
            },
        ]
    });
}

   async run(msg, { copunt, channel, question, time }) {
     let embed = new Discord.RichEmbed()
     .setTitle(question)
     .setDescription('React with 🎉 to enter!!\nEnds in '+time+' from now.')
     .setColor('RANDOM')
     .setTimestamp();
     channel.send(embed).then(message => {
         message.react('🎉').then( r => { 
           setTimeout(function(){
            if(message.reactions.get('🎉').count <= 2) {
              let embed2 = new Discord.RichEmbed()
     .setTitle(question)
     .setDescription('The Giveaway has ended, not enough people voted..')
     .setColor('RANDOM')
     .setTimestamp();
              message.edit(embed2);
            } else {
              var winners = [];
               const users = message.reactions.get("🎉").users;
            const list = users.array().filter(u => u.id !== msg.author.id);
             // let winner = list[Math.floor(Math.random() * list.length)];
                 for (let i = 0; i < copunt; i++) {
                  const x = draw(list);

                if (!winners.includes(x)) winners.push(x);
            }

               let embed3 = new Discord.RichEmbed()
              .setTitle(question)
              .setDescription(`Winner: ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`)
              .setFooter('Ended At')
              .setColor('RANDOM')
              //.setFooter(`${copunt} Winner(s)`)
              .setTimestamp();
              message.edit(embed3)
            }
        }, ms(time));
         })
     })
   }
}
