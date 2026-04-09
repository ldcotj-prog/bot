const axios = require('axios');
const config = require('./config');

const SYSTEM_PROMPT = `Você é o assistente virtual da Smart Cursos Unaí, especializado no concurso público da Prefeitura de Paracatu/MG 2026 (banca IBGP, 312 vagas, prova em 23/08/2026).

Seu papel é:
- Tirar dúvidas sobre o concurso de Paracatu 2026
- Explicar conteúdos das disciplinas cobradas
- Orientar sobre os cargos disponíveis: GCM, Enfermagem, PEB, Advogado, Radiologia, Psicologia, Educador de Creche e Fiscal de Saúde
- Indicar que a Smart Cursos oferece apostilas completas e preparatórias para o concurso

Seja sempre simpático, objetivo e use linguagem informal mas profissional.
Responda em português do Brasil.
Máximo de 300 caracteres por resposta (WhatsApp tem limite de atenção curto).
Se a pergunta for fora do tema concurso, redirecione educadamente para o assunto.`;

async function responderPergunta(pergunta, historico = []) {
  try {
    const messages = [];

    // Adiciona histórico recente (últimas 4 trocas)
    const historicoRecente = historico.slice(-8);
    for (const msg of historicoRecente) {
      messages.push({ role: msg.role, content: msg.content });
    }

    messages.push({ role: 'user', content: pergunta });

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages
      },
      {
        headers: {
          'x-api-key': config.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.content[0].text;
  } catch (err) {
    console.error('[CLAUDE] Erro:', err.response?.data || err.message);
    return 'Desculpe, tive um problema técnico. Tente novamente em instantes! 😅';
  }
}

module.exports = { responderPergunta };
