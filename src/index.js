require('dotenv').config();
const express = require('express');
const config = require('./config');
const { processarMensagem } = require('./flows');

const app = express();
app.use(express.json());

// ============================================================
// WEBHOOK - recebe mensagens do Z-API
// ============================================================
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Z-API envia vários tipos de eventos — só processa mensagens recebidas
    if (!body || body.isStatusReply || body.fromMe) {
      return res.status(200).json({ ok: true });
    }

    // Extrai dados da mensagem
    const telefone = body.phone;
    const texto = extrairTexto(body);

    if (!telefone || !texto) {
      return res.status(200).json({ ok: true });
    }

    console.log(`\n📩 [${new Date().toLocaleTimeString('pt-BR')}] De: ${telefone} | "${texto}"`);

    // Processa de forma assíncrona (responde 200 imediatamente ao Z-API)
    processarMensagem(telefone, texto).catch(err => {
      console.error('[ERROR] Falha ao processar mensagem:', err);
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[WEBHOOK] Erro:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ROTA DE SAÚDE (para Railway / uptime monitor)
// ============================================================
app.get('/', (req, res) => {
  res.json({
    status: '✅ Bot Smart Cursos - Paracatu 2026 está rodando!',
    hora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  });
});

app.get('/health', (req, res) => res.json({ ok: true }));

// ============================================================
// INICIA SERVIDOR
// ============================================================
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log('\n====================================================');
  console.log('🤖 BOT SMART CURSOS - CONCURSO PARACATU 2026');
  console.log('====================================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log('====================================================\n');
});

// ============================================================
// HELPER - extrai texto da estrutura do Z-API
// ============================================================
function extrairTexto(body) {
  if (body.text?.message) return body.text.message;
  if (body.image?.caption) return body.image.caption;
  if (body.document?.caption) return body.document.caption;
  if (body.audio) return '[áudio]'; // ignorado no fluxo
  return null;
}
