require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const apiRouter = require("./routes");
const cors = require("cors");
const loggerMiddleware = require("./middlewares/logger.middleware");
const mongoose = require("mongoose");
const { PORT, DATABASE_URL } = require("./env");

const app = express(); //프레임 워크, node_modules의 파일이 엮여짐

app.use(express.json()); //미들웨어 설정, json형식으로 된 데이터를 파싱
app.use(express.urlencoded({ extended: true })); //urlencoded형식으로 된 데이터를 파싱 -> 쿼리스트링
app.use(cookieParser());

// ✅ CORS 설정 (Next dev: http://localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 쿠키 쓸 때 필요 (지금은 없어도 무방)
  })
);

// ✅ public 폴더를 /static 으로 노출
app.use("/static", express.static(path.join(__dirname, "public"))); // 정적 파일 서빙
app.use("/api", loggerMiddleware, apiRouter); // 8080으로 들어오는 요청은 무조건 여기로 감

app.use((_req, res) =>
  res.status(404).json({ message: "올바르지 않은 API 경로입니다." })
);
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
