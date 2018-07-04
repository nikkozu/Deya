// ini package mang
const Commando = require('discord.js-commando');
const { Util, RichEmbed } = require('discord.js');
const path = require('path');
const DBL = require("dblapi.js");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fs = require('fs')
const { PREFIX } = require('./config');

// ini ingat²lah
const client = new Commando.Client({
  owner: '444454206800396309', 
  commandPrefix: 'dy!', 
  disableEveryone: true,
  unknownCommandResponse: false
});

// ini api
const youtube = new YouTube(process.env.googleapikey);

const queue = new Map(); 

const dbl = new DBL(process.env.DBL_TOKEN, client);

// ini aku terpost di DBL bege
dbl.on('posted', () => {
  console.log('Server count posted!');
})
 
dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})

// ini register bapak ingat
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

// ini di console kalo ada apa2 
client.on('error', console.error)

client.on('warn', console.warn)

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));


// memberitahukan kalo botnya dah online bege
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity('dy!help | By Sharif#2769');
});

// nah di sini event msg nya ngerti? 
client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)
	

// nah di sini lah bagian sulitnya ya allah
	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					
 var selectembed = new RichEmbed()
 .setColor('RANDOM') 
 .setTitle('Song selection')
 .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`) 
 .setFooter('Please provide a value to select one of the search results ranging from 1-10') 
 
msg.channel.send(selectembed).then(msg => msg.delete(30000));
					
					
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 30000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return msg.channel.send('The music has stopped and I has left the voice channel!');
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**%`);
		serverQueue.volume = args[1];
    if (args[1] > 100) return msg.channel.send(`${msg.author} Volume limit is 100%, your ear will bleeding!`);
    serverQueue.volume = args[1];
    if (args[1] > 100) return !serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) +
    msg.channel.send(`${msg.author} Volume limit is 100%, your ear will bleeding!`);
 
    if (args[1] < 101) return serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) + msg.channel.send(`I set the volume to: __**${args[1]}**%__`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
var nowembed = new RichEmbed() 

.setColor('RANDOM') 
.setDescription(`🎶 Now playing: **${serverQueue.songs[0].title}**`)

return msg.channel.send(nowembed)
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
var queueembed = new RichEmbed() 

.setColor('RANDOM') 
.setTitle('Song queue') 
.setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}`) 
.addField('Now playing', `${serverQueue.songs[0].title}`) 

return msg.channel.send(queueembed)
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`, 
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
var adedembed = new RichEmbed() 

  .setColor("RANDOM")
  .setAuthor(`Added to Queue`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `__[${song.title}](${song.url})__`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Duration", `${song.durationm}min ${song.durations}sec`, true)
  .setTimestamp();
		
 return msg.channel.send(adedembed);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
var pleyembed = new RichEmbed() 

  .setColor("RANDOM")
  .setAuthor(`Start Playing`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `__[${song.title}](${song.url})__`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Volume", `${serverQueue.volume}%`, true)
  .addField("Duration", `${song.durationm}min ${song.durations}sec`, true)
  .addField("Vote me", "[Vote Minasaki On Discord bot list](https://discordbots.org/bot/452360666020577281/vote)") 
  .setFooter("If you can't hear the music, please reconnect. If you still can't hear maybe the bot is restarting!")
  .setTimestamp();

	serverQueue.textChannel.send(pleyembed);

}
// loginnya di sini bege jangan di atas
client.login(process.env.TOKEN); // ayo kita coba, bismillah
