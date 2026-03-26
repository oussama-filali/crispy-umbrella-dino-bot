# ============================================
# Stage 1 : Build du frontend React
# ============================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copier les fichiers de dépendances en premier (cache Docker)
COPY frontend/package.json frontend/yarn.lock* ./

# Installer les dépendances
RUN yarn install --frozen-lockfile || yarn install

# Copier le reste du code frontend
COPY frontend/ ./

# Build de production — le backend servira les fichiers statiques
ENV REACT_APP_BACKEND_URL=""
RUN yarn build

# ============================================
# Stage 2 : Backend FastAPI + fichiers statiques
# ============================================
FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances Python
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code backend
COPY backend/ ./backend/

# Copier le build React depuis le stage 1
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Créer le répertoire pour les logs
RUN mkdir -p /app/backend

# Port utilisé par Render (variable d'environnement PORT)
ENV PORT=8000

EXPOSE ${PORT}

# Healthcheck pour Render
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Lancement de l'application (sh -c pour interpréter $PORT)
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"]
