import os
import json
import logging
import httpx
from datetime import datetime
from collections import deque
from typing import Optional, Dict
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# --- CONFIGURATION & LOGS ---
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DinoBot")

API_TOKEN = os.getenv("API_TOKEN_TOGETHER") 
API_URL = "https://api.together.xyz/v1/chat/completions"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOGIQUE DINO BOT ---
class DinoBot:
    def __init__(self):
        # Mémoire par utilisateur (5 derniers échanges)
        self.user_histories: Dict[str, deque] = {}
        
        # SÉCURITÉ : Filtre de sujets proscrits pour protéger les enfants
        self.forbidden_topics = [
            "sexe", "pornographie", "violence", "meurtre", "suicide", 
            "drogue", "alcool", "terrorisme", "guerre", "insulte", "torture"
        ]

    def is_safe(self, text: str) -> bool:
        """Vérifie si le message est approprié pour un enfant."""
        text_lower = text.lower()
        return not any(word in text_lower for word in self.forbidden_topics)

    def get_system_prompt(self, name: str, level: str, age: int) -> str:
        """Définit la personnalité de Dino Bot."""
        
        # Identité : Noble, distingué mais accessible
        identity = f"""
        Tu es Dino Bot, un dinosaure érudit, sage et extrêmement poli.
        TON STYLE : Tu t'exprimes avec élégance (mots choisis, courtoisie), mais tu restes accessible.
        TON ATTITUDE : Tu es un mentor bienveillant pour les enfants. Tu es pédagogue.
        HUMOUR : Tu aimes glisser des blagues de dinosaures pour amuser tes jeunes amis.
        SÉCURITÉ : Tu es le gardien de la sécurité. Tu ne parles JAMAIS de sujets adultes ou violents.
        """

        if level == "enfant":
            return f"""
            {identity}
            PUBLIC : Un enfant nommé {name} ({age} ans).
            INSTRUCTIONS : 
            1. Utilise un ton 'noble' mais simple à comprendre.
            2. Sois très encourageant et protecteur.
            3. Si le sujet est risqué, redirige poliment vers les parents : 'C'est un mystère pour les grandes personnes'.
            4. Réponse courte (2-3 phrases).
            """
        
        return f"{identity} (Mode Ado/Adulte : Analyse factuelle et distinction)."

    async def chat(self, user_id: str, message: str, name: str, age: int):
        # 1. SÉCURITÉ : Le bouclier de Dino Bot
        if not self.is_safe(message):
            logger.warning(f"SÉCURITÉ : Tentative d'accès à un sujet sensible par {name}")
            return ("Oh, mon jeune ami, vous soulevez là une question bien sombre pour mes vieux yeux de dinosaure. "
                    "Ce mystère demande la sagesse d'un adulte. Je vous suggère d'en parler avec vos parents ou "
                    "votre professeur, ils sauront vous guider avec douceur.")

        # 2. Gestion de la mémoire courte
        if user_id not in self.user_histories:
            self.user_histories[user_id] = deque(maxlen=5)
        
        level = "enfant" if age < 12 else ("ado" if age < 18 else "adulte")
        system_prompt = self.get_system_prompt(name, level, age)

        # 3. Préparation des messages
        messages = [{"role": "system", "content": system_prompt}]
        for hist in self.user_histories[user_id]:
            messages.append(hist)
        messages.append({"role": "user", "content": message})

        # 4. Appel API
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    API_URL,
                    headers={"Authorization": f"Bearer {API_TOKEN}"},
                    json={
                        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                        "messages": messages,
                        "temperature": 0.6,
                        "max_tokens": 300
                    },
                    timeout=20.0
                )
                
                if response.status_code == 200:
                    ai_reply = response.json()['choices'][0]['message']['content'].strip()
                    # Enregistrement en mémoire
                    self.user_histories[user_id].append({"role": "user", "content": message})
                    self.user_histories[user_id].append({"role": "assistant", "content": ai_reply})
                    return ai_reply
                else:
                    return "Mes excuses... Mon esprit s'est un peu embrouillé. Pourriez-vous répéter votre requête ?"
            
            except Exception as e:
                logger.error(f"Erreur API Dino Bot: {e}")
                return "Par mes écailles ! Un petit nuage technique cache ma réponse. Réessayons dans un instant ?"

# --- ROUTES ---
dino_bot = DinoBot()

class ChatInput(BaseModel):
    message: str
    name: str
    age: int

@app.post("/api/chat")
async def chat_endpoint(req: ChatInput):
    user_id = req.name.lower()
    
    if not req.name:
        return {"response": "Salutations ! Je suis Dino Bot. Quel est votre charmant prénom ?"}
    if req.age <= 0:
        return {"response": f"Enchanté {req.name} ! Pourriez-vous m'indiquer votre âge ?"}

    reply = await dino_bot.chat(user_id, req.message, req.name, req.age)
    return {"response": reply}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "DinoBot Fact-Check API"}

# --- Servir le frontend React en production ---
FRONTEND_BUILD = Path(__file__).resolve().parent.parent / "frontend" / "build"

if FRONTEND_BUILD.is_dir():
    app.mount("/static", StaticFiles(directory=FRONTEND_BUILD / "static"), name="static")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        """Catch-all : sert index.html pour le routing React."""
        file_path = FRONTEND_BUILD / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_BUILD / "index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
