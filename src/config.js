require('dotenv').config();

// Converte ID do Google Drive para link direto de download
const gdrive = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

const config = {
  zapi: {
    instanceId: process.env.ZAPI_INSTANCE_ID,
    token: process.env.ZAPI_TOKEN,
    clientToken: process.env.ZAPI_CLIENT_TOKEN,
    baseUrl: () => `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}`
  },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  server:     { port: process.env.PORT || 3000 },
  atendimento:{ numero: process.env.NUMERO_ATENDIMENTO || '5538999999999' },

  // ============================================================
  // 30 APOSTILAS - CONCURSO PARACATU 2026 (IBGP)
  // 312 vagas | Prova: 23/08/2026
  // ============================================================
  areas: [
    {
      id: 'saude',
      emoji: '🏥',
      titulo: 'Área da Saúde',
      cargos: [
        { id: 'enfermagem',      emoji: '💉', titulo: 'Enfermagem',                   driveId: '11WOBOciw_BI97Q06gecjAGw2zf5PSaUP' },
        { id: 'farmacia',        emoji: '💊', titulo: 'Farmácia',                     driveId: '1BARdFb1Shn67GgbY2UQb2J2YnOSaTdKH' },
        { id: 'radiologia',      emoji: '🔬', titulo: 'Radiologia',                   driveId: '14T3hfv_nN31yftXHOO01ckqtpApftjlS' },
        { id: 'odontologia',     emoji: '🦷', titulo: 'Odontologia',                  driveId: '1t5bgQ8KO42iF8uHq_tAAYoAnyIUjGDOd' },
        { id: 'fisioterapia',    emoji: '🩺', titulo: 'Fisioterapia',                 driveId: '17TPGOpHmlFDQ60EOV2tgi84P4iHPaeMo' },
        { id: 'analises',        emoji: '🧪', titulo: 'Técnico em Análises Clínicas', driveId: '1ebLoNgQV1oj5n-U8FntI7BwUDTh-BD3v' },
        { id: 'vigilancia',      emoji: '🔍', titulo: 'Vigilância Sanitária',         driveId: '1cW4p_i14mpndi1tG4BKdyltt1wJsxwD1' },
      ]
    },
    {
      id: 'educacao',
      emoji: '📚',
      titulo: 'Área da Educação',
      cargos: [
        { id: 'peb',             emoji: '🎓', titulo: 'PEB (Professor Ed. Básica)',   driveId: '1E_o-V90wpR7n2IEaDoOKwUfDWHj8XtE9' },
        { id: 'peb_arte',        emoji: '🎨', titulo: 'PEB Arte',                     driveId: '1qJPU4g0SY8CrW8NnGsLLOXEYfJt22CDU' },
        { id: 'peb_historia',    emoji: '📜', titulo: 'PEB História',                 driveId: '1n6o94UX-O6JByb3Z-cZFdNfW0Cz8bw3t' },
        { id: 'supervisor',      emoji: '🏫', titulo: 'Supervisor Escolar',           driveId: '1V0_kUF9j-Sg30PAKCKVjMIUIuA3MYuSn' },
        { id: 'educador_creche', emoji: '🧒', titulo: 'Educador de Creche',           driveId: '1oUtYuq0zC9u7JT7FZOucGdY9Up3Iytie' },
        { id: 'bibliotecario',   emoji: '📖', titulo: 'Bibliotecário',                driveId: '18rI6YD0DCkN1pFck5cUQHNqi-HvD5Rn9' },
      ]
    },
    {
      id: 'administrativa',
      emoji: '🗂',
      titulo: 'Área Administrativa',
      cargos: [
        { id: 'oficial_adm',     emoji: '📋', titulo: 'Oficial Administrativo',       driveId: '1_l4E0WBtUVRDNK-7fJ0FSgeZvhHjMDXm' },
        { id: 'aux_secretaria',  emoji: '📝', titulo: 'Auxiliar de Secretaria',       driveId: '16V9biF2pt8wi6_WF2Pm-z0wd7k5QUr-t' },
        { id: 'adm_aux',         emoji: '🏢', titulo: 'Administração / Aux. Adm.',    driveId: '1b472UpWf_atmsvGNZx1TW_hTSij4tUs3' },
        { id: 'almoxarifado',    emoji: '📦', titulo: 'Almoxarifado',                 driveId: '1Y5ukBkkFRKgDIuO_1L80Cf2wwIgESSL4' },
        { id: 'assist_social',   emoji: '🤝', titulo: 'Assistente Social',            driveId: '1FEBX-QOXOTFa0HjYlaLr67tIpb8XOFwS' },
        { id: 'contabilidade',   emoji: '💰', titulo: 'Contabilidade',                driveId: '1sgvfIFMceGQcdr2UB5ZXdGm8d9s8-DSn' },
      ]
    },
    {
      id: 'juridica_seguranca',
      emoji: '⚖',
      titulo: 'Jurídica / Segurança',
      cargos: [
        { id: 'advogado',        emoji: '⚖', titulo: 'Advogado',                     driveId: '16pY7zg2WAkbEizMNE9sNcAV4kS8ntlWh' },
        { id: 'gcm',             emoji: '👮', titulo: 'GCM (Guarda Civil Municipal)', driveId: '16mafamGWMgnkknq93HLGaKIUjMu3-uYQ' },
        { id: 'psicologia',      emoji: '🧩', titulo: 'Psicologia',                  driveId: '1pEDCbigbYlXzaxfNcLpc7dV_fZ5_DAmF' },
        { id: 'vigia',           emoji: '🔒', titulo: 'Vigia',                        driveId: '1TgUBmun-TwEnSFj2kdbTnYFLadXEG0b-' },
      ]
    },
    {
      id: 'tecnica',
      emoji: '⚙',
      titulo: 'Área Técnica',
      cargos: [
        { id: 'eng_eletrica_1',  emoji: '⚡', titulo: 'Engenharia Elétrica (vol.1)',  driveId: '1dGoopWYwiSxcTCakC0xEtV4w_a3qKBy6' },
        { id: 'eng_eletrica_2',  emoji: '⚡', titulo: 'Engenharia Elétrica (vol.2)',  driveId: '1m_pP7UFGGo9LrDCb4yAuEKKF0IP3YmOW' },
        { id: 'eng_ambiental',   emoji: '🌿', titulo: 'Engenheiro Ambiental',         driveId: '1K3KR5tKryLmYhIwMKIIXVz9-YbLMGjyA' },
        { id: 'motorista',       emoji: '🚗', titulo: 'Motorista',                    driveId: '18EFNToV5gZ2yBzBXHN5pNQvaSpP7vGJF' },
      ]
    }
  ],

  get catalogoPlano() {
    const mapa = {};
    for (const area of this.areas) {
      for (const cargo of area.cargos) {
        mapa[cargo.id] = { ...cargo, pdfUrl: gdrive(cargo.driveId) };
      }
    }
    return mapa;
  }
};

module.exports = config;
