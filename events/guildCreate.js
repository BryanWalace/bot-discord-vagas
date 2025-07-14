const { Events, ChannelType, EmbedBuilder } = require('discord.js');

// Criamos um Embed de ajuda que pode ser reutilizado
const createHelpEmbed = (client) => {
    return new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('👋 Olá! Eu sou o Bot de Vagas')
        .setDescription('Estou pronto para ajudar você e sua comunidade a encontrar as melhores vagas de tecnologia!\n\nAbaixo estão os comandos que você pode usar:')
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { 
                name: '`!vagas <termo>`', 
                value: 'Faz uma busca rápida pelas 5 vagas mais recentes para o termo pesquisado. \n*Exemplo: `!vagas desenvolvedor junior`*'
            },
            { 
                name: '`!vagasAll <termo>`', 
                value: 'Busca e exibe **TODAS** as vagas encontradas para o termo. \n*(Use com moderação para não poluir o chat!)*'
            },
            {
                name: '`!vagas day` (Somente Admins)',
                value: 'Abre o menu interativo para configurar as postagens automáticas e diárias de vagas.'
            }
        )
        .setFooter({ text: 'Obrigado por me escolher!' });
};

module.exports = {
    name: Events.GuildCreate,
    execute(guild, client) {
        console.log(`O bot foi adicionado ao servidor: ${guild.name} (ID: ${guild.id})`);

        let channelToSend = guild.systemChannel;
        if (!channelToSend) {
            channelToSend = guild.channels.cache.find(channel => 
                channel.type === ChannelType.GuildText && 
                channel.permissionsFor(guild.members.me).has('SendMessages')
            );
        }
        
        if (!channelToSend) {
            console.log(`Não foi possível encontrar um canal para enviar a mensagem de boas-vindas no servidor ${guild.name}.`);
            return;
        }

        const welcomeEmbed = createHelpEmbed(client);
        channelToSend.send({ embeds: [welcomeEmbed] })
            .then(() => console.log(`Mensagem de boas-vindas enviada no servidor ${guild.name}`))
            .catch(e => console.error(`Não foi possível enviar a mensagem de boas-vindas: ${e}`));
    },
   
    createHelpEmbed 
};