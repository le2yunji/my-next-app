# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the server
node index.js
# or
npm start

# Install dependencies (uses pnpm)
pnpm install
```

There is no test runner configured (`npm test` exits with error). There is no dev/watch mode script — use `node index.js` directly or add `nodemon` manually if needed.

## Environment Variables

Create a `.env` file in the project root with:

```
PORT=
DATABASE_URL=           # MongoDB connection string
PUBLIC_ASSET_BASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
```

Exported via [env.js](env.js) and imported by name throughout the app (not via `process.env` directly).

## Architecture

This is an Express.js REST API backend for a SNS app. It connects to MongoDB via Mongoose and serves a Next.js frontend at `http://localhost:3000`.

**Request lifecycle:**

```
index.js → /api → loggerMiddleware → routes/index.js
  → /auth     → routes/auth.route.js     → controllers/auth.controller.js
  → /feed     → routes/feed.route.js     → controllers/feed.controller.js
  → /users    → routes/users.route.js    → controllers/users.controller.js
                                            controllers/post.controller.js
                                            controllers/board.controller.js
                                            controllers/comments.controller.js
```

**Layered pattern (controller → service → repository → model):**

- Controllers handle HTTP req/res and delegate to services
- Services contain business logic and call repositories
- Repositories are thin wrappers over Mongoose model calls
- Models define Mongoose schemas

**Auth flow:**

- JWT-based with `accessToken` + `refreshToken` stored as `httpOnly` cookies
- `authenticate` middleware: requires valid access token, attaches `req.user = { mongoId, userId }`
- `optionalAuthenticate` middleware: passes through even without a token (sets `req.user = null`)
- `POST /api/auth/refresh`: issues new access token from a valid refresh token
- Token payloads include a `type` field (`"access"` or `"refresh"`) that must be validated

**Error handling pattern:**

- Domain errors are defined as objects in [constants/auth-error.js](constants/auth-error.js) with `{ code, message, status }`
- Throw via `createAppError(AUTH_ERROR.SOME_ERROR)` from [utils/app-error.js](utils/app-error.js)
- All controller functions use `try/catch` and forward errors to `next(error)`
- Global error handler in [index.js](index.js) returns `500` for unhandled errors
- All API responses include an `isError` boolean field

**Static assets:**

- Served at `/static` from the `public/` directory
- Default profile image path stored in DB as `static/images/profiles/default.webp`

**Key data models:**

- `User` — userId, email, passwordHash, interestCategories[], followerCount, followingCount, postCount, boardCount, isDeleted (soft delete)
- `Follow` — followerId (ObjectId ref User), followingId (ObjectId ref User)
- `Post`, `Board`, `BoardItems`, `Comment`, `PostLike` — standard SNS content

## Code Style

코드 작성 시 로직이 한눈에 파악되지 않는 부분에는 간단한 한 줄 주석을 달아준다. 예시:

```js
// 탈퇴 회원 제외하고 중복 확인
const existingUser = await User.findOne({ isDeleted: false, ... });

// 비밀번호 해시화 (saltRounds: 10)
const passwordHash = await bcrypt.hash(password, 10);
```

주석은 "무엇을 하는지"보다 "왜 하는지"를 위주로 짧게 작성한다. 자명한 코드에는 달지 않는다.

**Input validation:**

- HTTP-layer validation in `middlewares/validate-*.middleware.js` (format checks via regex utils)
- Business logic validation in services (duplicate checks, category limits, etc.)
- Regex helpers and normalizers live in [utils/regex.js](utils/regex.js)
- Interest categories are validated against the enum in [constants/interest-categories.js](constants/interest-categories.js)
