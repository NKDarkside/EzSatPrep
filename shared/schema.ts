import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress and rankings
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: varchar("subject").notNull(), // 'reading_writing' or 'math'
  rank: varchar("rank").notNull().default("bronze"), // bronze, silver, gold, diamond, emerald
  rankProgress: real("rank_progress").notNull().default(0), // 0-100 percentage to next rank
  totalQuestions: integer("total_questions").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  averageAccuracy: real("average_accuracy").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Practice questions
export const practiceQuestions = pgTable("practice_questions", {
  id: serial("id").primaryKey(),
  subject: varchar("subject").notNull(), // 'reading_writing' or 'math'
  topic: varchar("topic").notNull(),
  difficulty: varchar("difficulty").notNull(), // 'easy', 'medium', 'hard'
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of answer choices
  correctAnswer: varchar("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User practice sessions
export const practiceSessions = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionType: varchar("session_type").notNull(), // 'ranked', 'unranked', 'test'
  subject: varchar("subject").notNull(),
  questionsAnswered: integer("questions_answered").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  timeSpent: integer("time_spent").notNull().default(0), // in seconds
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User answers to track detailed performance
export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").notNull().references(() => practiceQuestions.id),
  sessionId: integer("session_id").references(() => practiceSessions.id),
  userAnswer: varchar("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent").notNull().default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Study plans
export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  targetScore: integer("target_score"),
  testDate: timestamp("test_date"),
  dailyGoal: integer("daily_goal").notNull().default(30), // minutes per day
  subjects: jsonb("subjects").notNull(), // array of subjects to focus on
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  sessions: many(practiceSessions),
  answers: many(userAnswers),
  studyPlans: many(studyPlans),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
}));

export const practiceSessionsRelations = relations(practiceSessions, ({ one, many }) => ({
  user: one(users, { fields: [practiceSessions.userId], references: [users.id] }),
  answers: many(userAnswers),
}));

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  user: one(users, { fields: [userAnswers.userId], references: [users.id] }),
  question: one(practiceQuestions, { fields: [userAnswers.questionId], references: [practiceQuestions.id] }),
  session: one(practiceSessions, { fields: [userAnswers.sessionId], references: [practiceSessions.id] }),
}));

export const studyPlansRelations = relations(studyPlans, ({ one }) => ({
  user: one(users, { fields: [studyPlans.userId], references: [users.id] }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;
export type PracticeQuestion = typeof practiceQuestions.$inferSelect;
export type InsertPracticeQuestion = typeof practiceQuestions.$inferInsert;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertPracticeSession = typeof practiceSessions.$inferInsert;
export type UserAnswer = typeof userAnswers.$inferSelect;
export type InsertUserAnswer = typeof userAnswers.$inferInsert;
export type StudyPlan = typeof studyPlans.$inferSelect;
export type InsertStudyPlan = typeof studyPlans.$inferInsert;

// Schemas
export const insertPracticeQuestionSchema = createInsertSchema(practiceQuestions);
export const insertPracticeSessionSchema = createInsertSchema(practiceSessions);
export const insertUserAnswerSchema = createInsertSchema(userAnswers);
export const insertStudyPlanSchema = createInsertSchema(studyPlans).omit({ id: true, createdAt: true, updatedAt: true });
