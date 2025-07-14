const { EmbedBuilder } = require('discord.js');
const { buscarVagas } = require('../scrapers/vagascom_scraper');

module.exports = {
    name: 'vagas search',
    description: 'Busca vagas manualmente no Vagas.com.br, com um limite opcional.',
    async execute(message, args, options = {}) {
        const { limit = 5 } = options;

        const pesquisa = args.join(' ');
        if (!pesquisa) return;

        const feedbackMsg = await message.channel.send(`🔎 Buscando vagas para **"${pesquisa}"**...`);
        const vagas = await buscarVagas(pesquisa);

        if (vagas.length === 0) {
            return await feedbackMsg.edit('Nenhuma vaga encontrada para sua busca.');
        }
        
        const vagasParaMostrar = limit ? vagas.slice(0, limit) : vagas;
        const textoLimite = limit ? `Exibindo as ${vagasParaMostrar.length} primeiras:` : `Exibindo todas as ${vagasParaMostrar.length} vagas encontradas:`;

        await feedbackMsg.delete();
        await message.channel.send(`✅ Encontrei ${vagas.length} vagas para **"${pesquisa}"**! ${textoLimite}`);
        
        for (const vaga of vagasParaMostrar) {
            const embed = new EmbedBuilder()
                .setTitle(vaga.titulo).setURL(vaga.link).setColor('#0099ff')
                .addFields(
                    { name: '🏢 Empresa', value: vaga.empresa || 'N/A', inline: true },
                    { name: '📈 Nível', value: vaga.nivel || 'N/A', inline: true },
                    { name: '📍 Local', value: vaga.local || 'N/A', inline: false }
                )
                .setFooter({ text: `Fonte: Vagas.com.br` }).setTimestamp();
            await message.channel.send({ embeds: [embed] });
        }
    }
};