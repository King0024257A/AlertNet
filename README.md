# AlertNet: AI-Powered Micro-Disaster Reporting

[![Powered by Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange)](https://firebase.google.com/)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)](https://tailwindcss.com/)
[![AI by Genkit](https://img.shields.io/badge/AI%20by-Genkit-blueviolet)](https://firebase.google.com/docs/genkit)

**AlertNet** is a modern, real-time micro-disaster reporting and verification platform. It empowers users to report local incidents, which are then intelligently verified, detailed, and categorized by a powerful AI system. Administrators can manage these alerts, view analytics, and send global notifications to all users.

## Key Features

- **🤖 AI-Powered Alert Verification:** Users simply upload an image and provide a location. The AI analyzes the image, determines if it's a real disaster, and automatically generates a title, detailed description, and severity level.
- **🌐 Real-time Dashboard:** A central dashboard displays all verified alerts, providing a live feed of incidents for all users.
- **📊 Advanced Analytics:** An interactive analytics page visualizes alert data, showing distributions by severity and trends over time with modern charts.
- **👑 Admin Controls:** Users with an 'admin' role have access to a special dashboard to manage and delete any alert.
- **📧 Global Email Notifications:** Admins can trigger a global notification, which uses AI to generate and simulate sending a summary email with the latest analytics to all registered users.
- **👤 User Roles & Authentication:** A complete, mock authentication system with separate roles for standard users and administrators.
- **📞 Emergency Contacts:** A quick-access page listing important national emergency contact numbers for India, with the ability for users to add their own custom contacts.
- **🎨 Modern UI/UX:** Built with **shadcn/ui** and **Tailwind CSS** for a clean, responsive, and aesthetically pleasing user experience, including a collapsible sidebar and dark mode support.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API
- **Mock Data Storage:** Browser `localStorage` and `sessionStorage` are used to simulate a persistent, multi-user database experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or another package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

To run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## How to Use

The application includes a mock user database. You can log in with the following credentials:

-   **Standard User:**
    -   **Email:** `demo@gmail.com`
    -   **Password:** `demo@0123`

-   **Admin User:**
    -   **Email:** `admin@gmail.com`
    -   **Password:** `admin@0426`

### Main Pages

-   **/dashboard**: View all verified disaster alerts.
-   **/create-alert**: Report a new incident by providing a location and uploading a photo.
-   **/analytics**: See interactive charts analyzing alert data.
-   **/emergency-contacts**: View national emergency numbers and add your own.
-   **/profile**: Update your user information.
-   **/admin**: (Admin-only) Manage all alerts and send global notifications.

## Project Structure

The project follows a standard Next.js App Router structure:

```
src
├── ai                  # Genkit AI flows
│   ├── flows
│   └── genkit.ts
├── app                 # Next.js App Router pages
│   ├── (app)           # Authenticated routes
│   └── (auth)          # Login/Register routes
├── components          # Reusable React components
│   ├── auth
│   ├── ui              # shadcn/ui components
│   └── *.tsx
├── contexts            # React Context for global state (Auth, Alerts)
├── hooks               # Custom React hooks
├── lib                 # Utility functions and static data
└── types               # TypeScript type definitions
```
