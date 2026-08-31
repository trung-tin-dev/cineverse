# Sprint 6 — Authentication & Session Management

## Overview

Sprint 6 focused on implementing the authentication foundation for CineVerse. The system now supports credential-based authentication, Google OAuth authentication, email verification, password recovery, session management, and authentication-related database integration using Better Auth, Prisma, and PostgreSQL.

The authentication implementation follows the project's feature-based frontend structure and separates authentication concerns from presentation components.

## Completed

### 1. User Registration

The registration flow has been implemented with:

* User registration using name, email, and password
* Client-side validation using Zod
* Form state management using React Hook Form
* Server-side authentication through Better Auth
* Email verification using OTP
* Verification email delivery through Resend
* Session creation after successful registration and verification
* Error handling for failed registration requests

### 2. User Login

The login flow has been implemented with:

* Email and password authentication
* Client-side validation using Zod
* Form state management using React Hook Form
* Better Auth integration
* Session creation after successful authentication
* Redirect to the profile page after successful login
* Password visibility toggle
* Loading states during authentication
* Server error handling
* Remember Me option

### 3. Google OAuth

Google authentication has been implemented using Better Auth OAuth integration.

The system supports:

* Login using a Google account
* Google OAuth callback handling
* Session creation after successful Google authentication
* Redirect after successful OAuth authentication
* Account linking between credential-based and Google authentication

When a user already has an account created with email and password and later signs in with Google using the same verified email address, both authentication methods can be associated with the same user account.

The `Account` table may therefore contain multiple authentication provider records while referencing the same `userId`.

### 4. Email Verification

Email verification has been implemented using Better Auth Email OTP.

The system supports:

* Sending a verification OTP after registration
* Six-digit OTP verification
* OTP expiration
* Resending verification codes
* Email delivery through Resend
* Automatic sign-in after successful verification

### 5. Forgot Password

A password recovery flow has been implemented using Email OTP.

The flow consists of:

1. User enters their email address
2. System sends a password-reset OTP
3. User enters the six-digit OTP
4. User enters a new password
5. Password is updated after successful OTP verification
6. User is redirected to the login page

The implementation also includes:

* OTP expiration
* OTP resend cooldown
* OTP input validation
* Paste support for six-digit OTP codes
* Password confirmation
* Password visibility toggles
* Error handling
* Loading states

### 6. Password Reset

Password reset functionality has been successfully integrated with Better Auth.

Users can reset their password after successfully validating the password-reset OTP.

The new password is then available for subsequent credential-based login.

### 7. Session Management

Session management has been implemented and tested successfully.

The system can:

* Create a session after successful authentication
* Retrieve the authenticated user's session
* Access the authenticated user's ID, name, and email
* Maintain authentication state across requests
* Remove the session after sign out
* Return `null` when requesting a session after sign out
* Support sessions for both credential and Google authentication

### 8. Authentication Database

Better Auth has been integrated with Prisma and PostgreSQL.

The authentication database currently contains the required Better Auth models:

* User
* Session
* Account
* Verification

The `Account` model supports multiple authentication providers for the same user.

For example, a user may have:

```text
User
 └── userId: abc123

Account
 ├── credential account → userId: abc123
 └── Google account    → userId: abc123
```

This allows different authentication methods to belong to the same CineVerse user account.

### 9. Authentication Frontend Structure

The authentication frontend follows a feature-based architecture.

```text
src/
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       └── forgot-password/
│           └── page.tsx
│
├── features/
│   └── auth/
│       ├── components/
│       │   ├── auth-form-wrapper.tsx
│       │   ├── login-form.tsx
│       │   ├── register-form.tsx
│       │   └── forgot-password-form.tsx
│       │
│       └── schemas/
│           └── auth-schema.ts
│
└── lib/
    └── auth-client.ts
```

The route pages remain lightweight while authentication UI and form logic are contained within the Auth feature.

### 10. Authentication UI

A reusable `AuthFormWrapper` component has been introduced for authentication pages.

The authentication interface provides:

* Responsive authentication layout
* Shared authentication page structure
* Cinema-themed visual section
* Login, registration, and password recovery forms
* Responsive behaviour for smaller screens
* Loading states
* Error messages
* Password visibility controls
* OTP input interface

## Authentication Scenarios Tested

The following authentication scenarios have been tested:

* Email/password registration
* Email verification
* Email/password login
* Sign out
* Session retrieval
* Google login
* Google OAuth callback
* Credential account followed by Google login using the same verified email
* Multiple authentication providers associated with the same `userId`
* Google account followed by password recovery
* OTP password reset
* Password reset followed by credential login
* Invalid credentials
* Invalid or expired OTP
* OTP resend
* Authentication error handling

## Account Linking Behaviour

CineVerse allows authentication methods to be associated with the same user account when the identity can be safely matched.

For example:

```text
Email/Password
      │
      ▼
    User A
      ▲
      │
    Google
```

The database can therefore contain multiple records in the `Account` table while maintaining the same `userId`.

This prevents the creation of unnecessary duplicate user accounts when a verified email address is used with different authentication methods.

## Deferred to Subsequent Sprints

The following features are intentionally deferred to subsequent authentication, authorization, and security work:

* Role-Based Access Control (RBAC)
* Protected routes
* Role-based route authorization
* Authentication middleware
* Rate limiting
* Centralized application error codes
* Advanced error handling and error mapping
* Additional security hardening
* Advanced authentication monitoring
* Security logging and auditing

These features are excluded from the current Sprint 6 scope and will be addressed in subsequent sprints.

## Sprint 6 Status

### Completed

* [x] User registration
* [x] Email/password login
* [x] Sign out
* [x] Session creation
* [x] Session retrieval
* [x] Session deletion
* [x] Remember Me option
* [x] Email verification
* [x] OTP verification
* [x] OTP resend
* [x] Forgot password
* [x] Password reset
* [x] Google OAuth
* [x] Account linking
* [x] PostgreSQL authentication tables
* [x] Prisma integration
* [x] Better Auth integration
* [x] Resend email integration
* [x] Zod validation
* [x] React Hook Form
* [x] Feature-based authentication structure
* [x] Shared authentication form wrapper
* [x] Responsive authentication UI
* [x] Authentication scenario testing

### Deferred

* [x] RBAC
* [x] Protected routes
* [x] Role-based authorization
* [ ] Authentication middleware
* [ ] Rate limiting
* [ ] Centralized error codes
* [ ] Advanced error handling
* [ ] Security hardening
* [ ] Authentication monitoring
* [ ] Security logging and auditing

## Sprint Outcome

Sprint 6 successfully established the authentication foundation of CineVerse. Users can register, verify their email address, log in using credentials or Google, recover and reset their passwords, maintain authenticated sessions, and associate multiple authentication providers with the same user account.

The authentication foundation is now ready for the subsequent authorization and security work, including RBAC, protected routes, middleware, and rate limiting.
