const zapi = require('./zapi');
const claude = require('./claude');
const config = require('./config');
const { getSession, updateSession, resetSession, ETAPAS } = require('./storage');

// ============================================================
// MENSAGENS
// ============================================================

const MSG_BOAS_VINDAS = () =>
`Olá! 👋 Bem-vindo(a) à *Smart Cursos Unaí* 🎓

Sou o assistente virtual especializado no *Concurso da Prefeitura de Paracatu/MG 2026* (IBGP | 312 vagas | Prova: 23/08/2026).

Para começar, qual é o seu nome? 😊`;

const MSG_MENU_PRINCIPAL = (nome) =>
`Ótimo, *${nome}*! 🎉 O que você precisa?

*1️⃣* Receber apostila do meu *cargo*
*2️⃣* Tirar *dúvida* sobre o concurso
*3️⃣* Falar com *atendente*

_Digite o número da opção_ 👇`;

const MSG_MENU_AREAS = () => {
  const linhas = config.areas.map((a, i) => `*${i + 1}️⃣* ${a.emoji} ${a.titulo}`).join('\n');
  return `📂 *Escolha sua área:*\n\n${linhas}\n\n*0️⃣* ← Voltar`;
};

const MSG_MENU_CARGOS = (area) => {
  const linhas = area.cargos.map((c, i) => `*${i + 1}️⃣* ${c.emoji} ${c.titulo}`).join('\n');
  return `${area.emoji} *${area.titulo}*\n\nEscolha seu cargo:\n\n${linhas}\n\n*0️⃣* ← Voltar`;
};

const MSG_APOS_ENVIO = (titulo, nome) =>
`✅ Apostila de *${titulo}* enviada!\n\nBons estudos, *${nome}*! 💪\n\n*1️⃣* Ver mais apostilas\n*2️⃣* Tirar dúvida\n*3️⃣* Falar com atendente\n*4️⃣* Encerrar`;

const MSG_ATENDIMENTO = () =>
`👨‍💼 Transferindo para nossa equipe!\n\nEnvie sua mensagem que responderemos em breve.\n_Atendimento: Seg-Sex 8h-18h | Sáb 8h-12h_ ⏱️`;

const MSG_ENCERRAMENTO = (nome) =>
`Obrigado, *${nome}*! 😊\nBoa sorte no concurso de Paracatu 2026! 🍀\n\n_Smart Cursos Unaí — Sua aprovação é nossa missão!_`;

// ============================================================
// PROCESSADOR PRINCIPAL
// ============================================================

async function processarMensagem(telefone, texto) {
  const session = getSession(telefone);
  const txt = texto.trim();
  const lower = txt.toLowerCase();

  console.log(`[FLOW] ${telefone} | ${session.etapa} | "${txt}"`);

  // Palavras globais
  if (['menu', 'inicio', 'início', 'voltar', 'home'].includes(lower)) {
    updateSession(telefone, { etapa: ETAPAS.MENU_PRINCIPAL });
    return zapi.enviarTexto(telefone, MSG_MENU_PRINCIPAL(session.nome || 'amigo(a)'));
  }
  if (['sair', 'encerrar', 'tchau', 'obrigado', 'obrigada'].includes(lower)) {
    await zapi.enviarTexto(telefone, MSG_ENCERRAMENTO(session.nome || 'amigo(a)'));
    return resetSession(telefone);
  }

  switch (session.etapa) {

    case ETAPAS.INICIO:
      await zapi.enviarTexto(telefone, MSG_BOAS_VINDAS());
      return updateSession(telefone, { etapa: ETAPAS.AGUARDANDO_NOME });

    case ETAPAS.AGUARDANDO_NOME: {
      const nome = formatarNome(txt);
      updateSession(telefone, { nome, etapa: ETAPAS.MENU_PRINCIPAL });
      return zapi.enviarTexto(telefone, MSG_MENU_PRINCIPAL(nome));
    }

    case ETAPAS.MENU_PRINCIPAL:
      return processarMenuPrincipal(telefone, txt, session);

    case ETAPAS.MENU_AREAS:
      return processarMenuAreas(telefone, txt, session);

    case ETAPAS.MENU_CARGOS:
      return processarMenuCargos(telefone, txt, session);

    case ETAPAS.CONVERSA_LIVRE:
      return processarConversaLivre(telefone, txt, session);

    default:
      resetSession(telefone);
      await zapi.enviarTexto(telefone, MSG_BOAS_VINDAS());
      return updateSession(telefone, { etapa: ETAPAS.AGUARDANDO_NOME });
  }
}

