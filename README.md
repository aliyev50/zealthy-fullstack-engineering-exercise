# Zealthy - An admin App Onboarding System

An admin and user management application built with Next.js, TypeScript, and MongoDB, featuring a customizable onboarding flow.

## Features

- Multi-step onboarding process
- User dashboard with profile management
- Admin interface to manage component placement and user data
- Light/dark theme support
- Data visualization and user progress tracking
- Responsive design with mobile support
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB running locally or a MongoDB Atlas connection string
- npm, yarn, or pnpm package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-app-onboarding
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```
MONGODB_URI=mongodb://localhost:27017/zealthy
# Add other required environment variables
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Routes

- `/` - Main onboarding flow entry point
- `/onboarding` - User onboarding process
- `/user-dashboard` - User profile and settings dashboard
- `/admin` - Admin interface for configuring component placement
- `/dashboard` - Admin dashboard for monitoring user progress
- `/data` - Data table showing all user submissions

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── admin/              # Admin configuration page
│   ├── dashboard/          # Admin dashboard
│   ├── data/               # Data table page
│   ├── onboarding/         # User onboarding flows
│   ├── user-dashboard/     # User profile and settings
│   ├── globals.css         # Global styles
│   └── page.tsx            # Main landing page
├── components/             # Reusable components
│   ├── DashboardPanel.tsx  # Dashboard components
│   ├── DynamicForm.tsx     # Dynamic form builder
│   ├── OnboardingForm.tsx  # Onboarding forms
│   ├── OnboardingSteps.tsx # Step navigation
│   ├── SettingsPanel.tsx   # User settings
│   ├── UserProfilePanel.tsx # User profile
│   └── UserSidebar.tsx     # User dashboard sidebar
├── context/                # React context providers
│   └── ThemeContext.tsx    # Theme (light/dark) context
├── lib/                    # Utility functions and configurations
│   └── mongodb.ts          # MongoDB connection
└── types/                  # TypeScript type definitions
```

## Technologies Used

- Next.js 13
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- React Hooks
- Context API for state management
- Next.js App Router

## Development

To start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

To build for production:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server:
```bash
npm start
# or
yarn start
# or
pnpm start
```

## Deployment

This application is configured for easy deployment on Vercel.

## License

ISC 