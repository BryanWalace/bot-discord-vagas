const axios = require('axios');
const cheerio = require('cheerio');

async function buscarVagas(termoBusca) {
    const termoFormatado = termoBusca.toLowerCase().replace(/ /g, '-');
    const url = `https://www.vagas.com.br/vagas-de-${termoFormatado}?`;
    
    console.log(`URL final: ${url}`);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const vagasEncontradas = [];

        $('li.vaga').each((index, element) => {
            const vagaElement = $(element);

            const titulo = vagaElement.find('h2.cargo a').text().trim();
            const empresa = vagaElement.find('span.emprVaga').text().trim();
            const link = 'https://www.vagas.com.br' + vagaElement.find('h2.cargo a').attr('href');
            
            const nivel = vagaElement.find('span.nivelVaga').text().trim();

            const local = vagaElement.find('.vaga-local').text().trim().replace(/\s+/g, ' '); // O replace remove excesso de espaços em branco.

            if (titulo && empresa && link) {
                vagasEncontradas.push({ titulo, empresa, nivel, local, link });
            }
        });
        
        console.log(`Foram encontradas ${vagasEncontradas.length} vagas para "${termoBusca}".`);
        return vagasEncontradas;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`Nenhuma vaga encontrada para "${termoBusca}" (página 404).`);
            return [];
        }
        console.error("Erro ao fazer scraping no Vagas.com.br:", error.message);
        return [];
    }
}

module.exports = {
    buscarVagas
};