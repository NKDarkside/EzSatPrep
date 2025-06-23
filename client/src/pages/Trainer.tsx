import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Dumbbell, Brain, Target, TrendingUp, Zap, Settings } from "lucide-react";

export default function Trainer() {
  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">Adaptive Trainer</h1>
          <p className="text-warm-gray">AI-powered training that adapts to your strengths and weaknesses</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Training Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-forest-green" />
                  Intelligent Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray mb-6">
                  Our AI trainer analyzes your performance patterns and adapts difficulty in real-time to maximize your learning potential.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="bg-forest-green text-white hover:bg-green-600 h-20">
                    <div className="text-center">
                      <Dumbbell className="h-6 w-6 mx-auto mb-2" />
                      <div>Reading & Writing Trainer</div>
                      <div className="text-sm opacity-80">Adaptive Mode</div>
                    </div>
                  </Button>
                  <Button className="bg-forest-green text-white hover:bg-green-600 h-20">
                    <div className="text-center">
                      <Target className="h-6 w-6 mx-auto mb-2" />
                      <div>Math Trainer</div>
                      <div className="text-sm opacity-80">Adaptive Mode</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How Adaptive Training Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-forest-green rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-warm-gray">Initial Assessment</h4>
                      <p className="text-sm text-warm-gray">Start with questions that gauge your current skill level</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-forest-green rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-warm-gray">Real-time Adaptation</h4>
                      <p className="text-sm text-warm-gray">Difficulty adjusts based on your performance patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-forest-green rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-warm-gray">Weakness Targeting</h4>
                      <p className="text-sm text-warm-gray">Focus on areas where you need the most improvement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-forest-green rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-warm-gray">Strength Reinforcement</h4>
                      <p className="text-sm text-warm-gray">Maintain your strong areas while building weak ones</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-gold" />
                  Training Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                    <span>Personalized question selection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                    <span>Adaptive difficulty scaling</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                    <span>Weakness identification</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                    <span>Progress optimization</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                    <span>Performance analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-gold" />
                  Your Training Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Adaptation Rate</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-forest-green h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Learning Efficiency</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gold h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Improvement Rate</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Settings className="mr-2 h-5 w-5 text-warm-gray" />
                  Training Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize Training
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Set Learning Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
