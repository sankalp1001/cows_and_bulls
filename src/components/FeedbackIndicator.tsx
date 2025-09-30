interface FeedbackIndicatorProps {
  correctPosition: number;
  correctLetter: number;
  isVisible: boolean;
}

export const FeedbackIndicator = ({ correctPosition, correctLetter, isVisible }: FeedbackIndicatorProps) => {
  return (
    <div className="flex gap-3 items-center ml-3">
      {/* Green circle appears only after guess, otherwise empty border */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
          ${isVisible && correctPosition > 0 ? 'bg-green-600 text-white' : 'border-2 border-gray-400 bg-transparent text-white'}`}
      >
  {isVisible ? correctPosition : ""}
      </div>

      {/* Yellow circle appears only after guess, otherwise empty border */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
          ${isVisible && correctLetter > 0 ? 'bg-yellow-400 text-black' : 'border-2 border-gray-400 bg-transparent text-white'}`}
      >
  {isVisible ? correctLetter : ""}
      </div>
    </div>
  );
};
