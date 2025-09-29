import { cn } from "@/lib/utils";

interface FeedbackIndicatorProps {
  correctPosition: number;
  correctLetter: number;
  isVisible: boolean;
}

export const FeedbackIndicator = ({ correctPosition, correctLetter, isVisible }: FeedbackIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex gap-3 items-center ml-3">
      {/* Correct position indicators */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {[...Array(Math.min(2, correctPosition))].map((_, i) => (
            <div
              key={`correct-${i}`}
              className="w-3 h-3 rounded-full bg-[hsl(var(--correct-indicator))] animate-in zoom-in duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        {correctPosition > 2 && (
          <div className="flex gap-1">
            {[...Array(correctPosition - 2)].map((_, i) => (
              <div
                key={`correct-extra-${i}`}
                className="w-3 h-3 rounded-full bg-[hsl(var(--correct-indicator))] animate-in zoom-in duration-300"
                style={{ animationDelay: `${(i + 2) * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Correct letter wrong position indicators */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {[...Array(Math.min(2, correctLetter))].map((_, i) => (
            <div
              key={`present-${i}`}
              className="w-3 h-3 rounded-full border-2 border-[hsl(var(--present-indicator))] animate-in zoom-in duration-300"
              style={{ animationDelay: `${(correctPosition + i) * 0.1}s` }}
            />
          ))}
        </div>
        {correctLetter > 2 && (
          <div className="flex gap-1">
            {[...Array(correctLetter - 2)].map((_, i) => (
              <div
                key={`present-extra-${i}`}
                className="w-3 h-3 rounded-full border-2 border-[hsl(var(--present-indicator))] animate-in zoom-in duration-300"
                style={{ animationDelay: `${(correctPosition + 2 + i) * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
