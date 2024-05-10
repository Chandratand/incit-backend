# INCIT Backend

#### Description

INCIT Backend is a simple API designed to manage user interactions for the INCIT application. It supports operations such as user authentication, profile management, and statistics gathering.

Demo URL : https://incit-be-omega.vercel.app/

## Instalation

To set up the INCIT Backend locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone [your-repo-url]
   ```

2. **Navigate to the project directory:**

   ```bash
     cd INCIT-Backend
   ```

3. **Navigate to the project directory:**

   ```bash
     npm install
   ```

4. **Set up the environment variables::**

   - Duplicate the .env.example file and rename it to .env.
   - Fill in the DATABASE_URL with your database credentials.

5. **Run the Prisma migrations (ensure your database URL is correctly set in .env)::**
   ```bash
     npx prisma migrate dev
   ```

## Usage

To start the server, use one of the following commands:

- For development:

  ```bash
   npm run dev
  ```

- For production:
  ```bash
  npm start
  ```

## Features

- Authentication: Sign in and sign up functionality with email, google and facebook.
- Email Verification: Verify email addresses and resend verification emails.
- User Management: Fetch user details and statistics.
- Profile Management: Update user profiles.
- Password Management: Reset passwords.

## API Endpoint

### User Management

- GET /users: Retrieve all users.
- GET /users/stats: Get statistical data of users.
- POST /users/verify-email: Verify user's email

### Authentication and User Profile

- POST /auth/sign-in: Log in a user.
- POST /auth/sign-up: Register a new user.
- GET /auth/verification-status: Check user's email verification.
- POST /auth/resend-email: Resend verification email.
- PUT /auth/profile: Update user profile.
- POST /auth/reset-password: Reset user password.
- POST /auth/google/verify: Verify Google Authentication.
- POST /auth/facebook/verify: Verify facebook Authentication.
