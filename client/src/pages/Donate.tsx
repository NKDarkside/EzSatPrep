import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Target, 
  CheckCircle,
  DollarSign,
  Award,
  Globe,
  BookOpen,
  Zap
} from "lucide-react";

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    message: ""
  });

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const impactStats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Students Reached",
      description: "Students who have used our free SAT prep tools"
    },
    {
      icon: GraduationCap,
      value: "180+",
      label: "Average Score Increase",
      description: "Points improved by students using our platform"
    },
    {
      icon: Globe,
      value: "150+",
      label: "Countries Served",
      description: "Students from around the world access our resources"
    },
    {
      icon: BookOpen,
      value: "2M+",
      label: "Questions Practiced",
      description: "Practice questions completed by our users"
    }
  ];

  const donationImpact = [
    {
      amount: 25,
      impact: "Provides SAT prep access to 5 students for one month",
      features: ["Basic practice questions", "Progress tracking", "Study guides"]
    },
    {
      amount: 50,
      impact: "Covers server costs for 100 students for one month",
      features: ["All practice features", "Analytics dashboard", "Study plans"]
    },
    {
      amount: 100,
      impact: "Funds development of new practice questions and features",
      features: ["New question development", "Feature improvements", "Platform maintenance"]
    },
    {
      amount: 250,
      impact: "Supports our content team for one week",
      features: ["Expert content creation", "Question review", "Study material updates"]
    },
    {
      amount: 500,
      impact: "Maintains our platform for 1,000 students for one month",
      features: ["Full platform access", "Analytics & insights", "Priority support"]
    },
    {
      amount: 1000,
      impact: "Funds major platform improvements and new features",
      features: ["Major feature development", "Platform scaling", "Advanced analytics"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "California",
      quote: "Thanks to EZ SAT's free resources, I improved my score by 200 points. This nonprofit truly levels the playing field.",
      score: "+200 points"
    },
    {
      name: "Marcus T.",
      location: "Texas", 
      quote: "I couldn't afford expensive prep courses, but EZ SAT gave me everything I needed to succeed. Now I'm headed to my dream college!",
      score: "+150 points"
    },
    {
      name: "Elena R.",
      location: "New York",
      quote: "The ranked practice system motivated me to keep improving. I went from Bronze to Diamond in just 3 months!",
      score: "+180 points"
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const getSelectedImpact = () => {
    const amount = getFinalAmount();
    return donationImpact.find(impact => impact.amount === amount) || 
           donationImpact[donationImpact.length - 1];
  };

  return (
    <div className="min-h-screen bg-light-beige">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-nunito font-bold text-warm-gray mb-4">
            Support Free SAT Prep
            <span className="text-forest-green block">For Everyone</span>
          </h1>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Your donation helps us provide world-class SAT preparation to students regardless of their economic background. 
            Together, we can make quality education accessible to all.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-10 w-10 mx-auto text-forest-green mb-3" />
                <div className="text-3xl font-nunito font-bold text-forest-green mb-2">{stat.value}</div>
                <h3 className="font-semibold text-warm-gray mb-2">{stat.label}</h3>
                <p className="text-sm text-warm-gray">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-forest-green" />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold text-warm-gray mb-3 block">
                    Choose Donation Amount
                  </Label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={`h-12 ${selectedAmount === amount ? 'bg-forest-green text-white' : 'border-forest-green text-forest-green hover:bg-forest-green hover:text-white'}`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-warm-gray" />
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Impact Preview */}
                {getFinalAmount() > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Your Impact</h4>
                    <p className="text-green-700 text-sm mb-3">{getSelectedImpact()?.impact}</p>
                    <div className="space-y-1">
                      {getSelectedImpact()?.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Donor Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-warm-gray">
                    Donor Information (Optional)
                  </Label>
                  
                  <div>
                    <Label htmlFor="name" className="text-sm">Full Name</Label>
                    <Input
                      id="name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={donorInfo.message}
                      onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                      placeholder="Share why you're supporting EZ SAT..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-forest-green text-white hover:bg-green-600 h-12 text-lg"
                  disabled={getFinalAmount() === 0}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate ${getFinalAmount() || 0}
                </Button>

                <p className="text-xs text-warm-gray text-center">
                  EZ SAT is a 501(c)(3) nonprofit organization. Your donation is tax-deductible.
                </p>
              </CardContent>
            </Card>

            {/* Other Ways to Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-gold" />
                  Other Ways to Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-light-beige rounded-lg">
                    <Users className="h-5 w-5 text-forest-green" />
                    <div>
                      <h4 className="font-semibold text-warm-gray">Spread the Word</h4>
                      <p className="text-sm text-warm-gray">Share EZ SAT with students who need free prep resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-light-beige rounded-lg">
                    <BookOpen className="h-5 w-5 text-forest-green" />
                    <div>
                      <h4 className="font-semibold text-warm-gray">Volunteer</h4>
                      <p className="text-sm text-warm-gray">Help create content or provide feedback on our platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-light-beige rounded-lg">
                    <Award className="h-5 w-5 text-forest-green" />
                    <div>
                      <h4 className="font-semibold text-warm-gray">Corporate Partnership</h4>
                      <p className="text-sm text-warm-gray">Partner with us to sponsor student access or features</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Stories & Information */}
          <div className="space-y-6">
            {/* Mission Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-forest-green" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray mb-4">
                  EZ SAT was founded on the belief that every student deserves access to high-quality SAT preparation, 
                  regardless of their family's financial situation. We've seen firsthand how expensive test prep creates 
                  an unfair advantage for wealthy students.
                </p>
                <p className="text-warm-gray mb-4">
                  That's why we've made everything completely free - no premium tiers, no hidden fees, no paywalls. 
                  Your donation helps us maintain this commitment while continuously improving our platform.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-green">100%</div>
                    <div className="text-sm text-warm-gray">Free Forever</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-green">0</div>
                    <div className="text-sm text-warm-gray">Hidden Fees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-green">∞</div>
                    <div className="text-sm text-warm-gray">Access</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>Student Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-light-beige rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-warm-gray">{testimonial.name}</h4>
                          <p className="text-sm text-warm-gray">{testimonial.location}</p>
                        </div>
                        <Badge className="bg-forest-green text-white">{testimonial.score}</Badge>
                      </div>
                      <p className="text-sm text-warm-gray italic">"{testimonial.quote}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transparency */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-warm-gray mb-2">How We Use Donations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warm-gray">Platform Development & Maintenance</span>
                        <span className="font-semibold">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warm-gray">Content Creation & Review</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warm-gray">Operations & Support</span>
                        <span className="font-semibold">10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-warm-gray">
                      We publish annual financial reports and are committed to using every dollar 
                      efficiently to maximize student impact.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
