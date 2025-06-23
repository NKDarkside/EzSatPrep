import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import RankBadge from "@/components/RankBadge";
import ProgressBar from "@/components/ProgressBar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Trophy, Target, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Practice() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const { data: progress } = useQuery({
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

  const startSessionMutation = useMutation({
    mutationFn: async ({ sessionType, subject }: { sessionType: string; subject: string }) => {
      const response = await apiRequest("POST", "/api/practice/session", {
        sessionType,
        subject,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        timeSpent: 0,
        completed: false
      });
      return response.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      loadNextQuestion();
    },
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
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start practice session",
        variant: "destructive",
      });
    }
  });

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: ["/api/practice/random/reading_writing/1"],
    enabled: false,
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, userAnswer, timeSpent }: { questionId: number; userAnswer: string; timeSpent: number }) => {
      const response = await apiRequest("POST", "/api/practice/answer", {
        questionId,
        sessionId,
        userAnswer,
        isCorrect: userAnswer === currentQuestion.correctAnswer,
        timeSpent
      });
      return response.json();
    },
    onSuccess: () => {
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
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
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    }
  });

  const loadNextQuestion = async () => {
    try {
      const response = await fetch("/api/practice/random/reading_writing/1");
      const data = await response.json();
      if (data && data.length > 0) {
        setCurrentQuestion(data[0]);
        setSelectedAnswer("");
        setShowResult(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question",
        variant: "destructive",
      });
    }
  };

  const handleStartPractice = (sessionType: string, subject: string) => {
    startSessionMutation.mutate({ sessionType, subject });
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      timeSpent: 30 // Mock time spent
    });
  };

  const handleNextQuestion = () => {
    loadNextQuestion();
  };

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

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">Practice</h1>
          <p className="text-warm-gray">Choose your practice mode and start improving your SAT scores</p>
        </div>

        {!currentQuestion ? (
          <>
            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-nunito font-semibold text-warm-gray">Reading & Writing</h3>
                    <RankBadge rank={readingProgress.rank} size="sm" showLabel={false} />
                  </div>
                  <ProgressBar 
                    progress={readingProgress.rankProgress} 
                    rank={readingProgress.rank} 
                    className="mb-4"
                  />
                  <div className="text-sm text-warm-gray">
                    <p>Questions: {readingProgress.totalQuestions} | Accuracy: {Math.round(readingProgress.averageAccuracy)}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-nunito font-semibold text-warm-gray">Math</h3>
                    <RankBadge rank={mathProgress.rank} size="sm" showLabel={false} />
                  </div>
                  <ProgressBar 
                    progress={mathProgress.rankProgress} 
                    rank={mathProgress.rank} 
                    className="mb-4"
                  />
                  <div className="text-sm text-warm-gray">
                    <p>Questions: {mathProgress.totalQuestions} | Accuracy: {Math.round(mathProgress.averageAccuracy)}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Practice Options */}
            <Tabs defaultValue="ranked" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ranked">Ranked Practice</TabsTrigger>
                <TabsTrigger value="unranked">Unranked Practice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ranked" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-gold" />
                      Ranked Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray mb-6">
                      Challenge yourself and climb the ranks! Your performance affects your ranking and unlocks harder questions.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => handleStartPractice("ranked", "reading_writing")}
                        className="bg-forest-green text-white hover:bg-green-600 h-16"
                        disabled={startSessionMutation.isPending}
                      >
                        <BookOpen className="mr-2 h-5 w-5" />
                        <div className="text-left">
                          <div>Reading & Writing</div>
                          <div className="text-sm opacity-80">Ranked Mode</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => handleStartPractice("ranked", "math")}
                        className="bg-forest-green text-white hover:bg-green-600 h-16"
                        disabled={startSessionMutation.isPending}
                      >
                        <Target className="mr-2 h-5 w-5" />
                        <div className="text-left">
                          <div>Math</div>
                          <div className="text-sm opacity-80">Ranked Mode</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="unranked" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Unranked Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray mb-6">
                      Practice without ranking pressure. Perfect for learning new concepts and experimenting with strategies.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => handleStartPractice("unranked", "reading_writing")}
                        variant="outline"
                        className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white h-16"
                        disabled={startSessionMutation.isPending}
                      >
                        <BookOpen className="mr-2 h-5 w-5" />
                        <div className="text-left">
                          <div>Reading & Writing</div>
                          <div className="text-sm opacity-80">Unranked Mode</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => handleStartPractice("unranked", "math")}
                        variant="outline"
                        className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white h-16"
                        disabled={startSessionMutation.isPending}
                      >
                        <Target className="mr-2 h-5 w-5" />
                        <div className="text-left">
                          <div>Math</div>
                          <div className="text-sm opacity-80">Unranked Mode</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* Question Interface */
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {currentQuestion.subject.replace('_', ' & ')}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.topic}
                  </Badge>
                </div>
                <div className="flex items-center text-warm-gray">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Question</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-warm-gray mb-4">
                  {currentQuestion.question}
                </h3>
              </div>

              {!showResult && (
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option: string, index: number) => {
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(optionLetter)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          selectedAnswer === optionLetter
                            ? 'border-forest-green bg-forest-green bg-opacity-10'
                            : 'border-gray-200 hover:border-forest-green'
                        }`}
                      >
                        <span className="font-semibold mr-3">{optionLetter}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {showResult && (
                <div className="mb-6 p-4 rounded-lg bg-light-beige">
                  <div className="flex items-center mb-3">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    <span className="font-semibold">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-warm-gray mb-2">
                    <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
                  </p>
                  <p className="text-warm-gray">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                {!showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer || submitAnswerMutation.isPending}
                    className="bg-forest-green text-white hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-forest-green text-white hover:bg-green-600"
                  >
                    Next Question
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => setCurrentQuestion(null)}
                  className="border-warm-gray text-warm-gray hover:bg-warm-gray hover:text-white"
                >
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
