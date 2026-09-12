# Life RPG - Backend API Documentation

This document describes the RESTful API endpoints provided by the Life RPG backend.

---

## Standard Response & Error Format

All API endpoints return JSON responses formatted using standard helpers from `src/lib/api.ts`.

### Success Response Format
```json
{
  "message": "Optional descriptive success message",
  "...": "Endpoint specific fields (e.g., user, quests, stats)"
}
```

### Error Response Format
```json
{
  "error": "Error description message",
  "details": {} // Optional validation or error details (e.g. Zod flatten object)
}
```

### Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or bad parameter input.
- `401 Unauthorized`: Unauthenticated request (missing or invalid session cookie / Bearer token).
- `403 Forbidden`: Authenticated user attempting to access or modify a resource owned by another user.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Resource unique constraint violation (e.g., duplicate email or attribute name).
- `500 Internal Server Error`: Server exception.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "username": "HeroName",
    "email": "hero@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (`201 Created`)**:
  Sets `life_rpg_session` HTTP-Only cookie.
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "cuid...",
      "username": "HeroName",
      "email": "hero@example.com",
      "level": 1,
      "xp": 0,
      "xpToNextLevel": 1000,
      "gold": 100,
      "streakDays": 0,
      "createdAt": "2026-09-12T...",
      "attributes": [...]
    },
    "token": "jwt-token-string"
  }
  ```
- **Common Errors**: `400 Bad Request` (Zod validation failure), `409 Conflict` (Email or username taken).

---

### `POST /api/auth/login`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "hero@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  Sets `life_rpg_session` HTTP-Only cookie.
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "cuid...",
      "username": "HeroName",
      "email": "hero@example.com",
      "level": 1,
      "xp": 0,
      "xpToNextLevel": 1000,
      "gold": 100,
      "attributes": [...]
    },
    "token": "jwt-token-string"
  }
  ```
- **Common Errors**: `400 Bad Request`, `401 Unauthorized` (Invalid credentials).

---

### `GET /api/auth/me`
- **Authentication**: Required (`life_rpg_session` cookie or `Authorization: Bearer <token>`)
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "cuid...",
      "username": "HeroName",
      "email": "hero@example.com",
      "level": 1,
      "xp": 0,
      "xpToNextLevel": 1000,
      "gold": 100,
      "attributes": [...]
    }
  }
  ```
- **Common Errors**: `401 Unauthorized`, `404 Not Found`.

---

### `DELETE /api/auth/me`
- **Authentication**: Required
- **Purpose**: Logout user by clearing session cookie.
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

### `POST /api/auth/change-password`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Password updated successfully"
  }
  ```
- **Common Errors**: `400 Bad Request` (Password mismatch or incorrect current password), `401 Unauthorized`.

---

## 2. User & Progression Endpoints (`/api/user`)

### `GET /api/user/profile`
- **Authentication**: Required
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "profile": {
      "id": "cuid...",
      "username": "HeroName",
      "email": "hero@example.com",
      "level": 1,
      "xp": 0,
      "gold": 100,
      "attributes": [...],
      "activityLogs": [...],
      "_count": { "quests": 5 }
    }
  }
  ```

---

### `PATCH /api/user/profile`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "username": "NewHeroName"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Profile updated successfully",
    "profile": { "id": "cuid...", "username": "NewHeroName", ... }
  }
  ```
- **Common Errors**: `400 Bad Request` (Invalid input; note that level, xp, gold are stripped by Zod).

---

### `GET /api/user/stats`
- **Authentication**: Required
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "stats": {
      "level": 2,
      "xp": 300,
      "xpToNextLevel": 2000,
      "levelProgressPercent": 15,
      "gold": 250,
      "streakDays": 3,
      "attributesCount": 5,
      "attributes": [...],
      "quests": {
        "total": 10,
        "completed": 6,
        "inProgress": 2,
        "available": 2,
        "failed": 0,
        "completionRate": 60
      },
      "activityLogsCount": 12
    }
  }
  ```

---

### `GET /api/user/attributes`
- **Authentication**: Required
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "attributes": [
      { "id": "attr-1", "name": "Discipline", "value": 12, "max": 100 },
      { "id": "attr-2", "name": "Strength", "value": 10, "max": 100 }
    ]
  }
  ```

---

### `POST /api/user/attributes`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Agility",
    "value": 10,
    "max": 100
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Attribute created successfully",
    "attribute": { "id": "attr-3", "name": "Agility", "value": 10, "max": 100 }
  }
  ```
- **Common Errors**: `400 Bad Request`, `409 Conflict` (Attribute name already exists for user).

---

### `GET /api/user/activity`
- **Authentication**: Required
- **Query Parameters**: `limit` (optional integer, default `20`, max `100`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "activities": [
      {
        "id": "log-1",
        "userId": "user-1",
        "text": "Completed 'Morning Workout'",
        "extra": "+100 XP, +50 Gold",
        "createdAt": "2026-09-12T..."
      }
    ]
  }
  ```

