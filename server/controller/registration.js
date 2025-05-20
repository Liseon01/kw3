const model = require("../models");
// GET (TEST)
async function getAllRegistrationInfo(req, res) {}
// GET
async function getAllRegistrationInfoById(req, res) {
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

  const registration_info = await model.registration // 리턴값 Object
    .findAll({ where: { student_id: student_info.student_id } })
    .catch((err) => console.log(err));

  if (registrationInfo.length === 0) {
    console.log("수강신청 정보를 찾을 수 없습니다.");
    return res.status(401).json({ message: "수강신청 목록이 없습니다." });
  }

  res.status(200).json(registration_info);
}

// POST
async function courseRegistration(req, res) {
  const course_id = req.body.course_id;
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
  // registration에서 student_id, course_id찾아서 이미 있으면 재수강값 1로 바꾸기
  const data = {
    registration_date: new Date(),
    course_repetition_status: 0,
    student_id: student_info.student_id,
    course_id: course_id,
    semester_id: 1,
  };
  const new_registration_info = await model.registration
    .create(data)
    .catch((err) => console.log(err));

  res.status(201).json(new_registration_info);
}
// DELETE
async function courseDropping(req, res) {}

module.exports = {
  getAllRegistrationInfo,
  getAllRegistrationInfoById,
  courseRegistration,
  courseDropping,
};
