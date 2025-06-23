import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import RankBadge from "@/components/RankBadge";
import ProgressBar from "@/components/ProgressBar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { 
  PenTool,
  Dumbbell,
  Calendar,
  Clock,
  TrendingUp,
  Book,
  Trophy,
  Target
} from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user/progress"],
    retry: false,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/practice/sessions"],
    retry: false,
  });

  const { data: studyPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/study-plans"],
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    const handleError = (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    };

    // This would be handled by the query error handlers in a real implementation
  }, [toast]);

  const readingProgress = progress?.find((p: any) => p.subject === 'reading_writing') || {
    rank: 'bronze',
    rankProgress: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    averageAccuracy: 0
  };

  const mathProgress = progress?.find((p: any) => p.subject === 'math') || {
    rank: 'bronze',
    rankProgress: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    averageAccuracy: 0
  };

  const quickActions = [
    {
      title: "Ranked Practice",
      description: "Challenge yourself and climb the ranks",
      icon: Trophy,
      href: "/practice",
      color: "bg-forest-green"
    },
    {
      title: "Adaptive Trainer",
      description: "AI-powered personalized training",
      icon: Dumbbell,
      href: "/trainer",
      color: "bg-gold"
    },
    {
      title: "Practice Test",
      description: "Full-length timed SAT simulation",
      icon: Clock,
      href: "/practice-test",
      color: "bg-warm-gray"
    },
    {
      title: "Study Plan",
      description: "Structured learning path",
      icon: Target,
      href: "/study-plan",
      color: "bg-emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-warm-gray">Ready to continue your SAT preparation journey?</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reading & Writing Progress</span>
                <RankBadge rank={readingProgress.rank} size="sm" showLabel={false} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar 
                progress={readingProgress.rankProgress} 
                rank={readingProgress.rank} 
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-4 text-sm text-warm-gray">
                <div>
                  <p className="font-semibold">Questions Answered</p>
                  <p>{readingProgress.totalQuestions}</p>
                </div>
                <div>
                  <p className="font-semibold">Accuracy</p>
                  <p>{Math.round(readingProgress.averageAccuracy)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Math Progress</span>
                <RankBadge rank={mathProgress.rank} size="sm" showLabel={false} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar 
                progress={mathProgress.rankProgress} 
                rank={mathProgress.rank} 
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-4 text-sm text-warm-gray">
                <div>
                  <p className="font-semibold">Questions Answered</p>
                  <p>{mathProgress.totalQuestions}</p>
                </div>
                <div>
                  <p className="font-semibold">Accuracy</p>
                  <p>{Math.round(mathProgress.averageAccuracy)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-nunito font-semibold text-warm-gray mb-1">{action.title}</h3>
                      <p className="text-sm text-warm-gray">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Practice Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <p className="text-warm-gray">Loading recent sessions...</p>
              ) : sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session: any) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-light-beige rounded-lg">
                      <div>
                        <p className="font-semibold text-warm-gray capitalize">
                          {session.subject.replace('_', ' & ')} - {session.sessionType}
                        </p>
                        <p className="text-sm text-warm-gray">
                          {session.correctAnswers}/{session.questionsAnswered} correct ({Math.round(session.accuracy)}%)
                        </p>
                      </div>
                      <div className="text-sm text-warm-gray">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PenTool className="h-12 w-12 mx-auto text-warm-gray mb-4" />
                  <p className="text-warm-gray mb-4">No practice sessions yet</p>
                  <Link href="/practice">
                    <Button className="bg-forest-green text-white">Start Practicing</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <p className="text-warm-gray">Loading study plans...</p>
              ) : studyPlans && studyPlans.length > 0 ? (
                <div className="space-y-3">
                  {studyPlans.filter((plan: any) => plan.isActive).slice(0, 3).map((plan: any) => (
                    <div key={plan.id} className="p-3 bg-light-beige rounded-lg">
                      <h4 className="font-semibold text-warm-gray">{plan.name}</h4>
                      <p className="text-sm text-warm-gray">
                        Target: {plan.targetScore} | Daily Goal: {plan.dailyGoal} min
                      </p>
                      {plan.testDate && (
                        <p className="text-sm text-warm-gray">
                          Test Date: {new Date(plan.testDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-warm-gray mb-4" />
                  <p className="text-warm-gray mb-4">No study plans created</p>
                  <Link href="/study-plan">
                    <Button className="bg-forest-green text-white">Create Study Plan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
