const model = require("../models");
const { Op } = require("sequelize");

// GET 모든 성적 불러오기 -> Student Only
async function getAllGradeById(req, res) {
  const user_id = req.user_id;
  if (!user_id) {
    console.log("user_id값을 전달받지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }
  const student_info = await model.student
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => console.log(err));
  if (!student_info) {
    console.log("학생 정보를 찾지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }

  const registration_info = await model.registration
    .findAll({
      where: { student_id: student_info.student_id },
      include: [
        {
          model: model.course_assignment,
          include: [
            {
              model: model.course,
              attributes: ["course_name"],
            },
          ],
        },
        {
          model: model.semester,
          attributes: ["semester_year"],
        },
      ],
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (registration_info.length === 0) {
    console.log("성적 정보를 찾을 수 없습니다.");
    return res.status(401).json({ message: "성적 목록이 없습니다." });
  }
  const grade_info = registration_info.map((data) => ({
    semester_year: data.semester.semester_year,
    course_name: data.course_assignment.course.course_name,
    grade: data.grade,
  }));

  return res.status(200).json(grade_info);
}

// GET 강의듣는 수강생 성적 불러오기-> Professor Only
async function getStudentGradeByCourseAssignmentId(req, res) {
  const user_id = req.user_id;
  const course_assignment_id = req.params.id;
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
  const course_assignment_info = await model.course_assignment
    .findOne({
      where: { course_assignment_id: course_assignment_id },
      include: [
        {
          model: model.course,
          attributes: ["course_name"],
        },
      ],
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!course_assignment_info) {
    console.log("수강 등록 정보를 찾을 수 없습니다.");
    return res
      .status(401)
      .json({ message: "수강 등록 정보를 찾을 수 없습니다." });
  }

  const registration_info = await model.registration
    .findAll({
      where: { course_assignment_id: course_assignment_id },
      include: [
        {
          model: model.student,
          attributes: ["name"],
          include: [
            {
              model: model.user,
              attributes: ["id_num"],
            },
          ],
        },
        {
          model: model.semester,
          attributes: ["semester_year"],
        },
      ],
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (registration_info.length === 0) {
    console.log("수강생이 존재하지 않습니다.");
    return res.status(401).json({ message: "수강생이 존재하지 않습니다." });
  }

  const student_grade_info = registration_info.map((data) => ({
    registration_id: data.registration_id,
    course_repetition_status: data.course_repetition_status,
    id_num: data.student.user.id_num,
    name: data.student.name,
    semester_year: data.semester.semester_year,
    course_name: course_assignment_info.course.course_name,
  }));

  return res.status(200).json(student_grade_info);
}

// POST 수강생 성적 입력-> Professor Only
async function assignGradeToStudent(req, res) {
  const user_id = req.user_id;
  const registration_id = req.params.id;
  const {
    assignment_score,
    midterm_exam_score,
    final_exam_score,
    attendance_score,
    attitude_score,
    grade,
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

  const registration_info = await model.registration
    .findOne({ where: { registration_id: registration_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (!registration_info) {
    console.log("수강생 정보가 존재하지 않습니다.");
    return res
      .status(401)
      .json({ message: "수강생 정보가 존재하지 않습니다." });
  }
  // 재수강확인
  if (registration_id.course_repetition_status === 1 && grade === "A+") {
    console.log("재수강 학생의 최대 성적은 A입니다.");
    return res
      .status(401)
      .json({ message: "재수강 학생의 최대 성적은 A입니다." });
  }

  const data = {
    assignment_score,
    midterm_exam_score,
    final_exam_score,
    attendance_score,
    attitude_score,
    grade,
    grade_update_date: new Date(),
  };

  const [grade_info] = await model.registration
    .update(data, {
      where: {
        registration_id: registration_id,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (grade_info === 0) {
    console.log("성적 입력이 실패하였습니다.");
    return res.status(401).json({ message: "성적 입력이 실패하였습니다." });
  }
  res.status(201).json({ message: "성적이 입력되었습니다." });
}

module.exports = {
  getAllGradeById,
  getStudentGradeByCourseAssignmentId,
  assignGradeToStudent,
};
