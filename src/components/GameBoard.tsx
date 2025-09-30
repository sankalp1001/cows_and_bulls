

import { useState, useEffect } from "react";
import { GameRow } from "./GameRow";
import { Keyboard } from "./Keyboard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WORD_LENGTH = 4;
const MAX_GUESSES = 8;

// Backend endpoints
const NEW_GAME_URL = "http://localhost:8000/api/new-game";
const CHECK_GUESS_URL = "http://localhost:8000/api/check-guess";

export const GameBoard = () => {
  const [showReloadMsg, setShowReloadMsg] = useState(false);
  const [wasPopupShown, setWasPopupShown] = useState(false);


  const [gameId, setGameId] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  type PopupMsg = string | { message: string; word: string };
  const [popupMessage, setPopupMessage] = useState<PopupMsg>("");
  const [stats, setStats] = useState({ gamesPlayed: 0, wins: 0, currentStreak: 0, winPercent: 0 });
  const [greyedLetters, setGreyedLetters] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ correctPosition: number; correctLetter: number }[]>([]);

  // Start a new game by calling backend
  const startNewGame = async () => {
    try {
      const res = await fetch(NEW_GAME_URL, { method: "POST" });
      const data = await res.json();
      setGameId(data.game_id);
      setGuesses([]);
      setCurrentGuess("");
      setGameOver(false);
      setWon(false);
      setShowPopup(false);
      setPopupMessage("");
      setGreyedLetters(new Set());
      setResults([]);
    } catch (err) {
      toast.error("Failed to start new game");
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses, gameOver]);

  const handleKeyPress = (key: string) => {
    if (currentGuess.length < WORD_LENGTH && !gameOver) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };


  const handleEnter = async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast.error("Word must be 4 letters!");
      return;
    }
    try {
      const res = await fetch(CHECK_GUESS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId, guess: currentGuess })
      });
      const data = await res.json();
      if (data.valid === false) {
  let msg = data.message;
  if (msg === "Invalid guess") msg = "Word not in list";
  if (msg === "Repeating letters not allowed") msg = "No repeating letter allowed";
  toast.error(msg);
  // Do not increment guesses/results, let user re-enter
  return;
      }
      const result = { correctPosition: data.correct_position, correctLetter: data.correct_letter };
      const newGuesses = [...guesses, currentGuess];
      const newResults = [...results, result];
      setGuesses(newGuesses);
      setResults(newResults);
      setCurrentGuess("");
      if (data.status === "win") {
        setWon(true);
        setGameOver(true);
        // Custom win messages based on guess number
        const guessNum = newGuesses.length;
        let winMsg = "Congratulations! You won!";
        switch (guessNum) {
          case 1:
            winMsg = "You are one of a kind!"; break;
          case 2:
            winMsg = "Two-good!"; break;
          case 3:
            winMsg = "Threemendous!"; break;
          case 4:
            winMsg = "Fourtastic!"; break;
          case 5:
            winMsg = "High five!"; break;
          case 6:
            winMsg = "Sixessful!"; break;
          case 7:
            winMsg = "Seven in the glory!"; break;
          case 8:
            winMsg = "A hardword indeed."; break;
        }
        // Update win history in localStorage (Wordle logic)
        let history = JSON.parse(localStorage.getItem("winHistory") || "{}") || {};
        history.gamesPlayed = (history.gamesPlayed || 0) + 1;
        history.wins = (history.wins || 0) + 1;
        // Streak logic: increment if last game was a win, else reset
        if (history.lastResult === "win") {
          history.currentStreak = (history.currentStreak || 0) + 1;
        } else {
          history.currentStreak = 1;
        }
        history.lastResult = "win";
        history.winPercent = Math.round((history.wins / history.gamesPlayed) * 100);
        localStorage.setItem("winHistory", JSON.stringify(history));
        setStats({
          gamesPlayed: history.gamesPlayed,
          wins: history.wins,
          currentStreak: history.currentStreak,
          winPercent: history.winPercent
        });
        setPopupMessage(winMsg);
        setTimeout(() => {
          setShowPopup(true);
          setWasPopupShown(true);
        }, 500);
      } else if (data.status === "lose") {
        setGameOver(true);
        // On loss, increment games played, reset streak
        let history = JSON.parse(localStorage.getItem("winHistory") || "{}") || {};
        history.gamesPlayed = (history.gamesPlayed || 0) + 1;
        history.currentStreak = 0;
        history.lastResult = "lose";
        history.winPercent = history.gamesPlayed > 0 ? Math.round((history.wins || 0) / history.gamesPlayed * 100) : 0;
        localStorage.setItem("winHistory", JSON.stringify(history));
        setStats({
          gamesPlayed: history.gamesPlayed,
          wins: history.wins || 0,
          currentStreak: 0,
          winPercent: history.winPercent
        });
  setPopupMessage({
    message: "Better luck next time! The word was ",
    word: data.target_word
  });
        setShowPopup(true);
      }
    } catch (err) {
      toast.error("Failed to check guess");
    }
  };

  const handleToggleGrey = (letter: string) => {
    const newGreyed = new Set(greyedLetters);
    if (newGreyed.has(letter)) {
      newGreyed.delete(letter);
    } else {
      newGreyed.add(letter);
    }
    setGreyedLetters(newGreyed);
  };


  const resetGame = () => {
    startNewGame();
  };

  return (
  <div className="flex flex-col items-center justify-between min-h-screen py-2 px-1">
      <div className="w-full max-w-md">
        {showReloadMsg && (
          <div className="mb-4 text-center text-lg text-white font-semibold">
            Reload the page for a new game
          </div>
        )}
        <div className="text-center mb-8">
          {/* Logo placeholder - replace 'logo.png' with your actual image filename */}
          <img src="/logo.png" alt="Game Logo" className="mx-auto mb-4 w-32 h-32 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            <span style={{ color: '#16a34a' }}>Cows and </span>
            <span style={{ color: '#facc15' }}>bulls</span>
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-xs">
            Guess the 4-letter word in {MAX_GUESSES} tries
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {[...Array(MAX_GUESSES)].map((_, index) => {
            const isCurrentRow = index === guesses.length;
            const guess = guesses[index] || (isCurrentRow ? currentGuess : "");
            const isSubmitted = index < guesses.length;
            const result = results[index] || { correctPosition: 0, correctLetter: 0 };

            return (
              <GameRow
                key={index}
                guess={guess}
                isActive={isCurrentRow}
                isSubmitted={isSubmitted}
                correctPosition={result.correctPosition}
                correctLetter={result.correctLetter}
              />
            );
          })}
        </div>

        {/* ...existing code... (indicator legend removed) */}

        {/* Popup for win/lose */}
        {showPopup && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
            onClick={() => {
              setShowPopup(false);
              if (wasPopupShown && (gameOver || won)) setShowReloadMsg(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="rounded-lg shadow-lg p-8 text-center relative"
              style={{ background: '#84c07bff' }}
              onClick={e => e.stopPropagation()}
            >
              {typeof popupMessage === "string" ? (
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{popupMessage}</h2>
              ) : (
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {popupMessage.message}
                  <span style={{ color: '#000', fontWeight: 'bold' }}>
                    {popupMessage.word?.toUpperCase()}
                  </span>
                </h2>
              )}
              <div className="mb-4 flex flex-row justify-center gap-8 text-gray-900 text-lg">
                <div><b>Games Played:</b> {stats.gamesPlayed}</div>
                <div><b>Wins:</b> {stats.wins}</div>
                <div><b>Win %:</b> {stats.winPercent}</div>
                <div><b>Current Streak:</b> {stats.currentStreak}</div>
              </div>
              <div className="flex flex-row justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 flex items-center gap-2"
                  style={{ textShadow: '1px 1px 2px black' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                  Play Again
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("winHistory");
                    setStats({ gamesPlayed: 0, wins: 0, currentStreak: 0, winPercent: 0 });
                  }}
                  className="bg-[#FFC300] hover:bg-[#FFB000] text-white font-bold px-6"
                  style={{}}
                >
                  Reset Stats
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Keyboard
        onKeyPress={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
        greyedLetters={greyedLetters}
        onToggleGrey={handleToggleGrey}
      />
      {showReloadMsg && (
        <div className="mt-6 text-center text-lg text-gray-700 font-semibold">
          Reload the page for a new game
        </div>
      )}
    </div>
  );
};
