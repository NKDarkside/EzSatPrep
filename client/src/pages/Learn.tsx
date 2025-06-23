import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import { 
  Book, 
  Play, 
  FileText, 
  CheckCircle, 
  Clock, 
  Star,
  ChevronRight,
  BookOpen,
  Calculator,
  PenTool,
  Target,
  Lightbulb,
  Download
} from "lucide-react";

export default function Learn() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const readingWritingTopics = [
    {
      id: "reading-comprehension",
      title: "Reading Comprehension",
      description: "Master techniques for understanding and analyzing passages",
      lessons: [
        { id: "main-ideas", title: "Identifying Main Ideas", duration: "15 min", type: "video" },
        { id: "supporting-details", title: "Supporting Details & Evidence", duration: "12 min", type: "video" },
        { id: "inference", title: "Making Inferences", duration: "18 min", type: "video" },
        { id: "vocab-context", title: "Vocabulary in Context", duration: "10 min", type: "interactive" }
      ]
    },
    {
      id: "writing-language",
      title: "Writing & Language",
      description: "Perfect your grammar, usage, and rhetorical skills",
      lessons: [
        { id: "grammar-basics", title: "Grammar Fundamentals", duration: "20 min", type: "video" },
        { id: "punctuation", title: "Punctuation Rules", duration: "15 min", type: "interactive" },
        { id: "sentence-structure", title: "Sentence Structure", duration: "25 min", type: "video" },
        { id: "style-tone", title: "Style & Tone", duration: "18 min", type: "video" }
      ]
    },
    {
      id: "essay-writing",
      title: "Essay Writing",
      description: "Learn to write compelling and well-structured essays",
      lessons: [
        { id: "thesis-development", title: "Developing a Strong Thesis", duration: "22 min", type: "video" },
        { id: "evidence-analysis", title: "Analyzing Evidence", duration: "20 min", type: "interactive" },
        { id: "essay-structure", title: "Essay Organization", duration: "16 min", type: "video" },
        { id: "conclusion-writing", title: "Writing Conclusions", duration: "12 min", type: "video" }
      ]
    }
  ];

  const mathTopics = [
    {
      id: "algebra",
      title: "Algebra",
      description: "Master linear equations, systems, and algebraic expressions",
      lessons: [
        { id: "linear-equations", title: "Linear Equations", duration: "25 min", type: "video" },
        { id: "systems-equations", title: "Systems of Equations", duration: "30 min", type: "video" },
        { id: "inequalities", title: "Inequalities", duration: "20 min", type: "interactive" },
        { id: "functions", title: "Functions", duration: "35 min", type: "video" }
      ]
    },
    {
      id: "geometry",
      title: "Geometry",
      description: "Understand shapes, angles, area, and volume",
      lessons: [
        { id: "angles-triangles", title: "Angles & Triangles", duration: "28 min", type: "video" },
        { id: "circles", title: "Circles", duration: "22 min", type: "video" },
        { id: "area-volume", title: "Area & Volume", duration: "25 min", type: "interactive" },
        { id: "coordinate-geometry", title: "Coordinate Geometry", duration: "30 min", type: "video" }
      ]
    },
    {
      id: "statistics",
      title: "Statistics & Probability",
      description: "Analyze data and understand probability concepts",
      lessons: [
        { id: "data-analysis", title: "Data Analysis", duration: "20 min", type: "interactive" },
        { id: "probability", title: "Probability", duration: "18 min", type: "video" },
        { id: "distributions", title: "Distributions", duration: "25 min", type: "video" },
        { id: "correlation", title: "Correlation vs Causation", duration: "15 min", type: "video" }
      ]
    }
  ];

  const studyGuides = [
    {
      title: "SAT Math Formula Sheet",
      description: "Essential formulas and equations for the SAT Math section",
      type: "PDF",
      pages: 4,
      downloadUrl: "#"
    },
    {
      title: "Reading Strategies Guide",
      description: "Proven techniques for tackling reading comprehension",
      type: "PDF", 
      pages: 8,
      downloadUrl: "#"
    },
    {
      title: "Grammar Quick Reference",
      description: "Common grammar rules and punctuation guidelines",
      type: "PDF",
      pages: 6,
      downloadUrl: "#"
    },
    {
      title: "Test Day Checklist",
      description: "Everything you need to know for test day success",
      type: "PDF",
      pages: 2,
      downloadUrl: "#"
    }
  ];

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'interactive':
        return <Target className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getTopicProgress = (topic: any) => {
    const completedCount = topic.lessons.filter((lesson: any) => 
      completedLessons.has(lesson.id)
    ).length;
    return Math.round((completedCount / topic.lessons.length) * 100);
  };

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-warm-gray mb-2">Learn</h1>
          <p className="text-warm-gray">Comprehensive lessons and study materials to master the SAT</p>
        </div>

        <Tabs defaultValue="reading-writing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reading-writing" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Reading & Writing</span>
            </TabsTrigger>
            <TabsTrigger value="math" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Math</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Study Guides</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading-writing" className="space-y-6">
            <div className="grid gap-6">
              {readingWritingTopics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <PenTool className="mr-2 h-5 w-5 text-forest-green" />
                          {topic.title}
                        </CardTitle>
                        <p className="text-warm-gray mt-1">{topic.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-forest-green">
                          {getTopicProgress(topic)}% Complete
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-forest-green h-2 rounded-full" 
                            style={{ width: `${getTopicProgress(topic)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topic.lessons.map((lesson) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        return (
                          <div 
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-forest-green'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <div className="flex items-center space-x-2">
                                {getLessonIcon(lesson.type)}
                                <span className="font-medium text-warm-gray">{lesson.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1 text-sm text-warm-gray">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                              <Button
                                size="sm"
                                variant={isCompleted ? "outline" : "default"}
                                className={isCompleted ? "" : "bg-forest-green text-white hover:bg-green-600"}
                                onClick={() => !isCompleted && handleLessonComplete(lesson.id)}
                              >
                                {isCompleted ? "Review" : "Start"}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="math" className="space-y-6">
            <div className="grid gap-6">
              {mathTopics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Calculator className="mr-2 h-5 w-5 text-forest-green" />
                          {topic.title}
                        </CardTitle>
                        <p className="text-warm-gray mt-1">{topic.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-forest-green">
                          {getTopicProgress(topic)}% Complete
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-forest-green h-2 rounded-full" 
                            style={{ width: `${getTopicProgress(topic)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topic.lessons.map((lesson) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        return (
                          <div 
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-forest-green'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <div className="flex items-center space-x-2">
                                {getLessonIcon(lesson.type)}
                                <span className="font-medium text-warm-gray">{lesson.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1 text-sm text-warm-gray">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                              <Button
                                size="sm"
                                variant={isCompleted ? "outline" : "default"}
                                className={isCompleted ? "" : "bg-forest-green text-white hover:bg-green-600"}
                                onClick={() => !isCompleted && handleLessonComplete(lesson.id)}
                              >
                                {isCompleted ? "Review" : "Start"}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Study Guides */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-forest-green" />
                      Study Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyGuides.map((guide, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-light-beige rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-forest-green" />
                            <div>
                              <h4 className="font-semibold text-warm-gray">{guide.title}</h4>
                              <p className="text-sm text-warm-gray">{guide.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">{guide.type}</Badge>
                                <span className="text-xs text-warm-gray">{guide.pages} pages</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="bg-forest-green text-white hover:bg-green-600">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Study Tips */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-gold" />
                      Study Tips & Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="time-management">
                        <AccordionTrigger className="text-left">Time Management</AccordionTrigger>
                        <AccordionContent className="text-warm-gray">
                          <ul className="space-y-2 text-sm">
                            <li>• Allocate specific time slots for each subject</li>
                            <li>• Use the Pomodoro Technique (25 min study, 5 min break)</li>
                            <li>• Practice with timed sections regularly</li>
                            <li>• Don't spend too much time on difficult questions</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="test-strategies">
                        <AccordionTrigger className="text-left">Test-Taking Strategies</AccordionTrigger>
                        <AccordionContent className="text-warm-gray">
                          <ul className="space-y-2 text-sm">
                            <li>• Always eliminate obviously wrong answers first</li>
                            <li>• Mark difficult questions and return to them later</li>
                            <li>• Read questions carefully before looking at answer choices</li>
                            <li>• Use context clues for vocabulary questions</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="stress-management">
                        <AccordionTrigger className="text-left">Stress Management</AccordionTrigger>
                        <AccordionContent className="text-warm-gray">
                          <ul className="space-y-2 text-sm">
                            <li>• Get adequate sleep, especially before practice tests</li>
                            <li>• Practice relaxation techniques and deep breathing</li>
                            <li>• Maintain a consistent study schedule</li>
                            <li>• Take regular breaks to avoid burnout</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="review-techniques">
                        <AccordionTrigger className="text-left">Review Techniques</AccordionTrigger>
                        <AccordionContent className="text-warm-gray">
                          <ul className="space-y-2 text-sm">
                            <li>• Review both correct and incorrect answers</li>
                            <li>• Understand why wrong answers are incorrect</li>
                            <li>• Keep a log of recurring mistake patterns</li>
                            <li>• Focus more time on your weakest areas</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Quick Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5 text-gold" />
                      Quick Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-1">Test Structure</h4>
                        <p className="text-blue-700">Reading & Writing: 54 questions, 64 minutes</p>
                        <p className="text-blue-700">Math: 44 questions, 70 minutes</p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-1">Scoring</h4>
                        <p className="text-green-700">Total Score: 400-1600</p>
                        <p className="text-green-700">Each section: 200-800</p>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-1">Test Dates</h4>
                        <p className="text-yellow-700">Offered 7 times per year</p>
                        <p className="text-yellow-700">Register 4-6 weeks in advance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
