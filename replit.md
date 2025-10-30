# Celebrity Admin Panel

## Overview

This is a full-stack celebrity management admin panel built with React, Express, and MongoDB. The application provides a professional interface for managing celebrity profiles with comprehensive data including categories, social links, pricing, and availability. The system uses a modern tech stack with TypeScript, shadcn/ui components, and Drizzle ORM (configured for PostgreSQL but currently using MongoDB).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing

**UI Component System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens and CSS variables
- Design system inspired by Linear, Notion, and Stripe Dashboard patterns
- Inter font family for consistent typography across the application

**State Management & Data Fetching:**
- TanStack Query (React Query) for server state management with automatic caching
- React Hook Form with Zod validation for complex form handling
- Query client configured with infinite stale time and disabled refetching for optimal performance

**Layout Pattern:**
- Two-column admin layout with collapsible sidebar navigation
- Sidebar width: 16rem (expanded), 3rem (collapsed), 18rem (mobile)
- Responsive design with mobile-first breakpoint at 768px
- Fixed header with sidebar trigger and scrollable main content area

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe API development
- Custom middleware for request logging with execution time tracking
- JSON request body parsing with raw body preservation for webhook support

**Database Layer:**
- MongoDB with Mongoose ODM for document-based data storage
- Connection pooling with persistent connection management
- Configuration persistence via local JSON file (.mongodb-config.json)
- Drizzle ORM configured (for future PostgreSQL migration if needed)

**Data Models:**
- Celebrity schema with comprehensive fields: name, slug, category, profile image, bio, achievements, social links, video URL, gender, languages, event types, pricing, and availability
- Schema validation using Zod with shared types between client and server
- Mongoose models with strict schema enforcement and unique slug indexing

**API Structure:**
- RESTful endpoints organized by resource type
- Configuration endpoints for MongoDB connection management (/api/config/mongodb)
- CRUD operations for celebrity management (/api/celebrities)
- Comprehensive error handling with Zod validation error formatting
- Response logging for API requests with JSON payload truncation

**Development Features:**
- Vite middleware integration for SSR-capable development mode
- Runtime error overlay plugin for improved DX
- Cartographer and dev banner plugins for Replit environment
- Hot module replacement with server proxy support

### External Dependencies

**Database:**
- MongoDB as primary data store (connection via URI string)
- Neon Database serverless driver package included (for PostgreSQL support via Drizzle)
- PostgreSQL configuration ready via Drizzle Kit (migrations directory structure in place)

**Third-Party UI Libraries:**
- Radix UI component primitives (20+ components including dialogs, dropdowns, tooltips, forms)
- Embla Carousel for image/content carousels
- cmdk for command palette functionality
- Lucide React for icon system
- date-fns for date manipulation and formatting

**Form & Validation:**
- react-hook-form for performant form state management
- @hookform/resolvers for Zod schema integration
- Zod for runtime type validation and schema definition
- drizzle-zod for database schema to Zod schema conversion

**Session Management:**
- connect-pg-simple for PostgreSQL session store (prepared for future use)
- Session persistence ready via Express session middleware

**Build & Development Tools:**
- esbuild for server-side bundling in production
- tsx for TypeScript execution in development
- Replit-specific plugins for enhanced development experience
- PostCSS with Tailwind CSS and Autoprefixer

**Styling System:**
- Tailwind CSS v3 with custom configuration
- class-variance-authority for type-safe component variants
- clsx and tailwind-merge utilities for conditional class composition
- Custom color system using HSL with CSS variable architecture