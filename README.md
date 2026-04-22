# my-sns-app

SNS 서비스 풀스택 모노레포.

```
my-sns-app/
├── my-next-app/   ← Next.js 14 프론트엔드
└── express-pjt/   ← Express.js 백엔드 API
```

---

## my-next-app (Next.js 14, App Router)

### 폴더 구조

```
my-next-app/
├── app/
│   ├── (main)/            ← 인증된 레이아웃 (사이드바 포함)
│   │   ├── page.tsx       ← 홈 피드
│   │   ├── posts/[postId]/
│   │   ├── boards/[boardId]/
│   │   ├── users/[userId]/
│   │   ├── notification/
│   │   ├── saved/
│   │   ├── search/
│   │   ├── @modal/        ← 모달 병렬 라우트
│   │   │   ├── (.)posts/[postId]/
│   │   │   ├── (.)boards/[boardId]/
│   │   │   └── (.)users/[userId]/
│   │   └── @sheet/        ← 바텀시트 병렬 라우트
│   │       └── (.)posts/[postId]/comments/
│   ├── (public)/          ← 비인증 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── actions/           ← Server Actions (데이터 패칭 + 뮤테이션)
│   ├── services/          ← apiClient를 감싸는 서버 서비스
│   └── utils/             ← api-client.ts, API 상수
├── features/              ← 도메인별 피처 모듈
├── components/common/     ← 공유 UI 컴포넌트
├── containers/            ← 비동기 스마트 컴포넌트
├── hooks/                 ← 공용 커스텀 훅
├── stores/                ← Zustand 전역 상태
├── lib/                   ← 서버 전용 유틸 (SSR 인증 등)
├── styles/                ← 디자인 토큰 (tokens.css), globals
└── types/                 ← 전역 TypeScript 타입
```

### 피처 모듈 (`features/`)

각 피처는 아래 디렉토리를 필요에 따라 포함한다.

```
features/<name>/
├── ui/          ← React 컴포넌트
├── api/         ← API 호출 함수
├── hooks/       ← 피처 전용 훅
├── types/       ← TypeScript 타입
├── dto/         ← 데이터 변환 헬퍼
├── constants/   ← 에러 메시지, 설정값
└── validation/  ← react-hook-form용 유효성 검사
```

| 피처            | 역할                                          |
| --------------- | --------------------------------------------- |
| `auth`          | 인증 로직, `AuthInitializer`, 유효성 검사     |
| `login`         | 로그인 폼 & 플로우                            |
| `signup`        | 멀티스텝 회원가입 폼 & 플로우                 |
| `home`          | 메인 피드 — `FeedList`, `FeedItem` 컴포넌트군 |
| `posts`         | 포스트 상세 표시 / CRUD UI                    |
| `comments`      | 댓글 UI                                       |
| `users`         | 유저 프로필 UI                                |
| `boards`        | 보드(컬렉션) UI                               |
| `feeds`         | 유저 피드 뷰                                  |
| `explore`       | 탐색/발견 뷰                                  |
| `saved`         | 저장된 항목 뷰                                |
| `notifications` | 알림 UI                                       |

### 데이터 흐름

```
[SSR] Page → async Container → Server Action → apiClient → Express API
[CSR] Client Component → "use server" Action → apiClient (cookie 인증)
```

- `app/utils/api-client.ts` — 단일 fetch 래퍼
- 서버: `API_BASE_URL`, 클라이언트: `NEXT_PUBLIC_API_BASE_URL`

### 주요 공유 인프라

| 경로                             | 내용                                                  |
| -------------------------------- | ----------------------------------------------------- |
| `components/common/button/`      | `PrimaryButton`, `SecondaryButton`                    |
| `components/common/input/`       | `TextInput`, `PasswordInput`, `BaseInput`             |
| `components/common/sidebar/`     | `Sidebar`, `SidebarItem`, `Logo`, `SidebarUserAvatar` |
| `components/common/board/`       | `Board`, `BoardCollage`, `BoardContent`               |
| `hooks/useInfiniteScrollList.ts` | 커서 기반 무한 스크롤 (IntersectionObserver)          |
| `stores/auth.store.ts`           | 현재 유저, 로그인/로그아웃 상태                       |
| `stores/useSignupStore.ts`       | 멀티스텝 회원가입 폼 상태                             |
| `lib/auth/getMeServer.ts`        | SSR용 서버 인증 체크                                  |

---

## express-pjt (Express.js)

### 폴더 구조

```
express-pjt/
├── routes/          ← 라우트 정의 (index.js에서 통합)
├── controllers/     ← 요청 핸들러
├── services/        ← 비즈니스 로직
├── repositories/    ← DB 쿼리 (데이터 접근)
├── models/          ← Sequelize 모델
├── mappers/         ← DTO 변환
├── middlewares/     ← 인증, 유효성 검사, 로거
├── validators/      ← 입력값 검증
├── utils/           ← 공용 유틸
├── constants/       ← 에러 메시지, 열거형
└── data/            ← 시드 / 목 데이터
```

### 도메인 구조

| 도메인 | 라우트 파일          | 서비스                                                                      | 리포지토리                                          |
| ------ | -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------- |
| 인증   | `auth.route.js`      | `auth/login.service.js`<br>`auth/signup.service.js`<br>`auth/me.service.js` | `user.repository.js`                                |
| 유저   | `users.route.js`     | `user-profile.service.js`<br>`follow.service.js`                            | `user.repository.js`<br>`follow.repository.js`      |
| 포스트 | `posts.route.js`     | `post-detail.service.js`                                                    | `post.repository.js`                                |
| 피드   | `feed.route.js`      | `feed.service.js`                                                           | `post.repository.js`                                |
| 댓글   | (postsRouter에 등록) | `comments.service.js`                                                       | `comment.repository.js`                             |
| 보드   | (postsRouter에 등록) | `board.service.js`                                                          | `board.repository.js`<br>`board-item.repository.js` |

### 모델 (Sequelize)

`user` · `post` · `post-like` · `comment` · `board` · `boardItems` · `follow`

### 매퍼 (DTO 변환)

`user.mapper.js` · `posts.mapper.js` · `post-detail.mapper.js` · `feed.mapper.js` · `board.mapper.js` · `comment.mapper.js`

### 미들웨어

| 파일                            | 역할                 |
| ------------------------------- | -------------------- |
| `auth.middleware.js`            | JWT/쿠키 인증 검증   |
| `validate-login.middleware.js`  | 로그인 입력값 검증   |
| `validate-signup.middleware.js` | 회원가입 입력값 검증 |
| `logger.middleware.js`          | 요청 로깅            |

### 주요 유틸

`pagination.js` · `comment-thread.js` · `board-cursor.js` · `cookie.js` · `app-error.js`

---

## 환경 변수

```env
# my-next-app/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080   # 클라이언트
API_BASE_URL=http://localhost:8080               # 서버 (Server Actions)
```

## 개발 서버 실행

```bash
# 백엔드
cd express-pjt && pnpm run start

# 프론트엔드
cd my-next-app && pnpm run dev:webpack
```
