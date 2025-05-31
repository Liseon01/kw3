const model = require("../models");
const { Op } = require("sequelize");
const course_assignment = require("../models/course_assignment");

// GET 대학, 학부, 과목명, 교수명 쿼리
async function getCourseAssignmentInfo(req, res, next) {
  const { college_id, department_id, course_name, professor_name } = req.query;

  const where_condition = {};

  if (college_id) {
    where_condition.college_id = college_id;
  }
  if (department_id) {
    where_condition.department_id = department_id;
  }
  // include 안에 들어갈 조건
  const courseInclude = {
    model: model.course,
    attributes: ["course_name"],
  };

  if (course_name) {
    courseInclude.where = {
      course_name: {
        [Op.like]: `%${course_name}%`,
      },
    };
  }
  const professorInclude = {
    model: model.professor,
    attributes: ["name"],
  };

  if (professor_name) {
    professorInclude.where = {
      name: {
        [Op.like]: `%${professor_name}%`,
      },
    };
  }

  const course_info = await model.course_assignment
    .findAll({
      where: where_condition,
      include: [courseInclude, professorInclude],
    })
    .catch((err) => {
      console.log(err);
      console.log("검색중 오류가 발생했습니다.");
      return res.status(500).json({ meesage: "Server Error" });
    });

  if (course_info.length == 0) {
    console.log("등록된 과목 내역이 존재하지 않습니다.");
    return res
      .status(401)
      .json({ message: "등록된 과목 내역이 존재하지 않습니다." });
  }
  return res.status(200).json(course_info);
}

//---------------------------------------------------------------------------------------------

// POST 교수가 강의할 과목 등록
async function makeCourseAssignment(req, res, next) {
  const user_id = req.user_id;
  const today = new Date();
  const {
    day1,
    day1_start_time,
    day1_end_time,
    day2,
    day2_start_time,
    day2_end_time,
    max_enrollments,
    course_classroom,
    course_id,
    department_id,
  } = req.body;

  if (!user_id) {
    console.log("user_id값을 전달받지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }
  const professor_info = await model.professor
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => console.log(err));
  if (!professor_info) {
    console.log("교수 정보를 찾지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }

  const current_semester_info = await model.semester.findOne({
    where: {
      start_date: { [Op.lte]: today },
      end_date: { [Op.gte]: today },
    },
  });
  if (!current_semester_info) {
    console.log("현재 학기 정보가 데이터베이스에 존재하지 않습니다.");
    return res.status(401).json({ message: "Server Error" });
  }

  // 중복 등록 방지
  const is_exist = await model.course_assignment.findOne({
    where: {
      course_id: course_id,
      semester_id: current_semester_info.semester_id,
      professor_id: professor_info.professor_id,
    },
  });

  if (is_exist) {
    console.log("이미 등록된 강의입니다.");
    return res.status(401).json({ message: "이미 등록된 강의입니다." });
  }

  const data = {
    day1: day1,
    day1_start_time: day1_start_time,
    day1_end_time: day1_end_time,
    day2: day2,
    day2_start_time: day2_start_time,
    day2_end_time: day2_end_time,
    course_status: "개강",
    course_establish_date: new Date(),
    max_enrollments: max_enrollments,
    current_enrollments: 0,
    course_classroom: course_classroom,
    syllabus_id: null,
    semester_id: current_semester_info.semester_id,
    professor_id: professor_info.professor_id,
    course_id: course_id,
    department_id: department_id,
  };

  const courseAssignment_info = await model.course_assignment
    .create(data)
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  res.status(201).json(courseAssignment_info);
}

// POST 과목등록 수정
async function updateCourseAssignment(req, res, next) {
  const user_id = req.user_id;
  const course_assignment_id = req.params.id;
  const today = new Date();
  const {
    day1,
    day1_start_time,
    day1_end_time,
    day2,
    day2_start_time,
    day2_end_time,
    max_enrollments,
    course_classroom,
    course_id,
    department_id,
  } = req.body;

  if (!user_id) {
    console.log("user_id값을 전달받지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }
  const professor_info = await model.professor
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => console.log(err));
  if (!professor_info) {
    console.log("교수 정보를 찾지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }

  const current_semester_info = await model.semester.findOne({
    where: {
      start_date: { [Op.lte]: today },
      end_date: { [Op.gte]: today },
    },
  });
  if (!current_semester_info) {
    console.log("현재 학기 정보가 데이터베이스에 존재하지 않습니다.");
    return res.status(401).json({ message: "Server Error" });
  }

  const is_exist = await model.course_assignment.findOne({
    where: {
      course_id: course_id,
      professor_id: professor_info.professor_id,
      course_assignment_id: { [Op.ne]: course_assignment_id },
    },
  });

  if (is_exist) {
    console.log("해당 과목은 이미 등록되었습니다.");
    return res
      .status(401)
      .json({ message: "해당 과목은 이미 등록되었습니다." });
  }

  const data = {
    day1: day1,
    day1_start_time: day1_start_time,
    day1_end_time: day1_end_time,
    day2: day2,
    day2_start_time: day2_start_time,
    day2_end_time: day2_end_time,
    course_status: "개강",
    course_establish_date: new Date(),
    max_enrollments: max_enrollments,
    current_enrollments: 0,
    course_classroom: course_classroom,
    syllabus_id: null,
    semester_id: current_semester_info.semester_id,
    professor_id: professor_info.professor_id,
    course_id: course_id,
    department_id: department_id,
  };

  const [courseAssignment_info] = await model.course_assignment
    .update(data, {
      where: {
        course_assignment_id: course_assignment_id,
        professor_id: professor_info.professor_id,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (courseAssignment_info === 0) {
    console.log("해당 id로 등록된 강의정보가 존재하지 않습니다.");
    return res
      .status(401)
      .json({ message: "등록된 강의정보가 존재하지 않습니다." });
  }
  res.status(201).json({ message: "등록정보가 변경되었습니다." });
}

// DELETE
async function deleteCourseAssignment(req, res, next) {
  const user_id = req.user_id;
  const course_assignment_id = req.params.id;
  const professor_info = await model.professor
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => console.log(err));
  if (!professor_info) {
    console.log("교수 정보를 찾지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }
  const delete_course_assignment = await model.course_assignment
    .destroy({
      where: {
        course_assignment_id: course_assignment_id,
        professor_id: professor_info.professor_id,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!delete_course_assignment) {
    console.log("삭제할 강의등록 정보를 찾을 수 없습니다.");
    return res.status(404).json({ message: "Invalid Access" });
  } else {
    return res.status(200).json({ message: "강의등록이 취소되었습니다." });
  }
}

module.exports = {
  getCourseAssignmentInfo,
  makeCourseAssignment,
  updateCourseAssignment,
  deleteCourseAssignment,
};
