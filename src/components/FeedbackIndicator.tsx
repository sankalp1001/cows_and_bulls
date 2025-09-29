interface FeedbackIndicatorProps {
  correctPosition: number;
  correctLetter: number;
  isVisible: boolean;
}

export const FeedbackIndicator = ({ correctPosition, correctLetter, isVisible }: FeedbackIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex gap-3 items-center ml-3">
      {/* Green circle for correct position */}
      <div className="w-8 h-8 rounded-full bg-[hsl(var(--correct-indicator))] flex items-center justify-center text-white font-bold text-sm animate-in zoom-in duration-300">
        {correctPosition}
      </div>

      {/* Yellow circle for correct letter wrong position */}
      <div className="w-8 h-8 rounded-full bg-[hsl(var(--present-indicator))] flex items-center justify-center text-white font-bold text-sm animate-in zoom-in duration-300" style={{ animationDelay: '0.1s' }}>
        {correctLetter}
      </div>
    </div>
  );
};
