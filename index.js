const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!'; // Prefix para os comandos do bot

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath); 
    const commandName = path.parse(file).name.toLowerCase(); 
    if ('execute' in command) {
        client.commands.set(commandName, command);
        console.log(`[Comando Carregado]: ${commandName}`);
    } else {
        console.log(`[AVISO] O comando em ${filePath} não tem a propriedade "execute".`);
    }
}

// Carregamos os eventos do bot
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
    console.log(`[Evento Carregado]: ${event.name}`);
}

// Configuração do scheduler
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    
    try { await message.delete(); } catch (e) { console.warn("Permissão 'Gerenciar Mensagens' ausente."); }

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Verifica se o comando é 'vagas', 'vagas day' ou 'vagasall'
    if (commandName === 'vagas') {
        const command = args[0] === 'day' ? client.commands.get('vagasday') : client.commands.get('vagassearch');
        if (command) await command.execute(message, args, client);
    } else if (commandName === 'vagasall') {
        const command = client.commands.get('vagassearch');
        if (command) await command.execute(message, args, { client, limit: null });
    } else {
        const command = client.commands.get(commandName);
        if (command) await command.execute(message, args, client);
    }
});


client.login(TOKEN);