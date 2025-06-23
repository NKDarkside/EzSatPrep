import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPracticeSessionSchema, insertUserAnswerSchema, insertStudyPlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User progress routes
  app.get('/api/user/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Practice questions routes
  app.get('/api/practice/questions/:subject', async (req, res) => {
    try {
      const { subject } = req.params;
      const { difficulty, limit } = req.query;
      const questions = await storage.getPracticeQuestions(
        subject,
        difficulty as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(questions);
    } catch (error) {
      console.error("Error fetching practice questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.get('/api/practice/random/:subject/:count', async (req, res) => {
    try {
      const { subject, count } = req.params;
      const { difficulty } = req.query;
      const questions = await storage.getRandomQuestions(
        subject,
        parseInt(count),
        difficulty as string
      );
      res.json(questions);
    } catch (error) {
      console.error("Error fetching random questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Practice sessions routes
  app.post('/api/practice/session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertPracticeSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createPracticeSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating practice session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.put('/api/practice/session/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updatePracticeSession(parseInt(id), req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating practice session:", error);
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  app.get('/api/practice/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit } = req.query;
      const sessions = await storage.getUserSessions(
        userId,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching practice sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // User answers routes
  app.post('/api/practice/answer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const answerData = insertUserAnswerSchema.parse({ ...req.body, userId });
      const answer = await storage.createUserAnswer(answerData);
      
      // Update user progress after each answer
      await updateUserProgress(userId, req.body.questionId, answer.isCorrect);
      
      res.json(answer);
    } catch (error) {
      console.error("Error saving user answer:", error);
      res.status(500).json({ message: "Failed to save answer" });
    }
  });

  app.get('/api/user/answers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.query;
      const answers = await storage.getUserAnswers(
        userId,
        sessionId ? parseInt(sessionId as string) : undefined
      );
      res.json(answers);
    } catch (error) {
      console.error("Error fetching user answers:", error);
      res.status(500).json({ message: "Failed to fetch answers" });
    }
  });

  // Study plans routes
  app.post('/api/study-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const planData = insertStudyPlanSchema.parse({ ...req.body, userId });
      const plan = await storage.createStudyPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating study plan:", error);
      res.status(500).json({ message: "Failed to create study plan" });
    }
  });

  app.get('/api/study-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plans = await storage.getUserStudyPlans(userId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching study plans:", error);
      res.status(500).json({ message: "Failed to fetch study plans" });
    }
  });

  app.put('/api/study-plan/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.updateStudyPlan(parseInt(id), req.body);
      res.json(plan);
    } catch (error) {
      console.error("Error updating study plan:", error);
      res.status(500).json({ message: "Failed to update study plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to update user progress and rankings
async function updateUserProgress(userId: string, questionId: number, isCorrect: boolean) {
  try {
    // Get current progress
    const progress = await storage.getUserProgress(userId);
    
    // Initialize progress if not exists
    for (const subject of ['reading_writing', 'math']) {
      let userProg = progress.find(p => p.subject === subject);
      
      if (!userProg) {
        userProg = await storage.upsertUserProgress({
          userId,
          subject,
          rank: 'bronze',
          rankProgress: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          averageAccuracy: 0
        });
      }

      // Update statistics
      const newTotal = userProg.totalQuestions + 1;
      const newCorrect = userProg.correctAnswers + (isCorrect ? 1 : 0);
      const newAccuracy = (newCorrect / newTotal) * 100;

      // Calculate rank progression
      let newRank = userProg.rank;
      let newProgress = userProg.rankProgress;

      if (isCorrect) {
        newProgress += getRankProgressIncrement(userProg.rank);
        
        // Check for rank up
        if (newProgress >= 100) {
          const ranks = ['bronze', 'silver', 'gold', 'diamond', 'emerald'];
          const currentIndex = ranks.indexOf(userProg.rank);
          if (currentIndex < ranks.length - 1) {
            newRank = ranks[currentIndex + 1];
            newProgress = 0;
          } else {
            newProgress = 100; // Max rank reached
          }
        }
      }

      // Update progress
      await storage.upsertUserProgress({
        userId,
        subject,
        rank: newRank,
        rankProgress: newProgress,
        totalQuestions: newTotal,
        correctAnswers: newCorrect,
        averageAccuracy: newAccuracy
      });
    }
  } catch (error) {
    console.error("Error updating user progress:", error);
  }
}

function getRankProgressIncrement(rank: string): number {
  const increments = {
    bronze: 10,
    silver: 8,
    gold: 6,
    diamond: 4,
    emerald: 2
  };
  return increments[rank as keyof typeof increments] || 5;
}