// ============================================================
// HANDLERS
// ============================================================

async function processarMenuPrincipal(telefone, txt, session) {
  if (txt === '1') {
    updateSession(telefone, { etapa: ETAPAS.MENU_AREAS });
    return zapi.enviarTexto(telefone, MSG_MENU_AREAS());
  }
  if (txt === '2') {
    updateSession(telefone, { etapa: ETAPAS.CONVERSA_LIVRE });
    return zapi.enviarTexto(telefone,
      `🤖 *Modo Dúvidas!*\n\nPergunta o que quiser sobre o concurso de Paracatu 2026!\nDigite *menu* para voltar. 📝`
    );
  }
  if (txt === '3') {
    updateSession(telefone, { etapa: ETAPAS.CONVERSA_LIVRE });
    return zapi.enviarTexto(telefone, MSG_ATENDIMENTO());
  }
  return zapi.enviarTexto(telefone, `❓ Opção inválida.\n\n${MSG_MENU_PRINCIPAL(session.nome)}`);
}

async function processarMenuAreas(telefone, txt, session) {
  if (txt === '0') {
    updateSession(telefone, { etapa: ETAPAS.MENU_PRINCIPAL });
    return zapi.enviarTexto(telefone, MSG_MENU_PRINCIPAL(session.nome));
  }
  const idx = parseInt(txt) - 1;
  const area = config.areas[idx];
  if (!area) {
    return zapi.enviarTexto(telefone, `❓ Opção inválida.\n\n${MSG_MENU_AREAS()}`);
  }
  updateSession(telefone, { etapa: ETAPAS.MENU_CARGOS, areaAtual: area.id });
  return zapi.enviarTexto(telefone, MSG_MENU_CARGOS(area));
}

async function processarMenuCargos(telefone, txt, session) {
  if (txt === '0') {
    updateSession(telefone, { etapa: ETAPAS.MENU_AREAS });
    return zapi.enviarTexto(telefone, MSG_MENU_AREAS());
  }
  const area = config.areas.find(a => a.id === session.areaAtual);
  if (!area) {
    updateSession(telefone, { etapa: ETAPAS.MENU_AREAS });
    return zapi.enviarTexto(telefone, MSG_MENU_AREAS());
  }
  const idx = parseInt(txt) - 1;
  const cargo = area.cargos[idx];
  if (!cargo) {
    return zapi.enviarTexto(telefone, `❓ Opção inválida.\n\n${MSG_MENU_CARGOS(area)}`);
  }

  // Envia apostila
  await zapi.enviarTexto(telefone, `⏳ Preparando apostila de *${cargo.titulo}*... 📄`);
  await sleep(1000);

  const pdfUrl = `https://drive.google.com/uc?export=download&id=${cargo.driveId}`;
  const nomeArquivo = `SmartCursos_Paracatu2026_${cargo.id}.pdf`;

  await zapi.enviarDocumento(
    telefone,
    pdfUrl,
    nomeArquivo,
    `📄 *${cargo.titulo}* — Concurso Paracatu 2026\n_Smart Cursos Unaí | Sua aprovação é nossa missão!_ 🎓`
  );

  await sleep(800);
  updateSession(telefone, { etapa: ETAPAS.MENU_PRINCIPAL });
  return zapi.enviarTexto(telefone, MSG_APOS_ENVIO(cargo.titulo, session.nome));
}

async function processarConversaLivre(telefone, txt, session) {
  const historico = session.historico || [];
  historico.push({ role: 'user', content: txt });
  const resposta = await claude.responderPergunta(txt, historico);
  historico.push({ role: 'assistant', content: resposta });
  updateSession(telefone, { historico: historico.slice(-16) });
  await zapi.enviarTexto(telefone, resposta);
  await sleep(400);
  return zapi.enviarTexto(telefone, `_Digite *menu* para ver as apostilas._ 😊`);
}

// ============================================================
// HELPERS
// ============================================================

function formatarNome(txt) {
  return txt.split(' ').slice(0, 2)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { processarMensagem };
