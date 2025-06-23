import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Calendar, Target, Clock, Plus, CheckCircle, BookOpen } from "lucide-react";

export default function StudyPlan() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    targetScore: "",
    testDate: "",
    dailyGoal: "30",
    subjects: ["reading_writing", "math"]
  });

  const { data: studyPlans, isLoading } = useQuery({
    queryKey: ["/api/study-plans"],
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

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest("POST", "/api/study-plan", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-plans"] });
      setIsCreateDialogOpen(false);
      setNewPlan({
        name: "",
        targetScore: "",
        testDate: "",
        dailyGoal: "30",
        subjects: ["reading_writing", "math"]
      });
      toast({
        title: "Success",
        description: "Study plan created successfully!",
      });
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
        description: "Failed to create study plan",
        variant: "destructive",
      });
    }
  });

  const handleCreatePlan = () => {
    if (!newPlan.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a plan name",
        variant: "destructive",
      });
      return;
    }

    createPlanMutation.mutate({
      name: newPlan.name,
      targetScore: newPlan.targetScore ? parseInt(newPlan.targetScore) : null,
      testDate: newPlan.testDate ? new Date(newPlan.testDate) : null,
      dailyGoal: parseInt(newPlan.dailyGoal),
      subjects: newPlan.subjects,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilTest = (testDate: string) => {
    const today = new Date();
    const test = new Date(testDate);
    const diffTime = test.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">Study Plans</h1>
            <p className="text-warm-gray">Create and manage personalized study schedules</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-forest-green text-white hover:bg-green-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Study Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input
                    id="planName"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="e.g., Spring 2024 SAT Prep"
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetScore">Target Score (optional)</Label>
                  <Input
                    id="targetScore"
                    type="number"
                    value={newPlan.targetScore}
                    onChange={(e) => setNewPlan({ ...newPlan, targetScore: e.target.value })}
                    placeholder="e.g., 1400"
                    min="400"
                    max="1600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="testDate">Test Date (optional)</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={newPlan.testDate}
                    onChange={(e) => setNewPlan({ ...newPlan, testDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dailyGoal">Daily Study Goal (minutes)</Label>
                  <Input
                    id="dailyGoal"
                    type="number"
                    value={newPlan.dailyGoal}
                    onChange={(e) => setNewPlan({ ...newPlan, dailyGoal: e.target.value })}
                    min="15"
                    max="300"
                  />
                </div>
                
                <Button 
                  onClick={handleCreatePlan}
                  className="w-full bg-forest-green text-white hover:bg-green-600"
                  disabled={createPlanMutation.isPending}
                >
                  Create Study Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">Loading study plans...</p>
          </div>
        ) : studyPlans && studyPlans.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {studyPlans.map((plan: any) => (
              <Card key={plan.id} className={plan.isActive ? "border-forest-green" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.isActive && (
                      <Badge className="bg-forest-green text-white">Active</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plan.targetScore && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-warm-gray" />
                        <span className="text-sm text-warm-gray">
                          Target Score: <strong>{plan.targetScore}</strong>
                        </span>
                      </div>
                    )}
                    
                    {plan.testDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-warm-gray" />
                        <span className="text-sm text-warm-gray">
                          Test Date: <strong>{formatDate(plan.testDate)}</strong>
                          <span className="ml-2 text-forest-green">
                            ({getDaysUntilTest(plan.testDate)} days left)
                          </span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-warm-gray" />
                      <span className="text-sm text-warm-gray">
                        Daily Goal: <strong>{plan.dailyGoal} minutes</strong>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-warm-gray" />
                      <span className="text-sm text-warm-gray">Subjects: </span>
                      <div className="flex space-x-1">
                        {plan.subjects.map((subject: string) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject === 'reading_writing' ? 'Reading & Writing' : 'Math'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-forest-green text-white hover:bg-green-600">
                          Start Session
                        </Button>
                        <Button size="sm" variant="outline">
                          View Progress
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 mx-auto text-warm-gray mb-4" />
              <h3 className="text-xl font-nunito font-semibold text-warm-gray mb-2">
                No Study Plans Yet
              </h3>
              <p className="text-warm-gray mb-6">
                Create your first study plan to organize your SAT preparation journey
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-forest-green text-white hover:bg-green-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Plan
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Study Plan Templates */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Study Plan Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:border-forest-green cursor-pointer transition-colors">
                <h4 className="font-semibold text-warm-gray mb-2">Quick Prep (4 weeks)</h4>
                <p className="text-sm text-warm-gray mb-3">Intensive preparation for students with limited time</p>
                <div className="text-sm text-warm-gray">
                  <p>• 60 min/day</p>
                  <p>• Focus on weaknesses</p>
                  <p>• 2 practice tests</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:border-forest-green cursor-pointer transition-colors">
                <h4 className="font-semibold text-warm-gray mb-2">Standard Prep (8 weeks)</h4>
                <p className="text-sm text-warm-gray mb-3">Balanced approach for most students</p>
                <div className="text-sm text-warm-gray">
                  <p>• 45 min/day</p>
                  <p>• Comprehensive coverage</p>
                  <p>• 4 practice tests</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:border-forest-green cursor-pointer transition-colors">
                <h4 className="font-semibold text-warm-gray mb-2">Extended Prep (12 weeks)</h4>
                <p className="text-sm text-warm-gray mb-3">Thorough preparation for maximum improvement</p>
                <div className="text-sm text-warm-gray">
                  <p>• 30 min/day</p>
                  <p>• Deep concept mastery</p>
                  <p>• 6 practice tests</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
