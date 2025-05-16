# Lead Management System

A simple role-based web application for submitting and managing sales leads.

## Features

### For Agents:
- Login with agent credentials
- Submit new sales leads with full customer information
- Form validation for required fields and data formats

### For Admins:
- Login with admin credentials
- View all submitted leads in a dashboard
- Filter leads by status, date, and location
- Export leads as CSV

## Tech Stack

- Next.js 15.3
- React 19
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Run the development server:
   ```
npm run dev
   ```
   or
   ```
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Authentication

For demo purposes, the application uses hardcoded credentials:

- **Agent Login**: 
  - Username: agent
  - Password: agent

- **Admin Login**:
  - Username: admin
  - Password: admin

### Lead Submission (Agent)

1. Login with agent credentials
2. Fill in the lead submission form with customer details
3. Required fields are marked with *
4. Submit the form

### Lead Management (Admin)

1. Login with admin credentials
2. View all leads in the dashboard
3. Use filters to search for specific leads:
   - By status (New, In Review, Approved, Rejected)
   - By date range
   - By location (city or state)
4. Export filtered leads as CSV using the "Export CSV" button

## Project Structure

```
lead/
├── app/                    # Next.js app directory
│   ├── admin/              # Admin pages
│   │   └── dashboard/      # Admin dashboard page
│   ├── agent/              # Agent pages
│   │   └── submit-lead/    # Lead submission page
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Landing/login page
├── components/             # Reusable components
│   ├── auth/               # Authentication components
│   │   └── LoginForm.tsx   # Login form component
│   └── layout/             # Layout components
│       └── Navbar.tsx      # Navigation component
├── public/                 # Static assets
├── .next/                  # Next.js build output
├── node_modules/           # Dependencies
├── package.json            # Project configuration
└── README.md               # Project documentation
```

## Future Enhancements

- Integration with a backend API
- Database storage for leads
- User management system
- Password recovery
- Lead status management
- Mobile app support
