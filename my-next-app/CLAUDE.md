# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier (includes Tailwind class sorting)
```

No test runner is configured.

## Architecture

### Layer Overview

```
app/actions/       ← Server actions (data fetching + mutations)
app/utils/         ← apiClient (fetch wrapper), API constants
app/services/      ← Business logic wrapping apiClient
features/          ← Feature modules (auth, feed, post, comment, users, signup, login)
containers/        ← Smart async components (fetch data, pass to UI)
components/common/ ← Shared presentational components
stores/            ← Zustand global state (auth, signup)
hooks/             ← Shared custom hooks
lib/               ← Server-only utilities (getMeServer for SSR auth)
styles/            ← Design tokens (tokens.css), globals
```

### Data Flow

**Server-rendered pages:** Page → async Container → Server Action → `apiClient` → Express backend (`API_BASE_URL`)

**Client interactions:** Client component → `"use server"` action → `apiClient` with `credentials: "include"` (cookie auth)

`apiClient` at `app/utils/api-client.ts` is the single fetch wrapper. Use `API_BASE_URL` server-side and `NEXT_PUBLIC_API_BASE_URL` client-side.

### Feature Module Structure

Each feature under `features/` follows this internal structure:

```
features/<name>/
  ui/          ← React components
  api/         ← API call functions
  hooks/       ← Feature-specific hooks
  constants/   ← Error messages, config
  validation/  ← Validators (used with react-hook-form)
  types/       ← Feature-specific TypeScript types
  dto/         ← Data transform helpers
```

### Routing

- `app/(main)/` — Authenticated layout with `Sidebar`
- `app/(public)/` — Unauthenticated pages (login, signup)
- `app/(main)/@modal/` and `@sheet/` — Parallel routes for overlays; use `window.history.replaceState` instead of `router.replace` when updating search params to avoid triggering intercepting routes

### Styling

Tailwind CSS v4 with custom design tokens defined in `styles/base/tokens.css` via `@theme`. Use token names directly as Tailwind classes:

- **Colors:** `warm-white`, `cool-gray`, `near-black`, `linen`, `rust`, `sand`, `silver`, `light-gray`
- **Font sizes:** defined as `--font-size-*` tokens (xs through 9xl)

`prettier-plugin-tailwindcss` auto-sorts class order on format.

### State Management

- **`useAuthStore`** — Current user, login/logout state
- **`useSignupStore`** — Multi-step signup form state
- React Query is installed but not yet used; local `useState` + server actions is the current pattern

### Infinite Scroll

`hooks/useInfiniteScrollList.ts` handles cursor-based pagination with IntersectionObserver. Pass `initialItems`, `initialCursor`, `initialHasNext`, and a `fetchPage` async function.

### Auth

- Server-side auth check: `lib/auth/getMeServer.ts` (reads cookie)
- Client-side init: `features/auth/ui/AuthInitializer.tsx` hydrates Zustand on mount
- Protected routes redirect via server component checks in page files

## Environment

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080   # Client-side
API_BASE_URL=http://localhost:8080               # Server-side (server actions)
```

Backend is a separate Express project at `../express-pjt/`.

## Code Style

- 코드 작성 시 로직의 의도가 바로 파악되지 않는 부분에는 간단한 주석을 달아준다.
- 자명한 코드(변수명·함수명만으로 충분한 경우)에는 주석을 생략한다.

## FSD convention

1. 모든 slice는 index.ts를 통해서만 외부 공개한다.
2. shared에는 비즈니스 로직을 넣지 않는다.
3. features는 사용자 행동 기준으로 이름 짓는다.
4. entities는 도메인 명사 기준으로 이름 짓는다.
5. 같은 layer의 slice끼리는 직접 import하지 않는다.
6. pages는 조립만 담당하고, 복잡한 로직은 features/widgets로 내린다.
7. components, hooks, utils 같은 전역 폴더는 만들지 않는다.
