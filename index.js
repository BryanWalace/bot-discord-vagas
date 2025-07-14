const { Client, GatewayIntentBits, Events } = require('discord.js');

require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;

const PREFIX = '!';

const client = new Client({
    
    intents: [
        GatewayIntentBits.Guilds,          // Necessário para interagir com servidores (guilds)
        GatewayIntentBits.GuildMessages,   // Necessário para receber mensagens em servidores
        GatewayIntentBits.MessageContent,  // Necessário para LER o conteúdo das mensagens
    ]
});


client.once(Events.ClientReady, () => {
    console.log('------------------------------------');
    console.log(`✅ Bot pronto! Logado como ${client.user.tag}`);
    console.log('------------------------------------');
});

// Este evento é disparado toda vez que uma nova mensagem é criada em um canal
client.on(Events.MessageCreate, async (message) => {
    // Etapa 1: Ignorar mensagens que não são para o bot
    // Se a mensagem for de outro bot ou não começar com o prefixo, não faz nada
    if (message.author.bot || !message.content.startsWith(PREFIX)) {
        return;
    }

    // Remove o prefixo e divide a mensagem em "comando" e "argumentos"
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Etapa 3: Lógica de Comandos
    if (command === 'ping') {
        await message.reply('Pong! 🏓');
    }
});

client.login(TOKEN);