# INCIT Backend

#### Description

INCIT Backend is a simple API designed to manage user interactions for the INCIT application. It supports operations such as user authentication, profile management, and statistics gathering.

Demo URL : https://incit-be-omega.vercel.app/

## Instalation

To set up the INCIT Backend locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Chandratand/incit-backend
   ```

2. **Navigate to the project directory:**

   ```bash
     cd incit-Backend
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

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. You can start by copying the provided `.env.example` file to a new file named `.env`, then filling in the necessary values.

- `DATABASE_URL`: The connection string for your database. This should include the username, password, hostname, port, and database name.
- `PORT`: The port number on which the server will run. Default is usually `3000` or `8080`.
- `JWT_SECRET`: The secret key used to sign and verify JSON Web Tokens. This should be a random and secure string.
- `JWT_EMAIL_SECRET`: The secret key used specifically for JSON Web Tokens used in email-related processes, such as email verification. This should also be a random and secure string.
- `GOOGLE_CLIENT_ID`: The client ID from your Google API credentials, used for Google OAuth.
- `GOOGLE_CLIENT_SECRET`: The client secret from your Google API credentials, used for Google OAuth.
- `FACEBOOK_APP_ID`: The application ID from your Facebook app, used for Facebook integration.
- `FACEBOOK_APP_SECRET`: The application secret from your Facebook app, used for Facebook integration.
- `FE_URL`: The base URL of your front end. This is used in various parts of the application to generate links back to the client.
- `GMAIL`: The Gmail address used for sending emails from the application.
- `SENDMAIL_PASSWORD`: The password for the email account from which the application sends emails.

### Note:

Ensure not to share your `.env` files or include them in your version-controlled source code as they can contain sensitive information. Instead, use the `.env.example` as a template which can be safely added to the repository.

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
