# 🤖 Bot WhatsApp Smart Cursos — Concurso Paracatu 2026

Bot automático para envio de apostilas e atendimento de leads via WhatsApp.

---

## 📋 FLUXO DO BOT

```
Lead chega pelo anúncio → WhatsApp
  ↓
Bot dá boas-vindas + pede nome
  ↓
Menu Principal:
  [1] Módulos Base (LP, RL, Informática, CG)
  [2] Cargo Específico (GCM, Enf, PEB, Adv, Rad, Psi, EdCreche, FiscSaude)
  [3] Tirar dúvida (modo Claude IA)
  [4] Atendimento humano
  ↓
Envia PDF automaticamente via Z-API
```

---

## 🛠️ CONFIGURAÇÃO PASSO A PASSO

### 1. Crie conta na Z-API

1. Acesse https://z-api.io
2. Crie uma instância e conecte seu WhatsApp Business
3. Anote: **Instance ID**, **Token** e **Client Token**

### 2. Configure os PDFs

Faça upload de cada apostila no Google Drive:
- Clique direito no arquivo → "Compartilhar" → "Qualquer pessoa com o link"
- Copie o link e **converta para link direto**:

```
Link compartilhado: https://drive.google.com/file/d/FILEID/view
Link direto:        https://drive.google.com/uc?export=download&id=FILEID
```

### 3. Configure o projeto

```bash
# Clone ou extraia o projeto
cd whatsapp-bot-paracatu

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus dados
```

### 4. Configure o .env

```env
ZAPI_INSTANCE_ID=sua_instancia
ZAPI_TOKEN=seu_token
ZAPI_CLIENT_TOKEN=seu_client_token
ANTHROPIC_API_KEY=sk-ant-...

PDF_LINGUA_PORTUGUESA=https://drive.google.com/uc?export=download&id=...
PDF_GCM=https://drive.google.com/uc?export=download&id=...
# ... (preencha todos os PDFs)

NUMERO_ATENDIMENTO=5538999999999
```

### 5. Configure o Webhook na Z-API

1. No painel da Z-API, vá em **Webhooks**
2. Ative o webhook de **"Ao receber"**
3. URL: `https://SEU_DOMINIO/webhook`

### 6. Deploy no Railway (GRATUITO)

1. Acesse https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Conecte seu repositório
4. Vá em **Variables** e cole todo o conteúdo do seu .env
5. Railway detecta automaticamente o Node.js e faz deploy
6. Copie a URL gerada e configure no webhook da Z-API

---

## 🧪 TESTE LOCAL

```bash
npm run dev
# Bot rodando em http://localhost:3000

# Teste o webhook manualmente:
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"5538999999999","text":{"message":"Oi"}}'
```

---

## 📁 ESTRUTURA DO PROJETO

```
whatsapp-bot-paracatu/
├── src/
│   ├── index.js      ← Servidor Express + Webhook
│   ├── flows.js      ← Máquina de estados (fluxo de conversa)
│   ├── storage.js    ← Gerenciamento de sessões em memória
│   ├── zapi.js       ← Integração com Z-API
│   ├── claude.js     ← Integração com Claude (IA para dúvidas)
│   └── config.js     ← Configurações e catálogo de apostilas
├── .env.example      ← Modelo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 💰 CUSTOS ESTIMADOS

| Serviço | Custo |
|---------|-------|
| Z-API | ~R$ 97/mês |
| Railway | Gratuito (500h/mês) |
| Claude API | ~$5-10/mês (depende do volume) |
| **Total** | **~R$ 150/mês** |

---

## ❓ DÚVIDAS FREQUENTES

**O bot funciona 24h?**
Sim, enquanto o Railway estiver rodando e o WhatsApp Business conectado na Z-API.

**Posso adicionar novas apostilas?**
Sim! Basta adicionar no `src/config.js` e colocar o link no `.env`.

**E se o candidato digitar algo errado?**
O bot trata entradas inválidas em todas as etapas e solicita a opção correta.

---

_Smart Cursos Unaí | Unaí-MG | Sua aprovação é nossa missão! 🎓_
