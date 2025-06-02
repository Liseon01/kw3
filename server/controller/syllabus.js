const model = require("../models");
const { Op } = require("sequelize");

// GET 강의계획서 조회
async function getSyllabusInfo(req, res) {
  const course_assignment_id = req.params.id;
  const syllabus_info = await model.syllabus
    .findOne({ where: { course_assignment_id: course_assignment_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (!syllabus_info) {
    console.log("해당 강의계획서가 존재하지 않습니다.");
    return res.status(400).json({ message: "강의계획서가 존재하지 않습니다." });
  }

  return res.status(200).json(syllabus_info);
}

// POST 강의계획서 작성
async function makeSyllabus(req, res) {
  const {
    course_language,
    require_textbook,
    course_purpose,
    online_ratio,
    attendance_ratio,
    midterm_exam_ratio,
    final_exam_ratio,
    assignment_ratio,
    quiz_ratio,
    attitude_ratio,
    course_plan,
    course_assignment_id,
    semester_id,
  } = req.body;

  try {
    const is_exist = await model.syllabus.findOne({
      where: { course_assignment_id: course_assignment_id },
    });

    if (is_exist) {
      console.log("강의계획서가 이미 존재합니다.");
      return res.status(401).json({ message: "강의계획서가 이미 존재합니다." });
    }

    const data = {
      course_language,
      require_textbook,
      course_purpose,
      online_ratio,
      attendance_ratio,
      midterm_exam_ratio,
      final_exam_ratio,
      assignment_ratio,
      quiz_ratio,
      attitude_ratio,
      course_plan,
      course_assignment_id,
      semester_id,
    };

    const new_syllabus = await model.syllabus.create(data);

    return res
      .status(201)
      .json({ message: "강의계획서 등록 완료", syllabus: new_syllabus });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}

// PUT 강의계획서 수정
async function updateSyllabus(req, res) {
  const syllabus_id = req.params.id;
  const {
    course_language,
    require_textbook,
    course_purpose,
    online_ratio,
    attendance_ratio,
    midterm_exam_ratio,
    final_exam_ratio,
    assignment_ratio,
    quiz_ratio,
    attitude_ratio,
    course_plan,
    semester_id,
  } = req.body;

  const data = {
    course_language,
    require_textbook,
    course_purpose,
    online_ratio,
    attendance_ratio,
    midterm_exam_ratio,
    final_exam_ratio,
    assignment_ratio,
    quiz_ratio,
    attitude_ratio,
    course_plan,
    semester_id,
  };
  try {
    const syllabus = await model.syllabus.findByPk(syllabus_id);
    if (!syllabus) {
      console.log("강의계획서가 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "강의계획서가 존재하지 않습니다." });
    }

    // 강의계획서 업데이트
    await syllabus.update(data);
    return res.status(200).json({ message: "강의계획서가 수정되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}

// DELETE 강의계획서 삭제
async function deleteSyllabus(req, res) {
  const syllabus_id = req.params.id;

  try {
    // 강의계획서 존재확인
    const syllabus = await model.syllabus.findByPk(syllabus_id);
    if (!syllabus) {
      console.log("강의계획서가 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "강의계획서가 존재하지 않습니다." });
    }
    await model.syllabus.destroy({ where: { syllabus_id: syllabus_id } });

    return res.status(200).json({ message: "강의계획서가 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getSyllabusInfo,
  makeSyllabus,
  updateSyllabus,
  deleteSyllabus,
};
