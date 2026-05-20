require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");
const apiRouter = require("./routes");
const cors = require("cors");
const loggerMiddleware = require("./middlewares/logger.middleware");
const mongoose = require("mongoose");
const { PORT, DATABASE_URL } = require("./env");

const app = express(); //프레임 워크, node_modules의 파일이 엮여짐

/**
 * Helmet 설정
 *
 * Helmet은 Express 서버의 HTTP 응답 헤더를 보안에 유리하게 설정해주는 미들웨어
 * 예를 들어 XSS, MIME 스니핑, 클릭재킹 같은 기본적인 웹 취약점 방어에 도움을 줌
 *
 * contentSecurityPolicy: false
 * - CSP(Content Security Policy)를 비활성화함
 * - API 서버에서는 CSP가 꼭 필요하지 않은 경우가 많음
 * - 프론트엔드, 이미지, CDN, 외부 리소스와 충돌할 수 있어서 로컬 개발 단계에서는 꺼두는 경우가 많음
 *
 * crossOriginResourcePolicy: { policy: "cross-origin" }
 * - 다른 origin에서 리소스 접근을 허용하기 위한 설정
 * - 지금은 Next.js가 localhost:3000, Express가 localhost:8080처럼 서로 다른 origin일 가능성이 있으므로
 *   프론트에서 정적 파일이나 API 리소스 접근 시 막히는 문제를 줄이기 위해 설정
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/**
 * JSON Body Parser
 *
 * 클라이언트가 JSON 형식으로 보낸 요청 body를 req.body로 사용할 수 있게 파싱
 * 예:
 * POST /api/users
 * {
 *   "email": "test@test.com",
 *   "password": "1234"
 * }
 *
 * 위 데이터가 req.body.email, req.body.password로 들어옴
 *
 * limit: "1mb"
 * - 요청 body 크기를 1MB로 제한
 * - 너무 큰 JSON 요청으로 서버 메모리를 과하게 쓰는 것을 방지
 */
app.use(express.json({ limit: "1mb" })); //미들웨어 설정, json형식으로 된 데이터를 파싱

/**
 * URL-encoded Body Parser
 *
 * HTML form 또는 x-www-form-urlencoded 형식으로 들어오는 데이터를 파싱
 *
 * 예:
 * email=test@test.com&password=1234
 *
 * extended: true
 * - 중첩 객체 형태의 데이터도 파싱할 수 있게 함
 */
app.use(express.urlencoded({ extended: true })); //urlencoded형식으로 된 데이터를 파싱 -> 쿼리스트링
/**
 * Cookie Parser
 *
 * 요청 헤더에 포함된 Cookie 값을 req.cookies로 사용할 수 있게 해줌
 *
 * 예:
 * Cookie: accessToken=abc123
 *
 * req.cookies.accessToken 으로 접근 가능해짐
 */
app.use(cookieParser());

// ✅ CORS 설정 (Next dev: http://localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 쿠키 쓸 때 필요 (지금은 없어도 무방)
  }),
);

/**
 * API Rate Limiter
 *
 * 특정 시간 동안 같은 IP에서 너무 많은 요청을 보내지 못하게 제한
 * 무분별한 요청, 간단한 DoS 공격, 실수로 인한 반복 호출을 어느 정도 막을 수 있음
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 제한 시간 범위, 15 * 60 * 1000 = 15분
  limit: 100, // 15분 동안 IP당 최대 요청 수
  standardHeaders: "draft-8", // 표준 RateLimit 응답 헤더 사용
  legacyHeaders: false, // 예전 방식의 X-RateLimit-* 헤더 비활성화, 최신 표준 헤더만 사용하겠다는 의미
  message: {
    // 요청 제한에 걸렸을 때 응답할 메시지
    message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  },
});

// ✅ public 폴더를 /static 으로 노출
app.use("/static", express.static(path.join(__dirname, "public"))); // 정적 파일 서빙
app.use("/api", apiLimiter, loggerMiddleware, apiRouter); // 8080으로 들어오는 요청은 무조건 여기로 감

// 404 처리 미들웨어
app.use((_req, res) =>
  res.status(404).json({ message: "올바르지 않은 API 경로입니다." }),
);
/**
 * 에러 처리 미들웨어
 *
 * 라우터나 미들웨어 내부에서 에러가 발생하고 next(err)로 넘어오면 여기서 처리
 *
 * 주의:
 * 지금은 모든 에러를 500으로 응답
 *
 * TODO
 * 나중에는 ValidationError, AuthError, NotFoundError 등을 구분해서 처리하는 게 좋음.
 */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("DB 연결 성공");

    app.listen(PORT, () => {
      console.log(`서버 실행 중: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB 연결 실패:", err);
  });