---

## 3. Quest Management Endpoints (`/api/quests`)

### `GET /api/quests`
- **Authentication**: Required
- **Query Parameters**: `status` (optional), `category` (optional)
- **Success Response (`200 OK`)**:
  ```json
  {
    "quests": [
      {
        "id": "quest-1",
        "userId": "user-1",
        "title": "Daily Workout",
        "description": "30 mins cardio",
        "category": "Fitness",
        "difficulty": "Medium",
        "xp": 100,
        "gold": 50,
        "status": "available",
        "createdAt": "2026-09-12T..."
      }
    ]
  }
  ```

---

### `POST /api/quests`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Read 20 pages",
    "description": "Read Chapter 4 of System Design",
    "category": "Learning",
    "difficulty": "Easy",
    "xp": 50,
    "gold": 25
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Quest created successfully",
    "quest": { "id": "quest-2", "title": "Read 20 pages", "status": "available", ... }
  }
  ```

---

### `GET /api/quests/[id]`
- **Authentication**: Required
- **Success Response (`200 OK`)**: Returns quest matching `id` if owned by user.
- **Common Errors**: `403 Forbidden` (Owned by another user), `404 Not Found`.

---

### `PATCH /api/quests/[id]`
- **Authentication**: Required
- **Request Body**: Partial quest updates (`title`, `description`, `category`, `difficulty`, `xp`, `gold`, `status`).
- **Success Response (`200 OK`)**: Updated quest details.
- **Common Errors**: `403 Forbidden`, `404 Not Found`.

---

### `DELETE /api/quests/[id]`
- **Authentication**: Required
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "quest-1",
    "message": "Quest deleted successfully"
  }
  ```
- **Common Errors**: `403 Forbidden`, `404 Not Found`.

---

### `PATCH /api/quests/[id]/status`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```
  *(Allowed values: `"available"`, `"in-progress"`, `"completed"`, `"failed"`)*
- **Server Behavior**: When status changes to `"completed"`, the backend safely processes trusted XP and Gold rewards server-side.
- **Success Response (`200 OK`)**:
  ```json
  {
    "quest": { "id": "quest-1", "status": "completed", ... },
    "userRewards": {
      "xpGained": 100,
      "goldGained": 50,
      "leveledUp": false,
      "user": { "id": "user-1", "level": 1, "xp": 100, "xpToNextLevel": 1000, "gold": 150 }
    }
  }
  ```
- **Common Errors**: `400 Bad Request`, `403 Forbidden`, `404 Not Found`.

---

## 4. Rewards, Inventory & Shop Endpoints

### `GET /api/rewards`
- **Authentication**: Required
- **Query Parameters**: `category` (optional)
- **Success Response (`200 OK`)**: List of available shop rewards from DB.

---

### `POST /api/rewards`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Coffee Treat",
    "description": "Enjoy an espresso",
    "cost": 75,
    "icon": "coffee",
    "category": "Real Life"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Reward created successfully",
    "reward": { "id": "reward-1", "title": "Coffee Treat", ... }
  }
  ```

---

### `GET /api/inventory`
- **Authentication**: Required
- **Success Response (`200 OK`)**: Returns authenticated user's inventory items with reward metadata.

---

### `PATCH /api/inventory/[id]`
- **Authentication**: Required
- **Request Body**: `isEquipped` (boolean), `quantity` (number).
- **Success Response (`200 OK`)**: Updated inventory item object.
- **Common Errors**: `403 Forbidden`, `404 Not Found`.

---

### `DELETE /api/inventory/[id]`
- **Authentication**: Required
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "inv-1",
    "message": "Inventory item removed"
  }
  ```

---

### `POST /api/shop/purchase`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "rewardId": "reward-1"
  }
  ```
- **Server Mechanics**:
  1. Fetches reward cost from server-side database (client cost value is never trusted).
  2. Verifies authenticated user's gold balance.
  3. Executes an atomic `$transaction` deducting gold, recording purchase history, and granting inventory item.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Purchase completed successfully",
    "goldRemaining": 25,
    "purchase": { "id": "purch-1", "rewardId": "reward-1", "cost": 75 },
    "inventoryItem": { "id": "inv-1", "title": "Coffee Treat", "quantity": 1 }
  }
  ```
- **Common Errors**: `400 Bad Request` (Insufficient gold balance), `404 Not Found` (Reward or user missing).
