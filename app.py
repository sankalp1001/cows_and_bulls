
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import uuid

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load filtered corpus once
with open("filtered_words.txt", "r", encoding="utf-8") as f:
    WORDS = [w.strip() for w in f if w.strip()]


# Store games in memory (game_id -> {secret_word, guesses})
GAMES = {}

class GuessRequest(BaseModel):
    game_id: str
    guess: str


@app.post("/api/new-game")
async def new_game():
    secret_word = random.choice(WORDS)
    game_id = str(uuid.uuid4())
    GAMES[game_id] = {"secret_word": secret_word, "guesses": []}
    print("DEBUG: New secret word for", game_id, "is", secret_word)
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
    # Check guess length and if in word list
    if len(guess) != 4 or guess not in WORDS:
        return {"valid": False, "message": "Invalid guess"}

    # Prevent duplicate guesses (case-insensitive)
    if guess in [g.lower() for g in guesses]:
        return {"valid": False, "message": "Word already guessed"}

    # Check for repeating letters (e.g., no double letters allowed)
    if len(set(guess)) != len(guess):
        return {"valid": False, "message": "Repeating letters not allowed"}

    correct_position = sum(guess[i] == secret_word[i] for i in range(4))
    correct_letter = sum(min(guess.count(c), secret_word.count(c)) for c in set(guess)) - correct_position

    guesses.append(guess)
    status = "playing"
    if correct_position == 4:
        status = "win"
        # End game: remove from memory
        del GAMES[game_id]
    elif len(guesses) >= 8:
        status = "lose"
        # End game: remove from memory
        del GAMES[game_id]

    return {
        "valid": True,
        "correct_position": correct_position,
        "correct_letter": correct_letter,
        "status": status,
        "target_word": secret_word if status == "lose" else None,
        "guess_number": len(guesses)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)