from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import random
import uuid
from filter_words import choose_secret_word, WORDS_FREQ

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Load filtered corpus with frequencies --------
WORDS_FREQ = {}
with open("filtered_words_with_freq.txt", "r", encoding="utf-8") as f:
    for line in f:
        parts = line.strip().split("\t")
        if len(parts) == 2:
            word, freq = parts
            WORDS_FREQ[word] = float(freq)

WORDS = list(WORDS_FREQ.keys())

# -------- In-memory store for games --------
GAMES = {}

class GuessRequest(BaseModel):
    game_id: str
    guess: str

@app.get("/")
async def root():
    return {"message": "Cows and Bulls API is running!"}


@app.post("/api/new-game")
async def new_game():
    secret_word = choose_secret_word(WORDS_FREQ)
    game_id = str(uuid.uuid4())
    GAMES[game_id] = {"secret_word": secret_word, "guesses": []}
    print("DEBUG: New secret word for", game_id, "is", secret_word, "freq:", WORDS_FREQ[secret_word])
    return {"game_id": game_id}

@app.post("/api/check-guess")
async def check_guess(req: GuessRequest):
    game_id = req.game_id
    guess = req.guess.lower()
    game = GAMES.get(game_id)
    if not game:
        return {"valid": False, "message": "Invalid game ID"}
    secret_word = game["secret_word"]
    guesses = game["guesses"]

    # Check guess validity
    if len(guess) != 4 or guess not in WORDS:
        return {"valid": False, "message": "Invalid guess"}

    if guess in [g.lower() for g in guesses]:
        return {"valid": False, "message": "Word already guessed"}

    if len(set(guess)) != len(guess):
        return {"valid": False, "message": "Repeating letters not allowed"}

    # Compute correctness
    correct_position = sum(guess[i] == secret_word[i] for i in range(4))
    correct_letter = sum(min(guess.count(c), secret_word.count(c)) for c in set(guess)) - correct_position

    guesses.append(guess)
    status = "playing"
    if correct_position == 4:
        status = "win"
        del GAMES[game_id]
    elif len(guesses) >= 8:
        status = "lose"
        del GAMES[game_id]

    return {
        "valid": True,
        "correct_position": correct_position,
        "correct_letter": correct_letter,
        "status": status,
        "target_word": secret_word if status == "lose" else None,
        "guess_number": len(guesses)
    }
app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)