import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Practice from "@/pages/Practice";
import Trainer from "@/pages/Trainer";
import StudyPlan from "@/pages/StudyPlan";
import PracticeTest from "@/pages/PracticeTest";
import Analytics from "@/pages/Analytics";
import Learn from "@/pages/Learn";
import Donate from "@/pages/Donate";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/practice" component={Practice} />
          <Route path="/trainer" component={Trainer} />
          <Route path="/study-plan" component={StudyPlan} />
          <Route path="/practice-test" component={PracticeTest} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/learn" component={Learn} />
          <Route path="/donate" component={Donate} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
