import {
  users,
  userProgress,
  practiceQuestions,
  practiceSessions,
  userAnswers,
  studyPlans,
  type User,
  type UpsertUser,
  type UserProgress,
  type InsertUserProgress,
  type PracticeQuestion,
  type InsertPracticeQuestion,
  type PracticeSession,
  type InsertPracticeSession,
  type UserAnswer,
  type InsertUserAnswer,
  type StudyPlan,
  type InsertStudyPlan,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserRank(userId: string, subject: string, rank: string, progress: number): Promise<void>;
  
  // Practice questions operations
  getPracticeQuestions(subject: string, difficulty?: string, limit?: number): Promise<PracticeQuestion[]>;
  getRandomQuestions(subject: string, count: number, difficulty?: string): Promise<PracticeQuestion[]>;
  
  // Practice sessions operations
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  updatePracticeSession(sessionId: number, updates: Partial<PracticeSession>): Promise<PracticeSession>;
  getUserSessions(userId: string, limit?: number): Promise<PracticeSession[]>;
  
  // User answers operations
  createUserAnswer(answer: InsertUserAnswer): Promise<UserAnswer>;
  getUserAnswers(userId: string, sessionId?: number): Promise<UserAnswer[]>;
  
  // Study plans operations
  createStudyPlan(plan: InsertStudyPlan): Promise<StudyPlan>;
  getUserStudyPlans(userId: string): Promise<StudyPlan[]>;
  updateStudyPlan(planId: number, updates: Partial<StudyPlan>): Promise<StudyPlan>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [result] = await db
      .insert(userProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.subject],
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async updateUserRank(userId: string, subject: string, rank: string, progress: number): Promise<void> {
    await db
      .update(userProgress)
      .set({ rank, rankProgress: progress, updatedAt: new Date() })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.subject, subject)));
  }

  // Practice questions operations
  async getPracticeQuestions(subject: string, difficulty?: string, limit?: number): Promise<PracticeQuestion[]> {
    let query = db.select().from(practiceQuestions).where(eq(practiceQuestions.subject, subject));
    
    if (difficulty) {
      query = query.where(and(eq(practiceQuestions.subject, subject), eq(practiceQuestions.difficulty, difficulty)));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getRandomQuestions(subject: string, count: number, difficulty?: string): Promise<PracticeQuestion[]> {
    // This is a simplified random selection - in production you'd use proper SQL random functions
    const questions = await this.getPracticeQuestions(subject, difficulty);
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Practice sessions operations
  async createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession> {
    const [result] = await db.insert(practiceSessions).values(session).returning();
    return result;
  }

  async updatePracticeSession(sessionId: number, updates: Partial<PracticeSession>): Promise<PracticeSession> {
    const [result] = await db
      .update(practiceSessions)
      .set(updates)
      .where(eq(practiceSessions.id, sessionId))
      .returning();
    return result;
  }

  async getUserSessions(userId: string, limit?: number): Promise<PracticeSession[]> {
    let query = db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  // User answers operations
  async createUserAnswer(answer: InsertUserAnswer): Promise<UserAnswer> {
    const [result] = await db.insert(userAnswers).values(answer).returning();
    return result;
  }

  async getUserAnswers(userId: string, sessionId?: number): Promise<UserAnswer[]> {
    let query = db.select().from(userAnswers).where(eq(userAnswers.userId, userId));
    
    if (sessionId) {
      query = query.where(and(eq(userAnswers.userId, userId), eq(userAnswers.sessionId, sessionId)));
    }
    
    return await query.orderBy(desc(userAnswers.createdAt));
  }

  // Study plans operations
  async createStudyPlan(plan: InsertStudyPlan): Promise<StudyPlan> {
    const [result] = await db.insert(studyPlans).values(plan).returning();
    return result;
  }

  async getUserStudyPlans(userId: string): Promise<StudyPlan[]> {
    return await db
      .select()
      .from(studyPlans)
      .where(eq(studyPlans.userId, userId))
      .orderBy(desc(studyPlans.createdAt));
  }

  async updateStudyPlan(planId: number, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    const [result] = await db
      .update(studyPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studyPlans.id, planId))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
