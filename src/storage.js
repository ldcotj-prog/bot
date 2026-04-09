const sessions = new Map();

const ETAPAS = {
  INICIO: 'inicio',
  AGUARDANDO_NOME: 'aguardando_nome',
  MENU_PRINCIPAL: 'menu_principal',
  MENU_AREAS: 'menu_areas',
  MENU_CARGOS: 'menu_cargos',
  CONVERSA_LIVRE: 'conversa_livre',
};

function getSession(telefone) {
  if (!sessions.has(telefone)) {
    sessions.set(telefone, {
      etapa: ETAPAS.INICIO,
      nome: null,
      areaAtual: null,
      historico: [],
      ultimaMensagem: Date.now()
    });
  }
  return sessions.get(telefone);
}

function updateSession(telefone, dados) {
  const s = getSession(telefone);
  Object.assign(s, dados, { ultimaMensagem: Date.now() });
  sessions.set(telefone, s);
}

function resetSession(telefone) { sessions.delete(telefone); }

// Limpa sessões inativas após 2h
setInterval(() => {
  const limite = Date.now() - 7200000;
  for (const [tel, s] of sessions.entries()) {
    if (s.ultimaMensagem < limite) sessions.delete(tel);
  }
}, 1800000);

module.exports = { getSession, updateSession, resetSession, ETAPAS };
