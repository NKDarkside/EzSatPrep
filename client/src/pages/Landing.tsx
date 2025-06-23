import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RankBadge from "@/components/RankBadge";
import { 
  PenTool,
  Dumbbell,
  Calendar,
  Clock,
  TrendingUp,
  Book,
  Heart,
  Users,
  GraduationCap,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: PenTool,
      title: "Practice Questions",
      description: "Thousands of real SAT questions organized by topic and difficulty level.",
      details: ["Ranked Practice", "Unranked Practice"]
    },
    {
      icon: Dumbbell,
      title: "Adaptive Trainer",
      description: "AI-powered training that adapts to your strengths and weaknesses.",
      details: ["Personalized", "Difficulty Scaling"]
    },
    {
      icon: Calendar,
      title: "Custom Study Plans",
      description: "Personalized study schedules based on your test date and goals.",
      details: ["Goal Setting", "Progress Tracking"]
    },
    {
      icon: Clock,
      title: "Timed Practice Tests",
      description: "Full-length practice tests that simulate the real SAT experience.",
      details: ["Official Format", "Instant Scoring"]
    },
    {
      icon: TrendingUp,
      title: "Detailed Analytics",
      description: "Comprehensive performance tracking with actionable insights.",
      details: ["Score Trends", "Weakness Analysis"]
    },
    {
      icon: Book,
      title: "Learn Content",
      description: "Comprehensive lessons covering all SAT topics with examples.",
      details: ["Video Lessons", "Study Guides"]
    }
  ];

  const ranks = [
    { rank: "bronze", label: "Bronze", description: "Beginner" },
    { rank: "silver", label: "Silver", description: "Improving" },
    { rank: "gold", label: "Gold", description: "Proficient" },
    { rank: "diamond", label: "Diamond", description: "Advanced" },
    { rank: "emerald", label: "Emerald", description: "Expert" }
  ];

  const stats = [
    { value: "50K+", label: "Students Helped" },
    { value: "2M+", label: "Questions Practiced" },
    { value: "180+", label: "Average Score Increase" },
    { value: "100%", label: "Always Free" }
  ];

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-light-beige to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-nunito font-bold text-warm-gray mb-6">
              Master the SAT
              <span className="text-forest-green block">Completely Free</span>
            </h1>
            <p className="text-xl text-warm-gray mb-8 max-w-3xl mx-auto leading-relaxed">
              EZ SAT is a nonprofit organization dedicated to providing world-class SAT preparation to every student, regardless of their financial situation. Join thousands of students improving their scores daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-forest-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-lg"
              >
                Start Practicing Free
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                variant="outline"
                className="border-2 border-forest-green text-forest-green px-8 py-4 rounded-lg text-lg font-semibold hover:bg-forest-green hover:text-white transition-colors duration-200"
              >
                Take Practice Test
              </Button>
            </div>
          </div>

          {/* Mock Progress Display */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-nunito font-bold text-warm-gray mb-6 text-center">Sample Progress Tracking</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-light-beige">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-nunito font-semibold text-warm-gray">Reading & Writing</h4>
                    <RankBadge rank="gold" size="sm" showLabel={false} />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-gold h-3 rounded-full" style={{ width: "65%" }} />
                  </div>
                  <p className="text-sm text-warm-gray">65% to Diamond</p>
                </CardContent>
              </Card>

              <Card className="bg-light-beige">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-nunito font-semibold text-warm-gray">Math</h4>
                    <RankBadge rank="silver" size="sm" showLabel={false} />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-silver h-3 rounded-full" style={{ width: "40%" }} />
                  </div>
                  <p className="text-sm text-warm-gray">40% to Gold</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-nunito font-bold text-warm-gray mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Comprehensive SAT preparation tools that adapt to your learning style and track your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-light-beige hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-forest-green rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-nunito font-bold text-warm-gray mb-3">{feature.title}</h3>
                  <p className="text-warm-gray mb-4">{feature.description}</p>
                  <div className="flex justify-between text-sm text-warm-gray">
                    {feature.details.map((detail, idx) => (
                      <span key={idx}>• {detail}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking System Section */}
      <section className="py-20 bg-light-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-nunito font-bold text-warm-gray mb-4">
              Climb the Ranks
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Our ranking system motivates you to improve while tracking your progress across all SAT sections.
            </p>
          </div>

          <div className="flex justify-center items-center space-x-8 mb-12 flex-wrap gap-4">
            {ranks.map((rankData, index) => (
              <div key={rankData.rank} className="flex items-center">
                <RankBadge rank={rankData.rank} size="lg" />
                {index < ranks.length - 1 && (
                  <div className="hidden sm:block mx-4 text-warm-gray">→</div>
                )}
              </div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-nunito font-bold text-warm-gray mb-6 text-center">How Rankings Work</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-nunito font-semibold text-warm-gray mb-3">Ranked Practice</h4>
                  <ul className="space-y-2 text-warm-gray">
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Affects your ranking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Adaptive difficulty
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Performance tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Badge progression
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-nunito font-semibold text-warm-gray mb-3">Unranked Practice</h4>
                  <ul className="space-y-2 text-warm-gray">
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      No ranking pressure
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Focus on learning
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Experiment freely
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-forest-green mr-2 h-4 w-4" />
                      Still tracks progress
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-nunito font-bold text-warm-gray mb-4">
              Making an Impact
            </h2>
            <p className="text-xl text-warm-gray">
              See how EZ SAT is helping students achieve their dreams
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-light-beige">
                <CardContent className="p-6">
                  <div className="text-4xl font-nunito font-bold text-forest-green mb-2">{stat.value}</div>
                  <p className="text-warm-gray font-semibold">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nonprofit Mission Section */}
      <section className="py-20 bg-gradient-to-r from-forest-green to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-nunito font-bold mb-6">
              Our Nonprofit Mission
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              We believe every student deserves access to high-quality SAT preparation, regardless of their economic background. That's why everything on EZ SAT is completely free, forever.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Heart className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-nunito font-bold mb-2">100% Free</h3>
                <p>No hidden fees, no premium tiers, no paywalls</p>
              </div>
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-nunito font-bold mb-2">Open Access</h3>
                <p>Available to every student, everywhere</p>
              </div>
              <div className="text-center">
                <GraduationCap className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-nunito font-bold mb-2">Quality Education</h3>
                <p>Professional-grade preparation tools</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 shadow-lg">
                <Heart className="mr-2 h-5 w-5" />
                Support Our Mission
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-forest-green transition-colors duration-200"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-nunito font-bold mb-4">EZ SAT</h3>
              <p className="text-gray-300 mb-4">Free SAT preparation for everyone. Nonprofit organization committed to educational equity.</p>
            </div>
            <div>
              <h4 className="font-nunito font-semibold mb-4">Study Tools</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Practice Questions</li>
                <li>Adaptive Trainer</li>
                <li>Practice Tests</li>
                <li>Study Plans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-nunito font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Learn Content</li>
                <li>Analytics</li>
                <li>Progress Tracking</li>
                <li>Study Tips</li>
              </ul>
            </div>
            <div>
              <h4 className="font-nunito font-semibold mb-4">Organization</h4>
              <ul className="space-y-2 text-gray-300">
                <li>About Us</li>
                <li>Our Mission</li>
                <li>Donate</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EZ SAT. A nonprofit organization dedicated to free SAT preparation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
