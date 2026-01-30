const express = require("express");
const apiRouter = require("./routes");

const app = express(); //프레임 워크, node_modules의 파일이 엮여짐

app.use(express.json()); //미들웨어 설정, json형식으로 된 데이터를 파싱
app.use(express.urlencoded({ extended: true })); //urlencoded형식으로 된 데이터를 파싱 -> 쿼리스트링

app.use("/api", apiRouter); // 8080으로 들어오는 요청은 무조건 여기로 감

app.use((req, res) =>
  res.status(404).json({ message: "올바르지 않은 API 경로입니다." })
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

app.listen(8080, () => console.log("running on 8080"));
