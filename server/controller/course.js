const model = require("../models");
const { Op } = require("sequelize");

// GET 대학, 학부, 과목명, 교수명 쿼리
async function getCourseInfo(req, res, next) {
  const { college_id, department_id, course_name, professor_name } = req.query;

  const where_condition = {};

  if (college_id) {
    where_condition.college_id = college_id;
  }
  if (department_id) {
    where_condition.department_id = department_id;
  }
  if (course_name) {
    where_condition.course_name = { [Op.like]: `%${course_name}%` };
  }
  if (professor_name) {
    where_condition.professor_name = { [Op.like]: `%${professor_name}%` };
  }

  const course_info = await model.course
    .findAll({
      where:
        Object.keys(where_condition).length > 0 ? where_condition : undefined,
    })
    .catch((err) => {
      console.log(err);
      console.log("검색중 오류 발행");
      return res.status(500).json({ meesage: "검색 중 오류 발생" });
    });

  if (course_info.length == 0) {
    console.log("과목 조회 내역이 존재하지 않습니다.");
    return res.status(401).json({ message: "해당 과목은 존재하지 않습니다." });
  }
  return res.status(200).json(course_info);
}

// // POST 관리자만 사용가능 필수 X
// async function makeCourse(req, res, next) {}

// // DELETE 관리자만 사용 가능 필수 X
// async function deleteCourse(req, res, next) {}

module.exports = { getCourseInfo };
