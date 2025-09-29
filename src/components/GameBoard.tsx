import { useState, useEffect } from "react";
import { GameRow } from "./GameRow";
import { Keyboard } from "./Keyboard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WORD_LENGTH = 4;
const MAX_GUESSES = 8;

// Sample word list - you can expand this
const WORDS = ["PLAY", "GAME", "CODE", "WORD", "TILE", "HELP", "STAR", "MOON", "FIRE", "WIND"];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const checkGuess = (guess: string, target: string) => {
  const targetArray = target.split("");
  const guessArray = guess.split("");
  let correctPosition = 0;
  let correctLetter = 0;

  const targetCopy = [...targetArray];
  const guessCopy = [...guessArray];

  // First pass: count correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessCopy[i] === targetCopy[i]) {
      correctPosition++;
      targetCopy[i] = "";
      guessCopy[i] = "";
    }
  }

  // Second pass: count correct letters in wrong positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessCopy[i] !== "") {
      const index = targetCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        correctLetter++;
        targetCopy[index] = "";
      }
    }
  }

  return { correctPosition, correctLetter };
};

export const GameBoard = () => {
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [greyedLetters, setGreyedLetters] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ correctPosition: number; correctLetter: number }[]>([]);

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

  const handleEnter = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast.error("Word must be 4 letters!");
      return;
    }

    const result = checkGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, result];
    
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess("");

    if (result.correctPosition === WORD_LENGTH) {
      setWon(true);
      setGameOver(true);
      toast.success("Congratulations! You won! 🎉");
    } else if (newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
      toast.error(`Game Over! The word was ${targetWord}`);
    } else {
      toast.info(`${result.correctPosition} correct, ${result.correctLetter} present`);
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
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setWon(false);
    setGreyedLetters(new Set());
    setResults([]);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent mb-2">
            Cows and Bulls
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">
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

        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--correct-indicator))]" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Cows (right place)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--present-indicator))]" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Bulls (wrong place)</span>
            </div>
          </div>
        </div>

        {gameOver && (
          <div className="text-center mb-6">
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] hover:opacity-90 text-white font-semibold px-8"
            >
              Play Again
            </Button>
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
    </div>
  );
};
