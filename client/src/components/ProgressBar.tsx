interface ProgressBarProps {
  progress: number;
  rank: string;
  className?: string;
}

export default function ProgressBar({ progress, rank, className = "" }: ProgressBarProps) {
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronze":
        return "bg-bronze";
      case "silver":
        return "bg-silver";
      case "gold":
        return "bg-gold";
      case "diamond":
        return "bg-diamond";
      case "emerald":
        return "bg-emerald";
      default:
        return "bg-bronze";
    }
  };

  const getNextRank = (currentRank: string) => {
    const ranks = ["bronze", "silver", "gold", "diamond", "emerald"];
    const currentIndex = ranks.indexOf(currentRank.toLowerCase());
    if (currentIndex === -1 || currentIndex === ranks.length - 1) {
      return "Max Rank";
    }
    return ranks[currentIndex + 1].charAt(0).toUpperCase() + ranks[currentIndex + 1].slice(1);
  };

  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className={`${getRankColor(rank)} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-sm text-warm-gray">
        {progress >= 100 ? "Max Rank Reached" : `${Math.round(progress)}% to ${getNextRank(rank)}`}
      </p>
    </div>
  );
}
