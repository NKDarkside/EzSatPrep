import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import RankBadge from "@/components/RankBadge";
import ProgressBar from "@/components/ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BarChart3, 
  PieChart, 
  Calendar,
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Calculator
} from "lucide-react";

export default function Analytics() {
  const { toast } = useToast();

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user/progress"],
    onError: (error: Error) => {
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
    }
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/practice/sessions", { limit: 50 }],
    onError: (error: Error) => {
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
    }
  });

  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ["/api/user/answers"],
    onError: (error: Error) => {
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
    }
  });

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

  // Calculate analytics data
  const totalSessions = sessions?.length || 0;
  const rankedSessions = sessions?.filter((s: any) => s.sessionType === 'ranked').length || 0;
  const testSessions = sessions?.filter((s: any) => s.sessionType === 'test').length || 0;
  
  const recentSessions = sessions?.slice(0, 10) || [];
  const averageAccuracy = sessions?.length > 0 
    ? sessions.reduce((acc: number, session: any) => acc + session.accuracy, 0) / sessions.length 
    : 0;

  const totalTimeSpent = sessions?.reduce((acc: number, session: any) => acc + (session.timeSpent || 0), 0) || 0;
  const averageSessionTime = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;

  // Weekly performance data (mock calculation)
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const daysSessions = sessions?.filter((s: any) => {
      const sessionDate = new Date(s.createdAt);
      return sessionDate.toDateString() === date.toDateString();
    }) || [];
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: daysSessions.length,
      accuracy: daysSessions.length > 0 
        ? daysSessions.reduce((acc: number, s: any) => acc + s.accuracy, 0) / daysSessions.length 
        : 0,
      questions: daysSessions.reduce((acc: number, s: any) => acc + s.questionsAnswered, 0)
    };
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPerformanceTrend = () => {
    if (sessions && sessions.length >= 2) {
      const recent = sessions.slice(0, 5);
      const older = sessions.slice(5, 10);
      
      const recentAvg = recent.reduce((acc: number, s: any) => acc + s.accuracy, 0) / recent.length;
      const olderAvg = older.length > 0 ? older.reduce((acc: number, s: any) => acc + s.accuracy, 0) / older.length : recentAvg;
      
      if (recentAvg > olderAvg + 5) return 'improving';
      if (recentAvg < olderAvg - 5) return 'declining';
      return 'stable';
    }
    return 'stable';
  };

  const performanceTrend = getPerformanceTrend();

  if (progressLoading || sessionsLoading || answersLoading) {
    return (
      <div className="min-h-screen bg-light-beige">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-warm-gray">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">Analytics Dashboard</h1>
          <p className="text-warm-gray">Track your progress and identify areas for improvement</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-gray">Total Sessions</p>
                  <p className="text-2xl font-bold text-forest-green">{totalSessions}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-gray">Average Accuracy</p>
                  <p className="text-2xl font-bold text-forest-green">{Math.round(averageAccuracy)}%</p>
                </div>
                <Target className="h-8 w-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-gray">Study Time</p>
                  <p className="text-2xl font-bold text-forest-green">{formatTime(totalTimeSpent)}</p>
                </div>
                <Clock className="h-8 w-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-gray">Performance</p>
                  <p className="text-2xl font-bold text-forest-green capitalize">{performanceTrend}</p>
                </div>
                <TrendingUp className={`h-8 w-8 ${
                  performanceTrend === 'improving' ? 'text-green-500' :
                  performanceTrend === 'declining' ? 'text-red-500' : 'text-forest-green'
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Rank Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Rankings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-warm-gray" />
                        <span className="font-semibold">Reading & Writing</span>
                      </div>
                      <RankBadge rank={readingProgress.rank} size="sm" showLabel={false} />
                    </div>
                    <ProgressBar 
                      progress={readingProgress.rankProgress} 
                      rank={readingProgress.rank}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-5 w-5 text-warm-gray" />
                        <span className="font-semibold">Math</span>
                      </div>
                      <RankBadge rank={mathProgress.rank} size="sm" showLabel={false} />
                    </div>
                    <ProgressBar 
                      progress={mathProgress.rankProgress} 
                      rank={mathProgress.rank}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-warm-gray w-12">{day.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-forest-green h-2 rounded-full" 
                              style={{ width: `${Math.min((day.sessions / 5) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-warm-gray w-16 text-right">
                          {day.sessions} sessions
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Practice Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-light-beige rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          session.sessionType === 'ranked' ? 'bg-gold' :
                          session.sessionType === 'test' ? 'bg-emerald' : 'bg-silver'
                        }`} />
                        <div>
                          <p className="font-semibold text-warm-gray capitalize">
                            {session.subject.replace('_', ' & ')} - {session.sessionType}
                          </p>
                          <p className="text-sm text-warm-gray">
                            {session.correctAnswers}/{session.questionsAnswered} correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={session.accuracy >= 80 ? "default" : session.accuracy >= 60 ? "secondary" : "destructive"}>
                          {Math.round(session.accuracy)}%
                        </Badge>
                        <p className="text-xs text-warm-gray mt-1">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reading & Writing Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Rank</span>
                    <RankBadge rank={readingProgress.rank} size="sm" />
                  </div>
                  <ProgressBar 
                    progress={readingProgress.rankProgress} 
                    rank={readingProgress.rank}
                  />
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-warm-gray">Questions Answered</p>
                      <p className="text-lg font-semibold text-forest-green">{readingProgress.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-warm-gray">Overall Accuracy</p>
                      <p className="text-lg font-semibold text-forest-green">{Math.round(readingProgress.averageAccuracy)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Math Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Rank</span>
                    <RankBadge rank={mathProgress.rank} size="sm" />
                  </div>
                  <ProgressBar 
                    progress={mathProgress.rankProgress} 
                    rank={mathProgress.rank}
                  />
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-warm-gray">Questions Answered</p>
                      <p className="text-lg font-semibold text-forest-green">{mathProgress.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-warm-gray">Overall Accuracy</p>
                      <p className="text-lg font-semibold text-forest-green">{Math.round(mathProgress.averageAccuracy)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rank Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Your Ranking Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
                  {['bronze', 'silver', 'gold', 'diamond', 'emerald'].map((rank, index) => {
                    const isCompleted = ['bronze', 'silver', 'gold', 'diamond', 'emerald'].indexOf(readingProgress.rank) >= index ||
                                      ['bronze', 'silver', 'gold', 'diamond', 'emerald'].indexOf(mathProgress.rank) >= index;
                    const isCurrent = readingProgress.rank === rank || mathProgress.rank === rank;
                    
                    return (
                      <div key={rank} className="flex items-center">
                        <div className={`transition-opacity ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                          <RankBadge rank={rank} size="md" />
                          {isCurrent && (
                            <div className="text-center mt-2">
                              <Badge className="bg-forest-green text-white text-xs">Current</Badge>
                            </div>
                          )}
                        </div>
                        {index < 4 && (
                          <div className="hidden sm:block mx-4 text-warm-gray">→</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-warm-gray">Ranked Sessions</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="font-semibold">{rankedSessions}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-warm-gray">Practice Tests</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald rounded-full" />
                        <span className="font-semibold">{testSessions}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-warm-gray">Unranked Sessions</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-silver rounded-full" />
                        <span className="font-semibold">{totalSessions - rankedSessions - testSessions}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Session Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-forest-green mb-2">
                      {formatTime(averageSessionTime)}
                    </div>
                    <p className="text-sm text-warm-gray">per session</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accuracy Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      performanceTrend === 'improving' ? 'text-green-500' :
                      performanceTrend === 'declining' ? 'text-red-500' : 'text-forest-green'
                    }`}>
                      {performanceTrend === 'improving' ? '↗' : 
                       performanceTrend === 'declining' ? '↘' : '→'}
                    </div>
                    <p className="text-sm text-warm-gray capitalize">{performanceTrend}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance by Topic */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-warm-gray">Reading & Writing</span>
                      <span className="text-sm text-warm-gray">{Math.round(readingProgress.averageAccuracy)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-forest-green h-3 rounded-full" 
                        style={{ width: `${readingProgress.averageAccuracy}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-warm-gray">Math</span>
                      <span className="text-sm text-warm-gray">{Math.round(mathProgress.averageAccuracy)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-forest-green h-3 rounded-full" 
                        style={{ width: `${mathProgress.averageAccuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-forest-green" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readingProgress.averageAccuracy > mathProgress.averageAccuracy ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-warm-gray">Strong in Reading & Writing</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-warm-gray">Strong in Math</span>
                      </div>
                    )}
                    
                    {averageAccuracy > 75 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-warm-gray">Consistent high accuracy</span>
                      </div>
                    )}
                    
                    {rankedSessions > totalSessions * 0.6 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-warm-gray">Active in ranked practice</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-gold" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readingProgress.averageAccuracy < mathProgress.averageAccuracy ? (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-warm-gray">Focus on Reading & Writing</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-warm-gray">Focus on Math</span>
                      </div>
                    )}
                    
                    {averageAccuracy < 70 && (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-warm-gray">Work on overall accuracy</span>
                      </div>
                    )}
                    
                    {testSessions === 0 && (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-warm-gray">Take practice tests</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-gold" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {averageAccuracy < 75 && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-semibold text-blue-800 mb-1">Focus on Fundamentals</h4>
                      <p className="text-sm text-blue-700">
                        Your accuracy could improve. Consider spending more time on concept review before attempting practice questions.
                      </p>
                    </div>
                  )}
                  
                  {testSessions === 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-semibold text-yellow-800 mb-1">Take a Practice Test</h4>
                      <p className="text-sm text-yellow-700">
                        Practice tests help you get familiar with timing and identify weak areas. Consider taking one soon.
                      </p>
                    </div>
                  )}
                  
                  {Math.abs(readingProgress.averageAccuracy - mathProgress.averageAccuracy) > 15 && (
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-semibold text-green-800 mb-1">Balance Your Practice</h4>
                      <p className="text-sm text-green-700">
                        Focus more time on your weaker subject to create a more balanced score profile.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
