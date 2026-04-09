const axios = require('axios');
const config = require('./config');

const headers = {
  'Client-Token': config.zapi.clientToken,
  'Content-Type': 'application/json'
};

// Envia mensagem de texto
async function enviarTexto(telefone, mensagem) {
  try {
    await axios.post(
      `${config.zapi.baseUrl()}/send-text`,
      { phone: telefone, message: mensagem },
      { headers }
    );
    console.log(`[ZAPI] ✅ Texto enviado para ${telefone}`);
  } catch (err) {
    console.error(`[ZAPI] ❌ Erro ao enviar texto:`, err.response?.data || err.message);
  }
}

// Envia documento/PDF
async function enviarDocumento(telefone, urlArquivo, nomeArquivo, legenda) {
  try {
    await axios.post(
      `${config.zapi.baseUrl()}/send-document`,
      {
        phone: telefone,
        document: urlArquivo,
        fileName: nomeArquivo,
        caption: legenda || ''
      },
      { headers }
    );
    console.log(`[ZAPI] ✅ Documento enviado para ${telefone}: ${nomeArquivo}`);
  } catch (err) {
    console.error(`[ZAPI] ❌ Erro ao enviar documento:`, err.response?.data || err.message);
  }
}

// Envia imagem
async function enviarImagem(telefone, urlImagem, legenda) {
  try {
    await axios.post(
      `${config.zapi.baseUrl()}/send-image`,
      { phone: telefone, image: urlImagem, caption: legenda || '' },
      { headers }
    );
  } catch (err) {
    console.error(`[ZAPI] ❌ Erro ao enviar imagem:`, err.response?.data || err.message);
  }
}

// Marca mensagem como lida (evita "não lida" acumulando)
async function marcarComoLida(telefone, messageId) {
  try {
    await axios.post(
      `${config.zapi.baseUrl()}/read-message`,
      { phone: telefone, messageId },
      { headers }
    );
  } catch (err) {
    // silencioso
  }
}

module.exports = { enviarTexto, enviarDocumento, enviarImagem, marcarComoLida };
