const { createHelpEmbed } = require('../events/guildCreate');

module.exports = {
    name: 'help',
    description: 'Mostra todos os comandos disponíveis.',
    async execute(message, args, client) {
        const helpEmbed = createHelpEmbed(client);
        await message.channel.send({ embeds: [helpEmbed] });
    }
};