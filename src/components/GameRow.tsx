import { GameTile } from "./GameTile";
import { FeedbackIndicator } from "./FeedbackIndicator";

interface GameRowProps {
  guess: string;
  isActive: boolean;
  isSubmitted: boolean;
  correctPosition: number;
  correctLetter: number;
}

export const GameRow = ({ guess, isActive, isSubmitted, correctPosition, correctLetter }: GameRowProps) => {
  const letters = guess.padEnd(4, " ").split("");

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-2">
        {letters.map((letter, index) => (
          <GameTile
            key={index}
            letter={letter.trim()}
            index={index}
            isActive={isActive && !isSubmitted}
            isSubmitted={isSubmitted}
          />
        ))}
      </div>
      <FeedbackIndicator
        correctPosition={correctPosition}
        correctLetter={correctLetter}
        isVisible={isSubmitted}
      />
    </div>
  );
};
