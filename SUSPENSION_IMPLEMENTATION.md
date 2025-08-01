# User Suspension System Implementation

## Overview

This implementation adds functionality to restrict suspended users while allowing them to still log in. When an admin suspends a user, the user can authenticate but cannot perform any other operations within the system.

## Key Features

1. **Login Preserved**: Suspended users can still log in and receive their authentication token
2. **Action Blocking**: All protected routes except login are blocked for suspended users
3. **Clear Feedback**: Suspended users receive clear error messages with suspension details
4. **Admin Control**: Admins retain full functionality even if suspended

## Files Modified

### 1. New Middleware Created

- **`middleware/checkSuspension.js`**: New middleware that checks if a user is suspended or banned and blocks access with appropriate error messages

### 2. Admin Controller Updated

- **`controllers/adminController.js`**:
  - Modified `suspendUser` function to NOT set `isVerified` to false
  - Suspension now only sets `suspendedAt` and `suspensionReason` fields
  - Users remain verified and can log in

### 3. User Controller Updated

- **`controllers/userController.js`**:
  - Added suspension status to login responses (`isSuspended`, `suspendedAt`, `suspensionReason`)
  - Updated both `loginUser` and `login` functions
  - Added suspension status to `getProfile` function

### 4. Authentication Middleware Updated

- **`middleware/auth.js`**: Ensured user object includes all fields including suspension data

### 5. All Route Files Updated

Routes now include `checkSuspension` middleware after authentication but before authorization:

- **`routes/userRoutes.js`**: Profile, social media, analytics routes
- **`routes/campaignRoutes.js`**: All campaign operations
- **`routes/messageRoutes.js`**: Messaging functionality
- **`routes/contentRoutes.js`**: Content submission and review
- **`routes/notificationRoutes.js`**: Notification management
- **`routes/postRoutes.js`**: Social post operations
- **`routes/invitationRoutes.js`**: Campaign invitations
- **`routes/creatorRoutes.js`**: Creator discovery
- **`routes/youtubeRoutes.js`**: YouTube integration
- **`routes/analyticsRoutes.js`**: Analytics data

### 6. Routes NOT Protected (Still Accessible)

- **Authentication routes**: Register, login, email verification
- **Admin routes**: Use different middleware (`isAdmin`) - admins can work even if suspended
- **Public routes**: Password reset, user search (public endpoints)

## How It Works

### 1. Suspension Process

```javascript
// Admin suspends user
user.suspendedAt = new Date();
user.suspensionReason = reason;
// isVerified remains true - user can still log in
```

### 2. Login Flow

```javascript
// User can log in normally
// Response includes suspension status
{
  "_id": "...",
  "name": "User Name",
  "email": "user@example.com",
  "role": "influencer",
  "isVerified": true,
  "isSuspended": true,
  "suspendedAt": "2025-01-15T10:30:00.000Z",
  "suspensionReason": "Violation of terms",
  "token": "jwt_token_here"
}
```

### 3. Protected Route Access

```javascript
// Any protected route with checkSuspension middleware
// Returns 403 if user is suspended
{
  "message": "Your account has been suspended",
  "suspendedAt": "2025-01-15T10:30:00.000Z",
  "suspensionReason": "Violation of terms",
  "isAccessRestricted": true
}
```

### 4. Reactivation Process

```javascript
// Admin reactivates user
user.suspendedAt = undefined;
user.suspensionReason = undefined;
// User can now access all features
```

## Middleware Chain Example

```
Request → Auth Middleware → Check Suspension → Role Check → Route Handler
         (verify token)   (block if suspended)  (brand/influencer)
```

## Error Responses

### Suspension Error (403)

```json
{
  "message": "Your account has been suspended",
  "suspendedAt": "2025-01-15T10:30:00.000Z",
  "suspensionReason": "Violation of community guidelines",
  "isAccessRestricted": true
}
```

### Ban Error (403)

```json
{
  "message": "Your account has been permanently banned",
  "bannedAt": "2025-01-15T10:30:00.000Z",
  "banReason": "Severe violation of terms",
  "isAccessRestricted": true
}
```

## Testing

A test script `testSuspension.js` is provided to verify the functionality:

```bash
cd backend
node testSuspension.js
```

## Frontend Integration

The frontend should:

1. **Check login response** for `isSuspended` status
2. **Display suspension message** if user is suspended
3. **Handle 403 errors** with `isAccessRestricted: true`
4. **Show appropriate UI** for suspended users (read-only mode)
5. **Allow logout** and basic account access

## Database Schema

The User model already includes these fields:

- `suspendedAt`: Date (when user was suspended)
- `suspensionReason`: String (reason for suspension)
- `bannedAt`: Date (when user was banned)
- `banReason`: String (reason for ban)

## Security Considerations

1. **Login tokens remain valid** - suspension is checked on each request
2. **Admin accounts protected** - different middleware prevents admin lockout
3. **Clear audit trail** - suspension timestamps and reasons are logged
4. **Graceful degradation** - errors are handled properly in middleware

This implementation ensures suspended users understand their status while preventing them from taking any actions that could affect the platform or other users.
