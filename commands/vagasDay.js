const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionsBitField } = require('discord.js');
const { setConfig, agendarNovaBusca, checarNovasVagas, getKeywords } = require('../services/scheduler');

module.exports = {
    name: 'vagas day',
    description: 'Configura o bot com canal e o horário para o envio diário de vagas.',
    async execute(message, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send('Você não tem permissão para usar este comando.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const canaisDeTexto = message.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
        if (canaisDeTexto.size === 0) return message.reply('Não há canais de texto neste servidor.');
        
        const optionsCanais = canaisDeTexto.map(c => ({ label: `#${c.name}`, value: c.id }));
        const selectMenuCanais = new StringSelectMenuBuilder().setCustomId('channel_select').setPlaceholder('Selecione o canal...').addOptions(optionsCanais.slice(0, 25));

        const optionsHoras = Array.from({ length: 24 }, (_, i) => ({ label: `${i.toString().padStart(2, '0')}:00`, value: i.toString() }));
        const selectMenuHoras = new StringSelectMenuBuilder().setCustomId('time_select').setPlaceholder('Selecione o horário...').addOptions(optionsHoras);

        const nextButton = new ButtonBuilder().setCustomId('open_keywords_modal').setLabel('Próximo').setStyle(ButtonStyle.Primary).setDisabled(true);

        const rowCanais = new ActionRowBuilder().addComponents(selectMenuCanais);
        const rowHoras = new ActionRowBuilder().addComponents(selectMenuHoras);
        const rowButton = new ActionRowBuilder().addComponents(nextButton);
        
        const reply = await message.channel.send({ content: `${message.author}, configure a postagem diária de vagas:`, components: [rowCanais, rowHoras, rowButton] });

        const collector = reply.createMessageComponentCollector({ time: 120000 });
        let selectedChannelId = null;
        let selectedHour = null;

        // Habilita o botão "Próximo" se ambos os campos estiverem preenchidos
        collector.on('collect', async interaction => {
            const enableNextButton = () => { if (selectedChannelId && selectedHour) nextButton.setDisabled(false); };
            
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'channel_select') {
                    selectedChannelId = interaction.values[0];
                    selectMenuCanais.setPlaceholder(`Canal: #${canaisDeTexto.get(selectedChannelId).name}`);
                }
                if (interaction.customId === 'time_select') {
                    selectedHour = interaction.values[0];
                    selectMenuHoras.setPlaceholder(`Horário: ${selectedHour.padStart(2, '0')}:00`);
                }
                enableNextButton();
                await interaction.update({ components: [rowCanais, rowHoras, rowButton] });
            }

            // Verifica se o botão "Próximo" foi clicado
            if (interaction.isButton() && interaction.customId === 'open_keywords_modal') {
                const modal = new ModalBuilder().setCustomId('config_modal').setTitle('Configuração Final');
                
                const keywordsInput = new TextInputBuilder().setCustomId('keywords_input').setLabel('Palavras-chave (separadas por vírgula)').setStyle(TextInputStyle.Paragraph).setPlaceholder('Ex: react, node, desenvolvedor...').setValue(getKeywords().join(', '));
                
                modal.addComponents(new ActionRowBuilder().addComponents(keywordsInput));
                await interaction.showModal(modal);
                
                const modalInteraction = await interaction.awaitModalSubmit({ time: 60000 }).catch(() => null);
                if (modalInteraction) {
                    const keywords = modalInteraction.fields.getTextInputValue('keywords_input');
                    
                    setConfig({
                        canalId: selectedChannelId,
                        hora: selectedHour,
                        keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
                    });

                    await reply.delete();
                    await modalInteraction.reply({
                        content: `✅ **Configuração salva!** O bot agora está configurado para o canal <#${selectedChannelId}>.`,
                        ephemeral: true
                    });

                    agendarNovaBusca(client);
                    await modalInteraction.channel.send(`Vagas mais recentes...`);
                    checarNovasVagas(client);
                }
                collector.stop();
            }
        });
        // Se o coletor expirar, remove a mensagem de resposta
        collector.on('end', collected => { if (collected.size === 0) reply.delete().catch(() => {}); });
    }
};