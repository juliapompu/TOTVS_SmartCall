# TOTVS SmartCall — Frontend React

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js 18+ instalado
- Backend Java rodando em `http://localhost:8080`

### Instalação e execução

```bash
# 1. Entre na pasta do frontend
cd smartcall-frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```

O site abre automaticamente em **http://localhost:3000**

---

## 📁 Estrutura de arquivos

```
src/
├── components/
│   ├── Header.jsx          ← Cabeçalho fixo com navegação
│   ├── ChamadaCard.jsx     ← Card da faixa horizontal + modal
│   └── ClienteCard.jsx     ← Card de cliente + modal de perfil completo
│
├── pages/
│   ├── Dashboard.jsx       ← Página inicial com todas as seções
│   ├── Clientes.jsx        ← Lista e busca de clientes
│   ├── Chamadas.jsx        ← Gerenciamento de chamadas
│   ├── Transcricoes.jsx    ← Envio para IA + histórico
│   └── Sobre.jsx           ← Página institucional
│
├── services/
│   └── api.js              ← Todas as chamadas ao backend Java
│
├── App.jsx                 ← Rotas da aplicação
├── index.js                ← Ponto de entrada
└── index.css               ← Design system global
```

---

## 🔗 Conexão com o Backend

Todas as chamadas HTTP estão centralizadas em `src/services/api.js`.

Se o backend mudar de porta, altere só esta linha:
```js
const BASE_URL = 'http://localhost:8080/api';
```

---

## 📡 Endpoints consumidos

| Página         | Endpoint                          |
|----------------|-----------------------------------|
| Dashboard      | `GET /api/dashboard`              |
| Clientes       | `GET /api/clientes`               |
| Perfil cliente | `GET /api/clientes/:id`           |
| Busca          | `GET /api/clientes/buscar?nome=X` |
| Chamadas ativas| `GET /api/chamadas/ativas`        |
| Agendar        | `POST /api/chamadas`              |
| Status chamada | `PATCH /api/chamadas/:id/status`  |
| Processar IA   | `POST /api/transcricoes/processar`|
| Transcrições   | `GET /api/transcricoes/recentes`  |

---

## 🎨 Design System

Cores, fontes e componentes definidos em `index.css` via CSS Variables:

- **Azul TOTVS**: `#0057FF`
- **Verde (ao vivo)**: `#00E5A0`
- **Fonte display**: Syne
- **Fonte corpo**: DM Sans
