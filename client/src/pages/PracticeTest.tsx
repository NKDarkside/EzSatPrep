import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Calculator,
  Timer,
  Flag,
  BarChart3
} from "lucide-react";

export default function PracticeTest() {
  const { toast } = useToast();
  const [testState, setTestState] = useState<'setup' | 'active' | 'paused' | 'completed'>('setup');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const sections = [
    {
      name: "Reading & Writing",
      subject: "reading_writing",
      questions: 54,
      timeLimit: 64 * 60, // 64 minutes in seconds
      icon: BookOpen
    },
    {
      name: "Math",
      subject: "math", 
      questions: 44,
      timeLimit: 70 * 60, // 70 minutes in seconds
      icon: Calculator
    }
  ];

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: [`/api/practice/random/${sections[currentSection]?.subject}/${sections[currentSection]?.questions}`],
    enabled: testState === 'active' && sections[currentSection] !== undefined,
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

  const startTestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/practice/session", {
        sessionType: "test",
        subject: "full_test",
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
      setTestState('active');
      setCurrentSection(0);
      setCurrentQuestion(0);
      setSectionTimeRemaining(sections[0].timeLimit);
      setTimeRemaining(sections.reduce((total, section) => total + section.timeLimit, 0));
      refetchQuestions();
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
        description: "Failed to start practice test",
        variant: "destructive",
      });
    }
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, userAnswer }: { questionId: number; userAnswer: string }) => {
      const response = await apiRequest("POST", "/api/practice/answer", {
        questionId,
        sessionId,
        userAnswer,
        isCorrect: false, // Will be calculated on server
        timeSpent: 30 // Mock time spent per question
      });
      return response.json();
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
      }
    }
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (testState === 'active' && timeRemaining > 0 && sectionTimeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
        
        setSectionTimeRemaining(prev => {
          if (prev <= 1) {
            handleSectionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testState, timeRemaining, sectionTimeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    startTestMutation.mutate();
  };

  const handlePauseTest = () => {
    setTestState('paused');
  };

  const handleResumeTest = () => {
    setTestState('active');
  };

  const handleEndTest = () => {
    setTestState('completed');
    calculateResults();
  };

  const handleTimeUp = () => {
    setTestState('completed');
    calculateResults();
  };

  const handleSectionComplete = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
      setSectionTimeRemaining(sections[currentSection + 1].timeLimit);
      refetchQuestions();
    } else {
      handleTimeUp();
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const questionKey = `${currentSection}-${questionIndex}`;
    setAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
    
    if (questions && questions[questionIndex]) {
      submitAnswerMutation.mutate({
        questionId: questions[questionIndex].id,
        userAnswer: answer
      });
    }
  };

  const handleFlagQuestion = (questionIndex: number) => {
    const questionKey = `${currentSection}-${questionIndex}`;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionKey)) {
        newSet.delete(questionKey);
      } else {
        newSet.add(questionKey);
      }
      return newSet;
    });
  };

  const calculateResults = () => {
    // Mock results calculation
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions, 0);
    const answeredQuestions = Object.keys(answers).length;
    const estimatedScore = Math.floor(800 + (answeredQuestions / totalQuestions) * 800);
    
    setTestResults({
      totalQuestions,
      answeredQuestions,
      estimatedScore,
      sectionScores: sections.map(section => ({
        name: section.name,
        score: Math.floor(200 + (answeredQuestions / totalQuestions) * 600)
      }))
    });
    setShowResults(true);
  };

  const currentQuestionData = questions?.[currentQuestion];
  const questionKey = `${currentSection}-${currentQuestion}`;
  const selectedAnswer = answers[questionKey];
  const isFlagged = flaggedQuestions.has(questionKey);

  if (testState === 'setup') {
    return (
      <div className="min-h-screen bg-light-beige">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">SAT Practice Test</h1>
            <p className="text-warm-gray">Full-length, timed practice test that simulates the real SAT experience</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Timer className="mr-2 h-5 w-5 text-forest-green" />
                Test Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                  <div key={index} className="p-4 bg-light-beige rounded-lg">
                    <div className="flex items-center mb-3">
                      <section.icon className="h-5 w-5 mr-2 text-forest-green" />
                      <h3 className="font-nunito font-semibold text-warm-gray">{section.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm text-warm-gray">
                      <p><strong>{section.questions}</strong> questions</p>
                      <p><strong>{Math.floor(section.timeLimit / 60)}</strong> minutes</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• This is a full-length practice test that will take approximately 2 hours and 14 minutes</li>
                  <li>• You can pause the test, but the timer will continue running</li>
                  <li>• All questions must be answered before time expires</li>
                  <li>• You can flag questions for review and return to them later</li>
                  <li>• Your results will be available immediately after completion</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handleStartTest}
              disabled={startTestMutation.isPending}
              className="bg-forest-green text-white hover:bg-green-600 px-8 py-4 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Practice Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (testState === 'paused') {
    return (
      <div className="min-h-screen bg-light-beige flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Test Paused</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Pause className="h-16 w-16 mx-auto text-warm-gray" />
            <p className="text-warm-gray">Your practice test is paused. The timer is still running.</p>
            <div className="space-y-2">
              <Button onClick={handleResumeTest} className="w-full bg-forest-green text-white">
                <Play className="mr-2 h-4 w-4" />
                Resume Test
              </Button>
              <Button onClick={handleEndTest} variant="outline" className="w-full">
                <Square className="mr-2 h-4 w-4" />
                End Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      {/* Test Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Badge className="bg-forest-green text-white">
                {sections[currentSection]?.name}
              </Badge>
              <span className="text-sm text-warm-gray">
                Question {currentQuestion + 1} of {sections[currentSection]?.questions}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-warm-gray" />
                <span className="text-warm-gray">Section: {formatTime(sectionTimeRemaining)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Timer className="h-4 w-4 text-warm-gray" />
                <span className="text-warm-gray">Total: {formatTime(timeRemaining)}</span>
              </div>
              <Button onClick={handlePauseTest} variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
              <Button onClick={handleEndTest} variant="outline" size="sm">
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-3">
            {currentQuestionData && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{currentQuestionData.difficulty}</Badge>
                      <Badge variant="outline">{currentQuestionData.topic}</Badge>
                    </div>
                    <Button
                      onClick={() => handleFlagQuestion(currentQuestion)}
                      variant="ghost"
                      size="sm"
                      className={isFlagged ? "text-gold" : "text-warm-gray"}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-warm-gray mb-4">
                      {currentQuestionData.question}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {currentQuestionData.options?.map((option: string, index: number) => {
                      const optionLetter = String.fromCharCode(65 + index);
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
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

                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentQuestion(Math.min(sections[currentSection].questions - 1, currentQuestion + 1))}
                      disabled={currentQuestion === sections[currentSection].questions - 1}
                      className="bg-forest-green text-white hover:bg-green-600"
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-sm">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {Array.from({ length: sections[currentSection]?.questions || 0 }, (_, index) => {
                    const questionKey = `${currentSection}-${index}`;
                    const isAnswered = answers[questionKey] !== undefined;
                    const isFlagged = flaggedQuestions.has(questionKey);
                    const isCurrent = index === currentQuestion;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-8 h-8 text-xs rounded flex items-center justify-center relative ${
                          isCurrent
                            ? 'bg-forest-green text-white'
                            : isAnswered
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-warm-gray border'
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-gold" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-2 text-xs text-warm-gray">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-forest-green rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-gold" />
                    <span>Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-forest-green" />
              Practice Test Results
            </DialogTitle>
          </DialogHeader>
          {testResults && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-nunito font-bold text-forest-green mb-2">
                  {testResults.estimatedScore}
                </div>
                <p className="text-warm-gray">Estimated Total Score</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {testResults.sectionScores.map((section: any, index: number) => (
                  <div key={index} className="p-4 bg-light-beige rounded-lg">
                    <h4 className="font-semibold text-warm-gray mb-2">{section.name}</h4>
                    <div className="text-2xl font-bold text-forest-green">{section.score}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Test Summary</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>Questions Answered: {testResults.answeredQuestions} of {testResults.totalQuestions}</p>
                  <p>Completion Rate: {Math.round((testResults.answeredQuestions / testResults.totalQuestions) * 100)}%</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-forest-green text-white hover:bg-green-600"
                >
                  Take Another Test
                </Button>
                <Button variant="outline">
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
