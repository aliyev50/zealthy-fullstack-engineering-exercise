# Zealthy Onboarding Flow

A customizable user onboarding flow built with Next.js, TypeScript, and MongoDB.

## Features

- Three-step onboarding process
- Customizable form components for pages 2 and 3
- Admin interface to manage component placement
- Data table to view all user submissions
- Progress tracking and state persistence
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB running locally or a MongoDB Atlas connection string
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd zealthy-onboarding
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/zealthy
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes

- `/` - Main onboarding flow
- `/admin` - Admin interface for configuring component placement
- `/data` - Data table showing all user submissions

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin page
│   ├── data/              # Data table page
│   └── page.tsx           # Main onboarding page
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
├── models/               # MongoDB models
└── types/                # TypeScript type definitions
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- React Hooks
- Next.js App Router

## Development

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## License

ISC 