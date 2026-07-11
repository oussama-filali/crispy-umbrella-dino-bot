<p align="center">
  <img src="Dino-embedded.png" alt="Dino Bot" width="360" />
</p>

# 🦖 Dino Bot

**Compagnon conversationnel IA pensé pour les enfants** — un dinosaure érudit, courtois et protecteur, qui répond avec pédagogie et glisse des blagues de dinosaures. Agent du collectif [USINE-IA](https://github.com/oussama-filali/USINE-IA).

## 🛡️ La sécurité d'abord

Un chatbot destiné aux enfants ne se conçoit pas comme un chatbot classique. Dino Bot embarque plusieurs garde-fous, **côté serveur** :

- **Filtre de sujets proscrits** en amont de tout appel IA : les messages abordant violence, contenus adultes, drogues, etc. ne partent jamais vers le modèle — Dino répond avec bienveillance et redirige vers un adulte de confiance.
- **Personnalité adaptée à l'âge** : l'onboarding demande prénom et âge, et le *system prompt* change de registre — enfant (< 12 ans : ton simple, encourageant, réponses courtes), ado, adulte.
- **Réponses bornées** : température modérée (0.6) et longueur limitée, pour rester un mentor, pas un moulin à paroles.

## 🧠 Comment ça marche

```
React (chat UI) ──POST /api/chat──▶ FastAPI ──▶ Together AI (Llama 3.3 70B Instruct Turbo)
                                      │
                                      ├─ filtre de sécurité (avant l'appel)
                                      ├─ mémoire courte : 5 derniers échanges / utilisateur
                                      └─ system prompt adapté à l'âge
```

- **Backend** — [`backend/main.py`](backend/main.py) : FastAPI + httpx (appels asynchrones), mémoire conversationnelle en `deque(maxlen=5)` par utilisateur, endpoints `POST /api/chat` et `GET /api/health`.
- **Frontend** — [`frontend/src`](frontend/src) : React (CRA + CRACO), composants Radix UI / shadcn ; onboarding en deux étapes (prénom → âge), puis interface de chat complète : bulles de messages, indicateur de frappe, écran d'accueil animé.
- **Un seul service en prod** : le build React est servi statiquement par FastAPI (fallback SPA inclus).

## 🚀 Lancer en local

```bash
# 1. Backend
pip install -r backend/requirements.txt
echo "API_TOKEN_TOGETHER=votre_cle_together_ai" > .env
uvicorn backend.main:app --reload --port 8000

# 2. Frontend (autre terminal)
cd frontend
npm install
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
npm start
```

## 🐳 Déploiement

Image **Docker multi-stage** ([`Dockerfile`](Dockerfile)) :

1. `node:20-alpine` construit le frontend React ;
2. `python:3.11-slim` embarque FastAPI + le build statique, avec un `HEALTHCHECK` sur `/api/health`.

Le déploiement est décrit dans [`render.yaml`](render.yaml) (Render, région Frankfurt), la clé Together AI restant une variable d'environnement non versionnée.

## 📁 Structure

```
├── backend/
│   ├── main.py            # API FastAPI + logique Dino Bot (sécurité, mémoire, prompts)
│   └── requirements.txt
├── frontend/
│   └── src/components/    # WelcomeScreen, ChatMessages, MessageBubble, TypingIndicator…
├── Dockerfile             # Build multi-stage front + back
└── render.yaml            # Déploiement Render
```

---

*Projet de [Oussama Halima-Filali](https://github.com/oussama-filali) — une IA utile, c'est d'abord une IA qui protège ses utilisateurs les plus jeunes.*
