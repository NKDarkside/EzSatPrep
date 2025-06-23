import { Award, Medal, Gem, Crown } from "lucide-react";

interface RankBadgeProps {
  rank: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function RankBadge({ rank, size = "md", showLabel = true }: RankBadgeProps) {
  const getRankConfig = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronze":
        return {
          color: "bg-bronze",
          icon: Medal,
          label: "Bronze",
          description: "Beginner"
        };
      case "silver":
        return {
          color: "bg-silver",
          icon: Medal,
          label: "Silver",
          description: "Improving"
        };
      case "gold":
        return {
          color: "bg-gold",
          icon: Award,
          label: "Gold",
          description: "Proficient"
        };
      case "diamond":
        return {
          color: "bg-diamond border-2 border-blue-300",
          icon: Gem,
          label: "Diamond",
          description: "Advanced",
          iconColor: "text-blue-600"
        };
      case "emerald":
        return {
          color: "bg-emerald",
          icon: Crown,
          label: "Emerald",
          description: "Expert"
        };
      default:
        return {
          color: "bg-bronze",
          icon: Medal,
          label: "Bronze",
          description: "Beginner"
        };
    }
  };

  const config = getRankConfig(rank);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} rounded-full ${config.color} flex items-center justify-center transition-transform hover:scale-110 duration-200`}>
        <Icon className={`${iconSizes[size]} ${config.iconColor || 'text-white'}`} />
      </div>
      {showLabel && (
        <div className="text-left">
          <p className="font-nunito font-semibold text-warm-gray">{config.label}</p>
          <p className="text-sm text-warm-gray">{config.description}</p>
        </div>
      )}
    </div>
  );
}
