# EZ SAT Prep Platform

## Overview

This is a comprehensive SAT preparation platform built with React (TypeScript) frontend and Express.js backend. The application provides practice questions, adaptive training, study plans, timed practice tests, detailed analytics, and learning resources to help students prepare for the SAT exam.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Pattern**: RESTful API with JSON responses

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication data
- `user_progress` - Progress tracking and ranking system
- `practice_questions` - Question bank with subjects and difficulties
- `practice_sessions` - Individual practice session records
- `user_answers` - User responses and performance data
- `study_plans` - Personalized study schedules
- `sessions` - Session storage for authentication

## Key Components

### Authentication System
- Integrated with Replit Auth using OpenID Connect
- Session-based authentication with PostgreSQL session store
- Automatic user provisioning and profile management
- Protected routes requiring authentication

### Practice System
- **Ranked Practice**: Competitive practice with ranking progression (Bronze → Silver → Gold → Diamond → Emerald)
- **Unranked Practice**: Casual practice without ranking impact
- **Subjects**: Reading & Writing, Math
- **Difficulty Levels**: Adaptive difficulty based on performance

### Adaptive Trainer
- AI-powered difficulty adjustment based on user performance
- Real-time adaptation to user strengths and weaknesses
- Personalized question selection algorithms

### Study Planning
- Custom study plans with target scores and test dates
- Daily goal tracking and progress monitoring
- Subject-specific planning and scheduling

### Practice Tests
- Full-length timed practice tests
- Section-based testing (Reading & Writing: 64 min, Math: 70 min)
- Question flagging and review functionality
- Comprehensive scoring and performance analysis

### Analytics Dashboard
- Performance tracking across subjects and time periods
- Ranking progression visualization
- Accuracy and improvement metrics
- Session history and detailed breakdowns

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating user profiles
2. **Practice Sessions**: Users start practice sessions, which track questions, answers, and performance
3. **Progress Updates**: Completed sessions update user progress and potentially adjust rankings
4. **Adaptive Learning**: System analyzes performance patterns to recommend appropriate difficulty levels
5. **Analytics Generation**: User data is aggregated for performance insights and progress tracking

## External Dependencies

### Core Dependencies
- `@neondatabase/serverless` - Neon PostgreSQL database connection
- `drizzle-orm` - Type-safe database ORM
- `@tanstack/react-query` - Server state management
- `@radix-ui/*` - Accessible UI component primitives
- `tailwindcss` - Utility-first CSS framework

### Authentication
- `openid-client` - OpenID Connect client for Replit Auth
- `passport` - Authentication middleware
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store

### Development Tools
- `tsx` - TypeScript execution for development
- `esbuild` - Fast JavaScript bundler for production
- `vite` - Frontend build tool and dev server

## Deployment Strategy

### Development Environment
- Uses Vite dev server with HMR for frontend development
- TSX for running TypeScript backend in development
- PostgreSQL database provisioned via Replit

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single Node.js process serves both API and static assets

### Hosting
- Deployed on Replit with autoscale deployment target
- Uses Replit's PostgreSQL module for database
- Environment variables for database connection and session secrets

## Changelog

- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.