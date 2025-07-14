const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { buscarVagas } = require('../scrapers/vagascom_scraper');

let CANAL_ID_VAGAS = null; 
let HORA_AGENDADA = '9';
let PALAVRAS_CHAVE_BUSCA = ['desenvolvedor', 'front-end', 'back-end'];
let tarefaAgendada = null;

async function checarNovasVagas(client) {
    if (!CANAL_ID_VAGAS) {
        console.log('⏰ Busca automática pausada: Nenhum canal de vagas foi configurado.');
        return;
    }
    console.log('---------------------------------');
    console.log('⏰ Executando busca de vagas agendada...');
    
    const canal = await client.channels.fetch(CANAL_ID_VAGAS).catch(() => null);
    if (!canal) {
        console.error(`ERRO: Canal com ID ${CANAL_ID_VAGAS} não encontrado.`);
        tarefaAgendada?.stop();
        CANAL_ID_VAGAS = null;
        return;
    }

    for (const termo of PALAVRAS_CHAVE_BUSCA) {
        console.log(`Buscando por: "${termo}"`);
        const vagas = await buscarVagas(termo);

        if (vagas.length > 0) {
            await canal.send(`--- **Vagas encontradas para \`${termo}\`** ---`);
            for (const vaga of vagas.slice(0, 5)) {
                const embed = new EmbedBuilder()
                    .setTitle(vaga.titulo).setURL(vaga.link).setColor('#F1C40F')
                    .addFields(
                        { name: '🏢 Empresa', value: vaga.empresa || 'N/A', inline: true },
                        { name: '📈 Nível', value: vaga.nivel || 'N/A', inline: true },
                        { name: '📍 Local', value: vaga.local || 'N/A', inline: false }
                    ).setFooter({ text: `Fonte: Vagas.com.br` }).setTimestamp();
                await canal.send({ embeds: [embed] });
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log('✅ Busca agendada concluída.');
    console.log('---------------------------------');
}

function agendarNovaBusca(client) {
    if (tarefaAgendada) {
        tarefaAgendada.stop();
    }
    if (!CANAL_ID_VAGAS) {
        console.log('Agendamento não iniciado: canal não configurado.');
        return;
    }
    const cronExpressao = `0 ${HORA_AGENDADA} * * *`;
    tarefaAgendada = cron.schedule(cronExpressao, () => checarNovasVagas(client), {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
    console.log(`✅ Nova busca agendada! Expressão cron: ${cronExpressao}`);
}

module.exports = {
    checarNovasVagas,
    agendarNovaBusca,
    setConfig: (config) => {
        CANAL_ID_VAGAS = config.canalId;
        HORA_AGENDADA = config.hora;
        PALAVRAS_CHAVE_BUSCA = config.keywords;
    },
    getKeywords: () => PALAVRAS_CHAVE_BUSCA,
};