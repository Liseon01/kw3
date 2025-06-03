const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const config = require("./configs/config.js");
const Sequelize = require("sequelize");

// Router
const authRouter = require("./router/auth.js");
const registrationRouter = require("./router/registration.js");
const courseRouter = require("./router/course.js");
const collegeRouter = require("./router/college.js");
const courseAssignmentRouter = require("./router/course_assignment.js");
const gradeRouter = require("./router/grade.js");
const noticeRouter = require("./router/notice.js");
const documentRouter = require("./router/document.js");
const syllabusRouter = require("./router/syllabus.js");
const assignmentRouter = require("./router/assignment.js");
const submissionRouter = require("./router/submission.js");
const masterRouter = require("./router/master.js");
const semesterRouter = require("./router/semester.js");

const app = express();
const sequelize = new Sequelize(
  `mysql://${config.db.host}:${config.db.password}@localhost:3306/se3_project`
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/auth", authRouter);
app.use("/registration", registrationRouter);
app.use("/course", courseRouter);
app.use("/college", collegeRouter);
app.use("/courseAssignment", courseAssignmentRouter);
app.use("/grade", gradeRouter);
app.use("/notice", noticeRouter);
app.use("/document", documentRouter);
app.use("/syllabus", syllabusRouter);
app.use("/assignment", assignmentRouter);
app.use("/submission", submissionRouter);
app.use("/master", masterRouter);
app.use("/semester", semesterRouter);

app.use("/uploads", express.static("uploads"));

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
      console.log("서버가 7070번 포트에서 실행 중...");
    });
  })
  .catch((error) => {
    console.error("MySQL 데이터베이스 연결 실패:", error);
  });
