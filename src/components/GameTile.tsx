import { cn } from "@/lib/utils";

interface GameTileProps {
  letter: string;
  index: number;
  isActive: boolean;
  isSubmitted: boolean;
}

export const GameTile = ({ letter, index, isActive, isSubmitted }: GameTileProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <div
      className={cn(
        isMobile
          ? "w-8 h-8 text-lg" // Smaller tiles for mobile
          : "w-12 h-12 sm:w-14 sm:h-14 text-2xl sm:text-3xl",
        "border-2 rounded-lg flex items-center justify-center font-bold uppercase transition-all duration-300",
        letter && !isSubmitted && "border-[hsl(var(--tile-active))] tile-pop",
        !letter && !isActive && "border-[hsl(var(--tile-border))] bg-[hsl(var(--tile-empty))]",
        !letter && isActive && "border-[hsl(var(--tile-active))] bg-[hsl(var(--tile-empty))]",
        letter && !isSubmitted && "bg-[hsl(var(--tile-empty))] text-[hsl(var(--tile-filled))]",
        isSubmitted && "bg-[hsl(var(--muted))] border-[hsl(var(--tile-border))] text-[hsl(var(--muted-foreground))]"
      )}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {letter}
    </div>
  );
};
