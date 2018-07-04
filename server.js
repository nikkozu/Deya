const Commando = require('discord.js-commando');
const path = require('path');
const DBL = require("dblapi.js");


const client = new Commando.Client({
  owner: '444454206800396309', 
  commandPrefix: 'dy!', 
  disableEveryone: true,
  unknownCommandResponse: false
});
const dbl = new DBL(process.env.DBL_TOKEN, client);
dbl.on('posted', () => {
  console.log('Server count posted!');
})
 
dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})


client.registry
.registerDefaultTypes()
.registerGroups([
  ['general', 'General'],
  ['fun1', 'Emotions'],
  ['group2', 'Fun'], 
  ['group3', 'Random'], 
  ['group4', 'Utility'], 
  ['group5', 'Moderation'], 
  ['group6', 'NSFW'], 
  ['util', 'Core'], 
  ['commands', 'Owner']
]) 
.registerDefaultCommands({
    help: false, 
    ping: false
})
.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('error', console.error)

client.on('warn', console.warn)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity('dy!help | By Sharif#2769');
});

client.login(process.env.TOKEN);