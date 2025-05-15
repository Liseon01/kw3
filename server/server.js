const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const authRouter = require("./router/auth.js");
const config = require("./configs/config.js");
const Sequelize = require("sequelize");

const app = express();
const sequelize = new Sequelize(
  `mysql://${config.db.host}:${config.db.password}@localhost:3306/se3_project`
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL 데이터베이스 연결 성공");

    // 서버 리스닝 시작 (MySQL 연결이 성공한 후)
    app.listen(config.host.port, () => {
      console.log("서버가 3000번 포트에서 실행 중...");
    });
  })
  .catch((error) => {
    console.error("MySQL 데이터베이스 연결 실패:", error);
  });
