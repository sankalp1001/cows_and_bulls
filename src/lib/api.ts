const API_BASE = import.meta.env.VITE_API_URL;

export async function startGame() {
    const res = await fetch(`${API_BASE}/new-game`, { method: 'POST' });
    return res.json();
}

export async function checkGuess(gameId: string, guess: string) {
    const res = await fetch(`${API_BASE}/check-guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: gameId, guess })
    });
    return res.json();
}
