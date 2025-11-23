# J.S. Car Service - Website

This is a single-page, mobile-responsive website for J.S. Car Service, an auto repair and modification garage. The project is built with Next.js, TypeScript, and Tailwind CSS, and it uses Firebase Firestore for the booking and reviews system.

## Features

- **Modern & Responsive Design**: Industrial vibe with a dark theme and orange accents, optimized for all screen sizes.
- **Sticky Header**: Easy navigation and quick contact options always visible.
- **Services Showcase**: A clear display of all services offered.
- **Interactive Booking Form**: A form that allows users to book appointments directly on the site, with data saved to Firestore.
- **Work Gallery & Reviews**: A visual gallery of work and a dynamic customer review carousel powered by Firestore.
- **Contact & Location**: Includes contact details and an embedded Google Map.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Clone the repository

First, clone the repository to your local machine using Git:

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Next, install all the required npm packages. In the project's root directory, run:

```bash
npm install
```

### 3. Set up Firebase

The project is configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`. For the application to run correctly, you will need to have a Firebase project with Firestore enabled. The existing configuration points to a project, but you may want to replace it with your own for development.

### 4. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server:

```bash
npm run dev
```

This command will start the application in development mode with Turbopack on port 9002.

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can now start editing the application. The page will auto-update as you make changes.

## Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the linter to check for code quality issues.
