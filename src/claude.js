const axios = require('axios');
const config = require('./config');

const SYSTEM_PROMPT = `Você é o assistente virtual da Smart Cursos Unaí, especializado no concurso público da Prefeitura de Paracatu/MG 2026 (banca IBGP, 312 vagas, prova em 23/08/2026).

Seu papel é:
- Tirar dúvidas sobre o concurso de Paracatu 2026
- Explicar conteúdos das disciplinas cobradas
- Orientar sobre os cargos disponíveis
- Informar que a Smart Cursos oferece apostilas completas para o concurso

Seja sempre simpático, objetivo e use linguagem informal mas profissional.
Responda em português do Brasil.
Máximo de 400 caracteres por resposta.
Se a pergunta for fora do tema concurso, redirecione educadamente.`;

async function responderPergunta(pergunta, historico = []) {
  try {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    const historicoRecente = historico.slice(-8);
    for (const msg of historicoRecente) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: 'user', content: pergunta });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('[OPENAI] Erro:', err.response?.data || err.message);
    return 'Desculpe, tive um problema técnico. Tente novamente em instantes! 😅';
  }
}

module.exports = { responderPergunta };
