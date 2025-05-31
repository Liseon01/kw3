const model = require("../models");
const { Op } = require("sequelize");
// GET (TEST)
async function getAllRegistrationInfo(req, res) {}

// GET 수강신청 내역 확인
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

  if (registration_info.length === 0) {
    console.log("수강신청 정보를 찾을 수 없습니다.");
    return res.status(401).json({ message: "수강신청 목록이 없습니다." });
  }

  res.status(200).json(registration_info);
}

// POST 수강신청 (JOIN 필요)
async function courseRegistration(req, res) {
  const course_id = req.body.course_id;
  const user_id = req.user_id;
  const today = new Date();
  let is_repetition = false; // 재수강인지
  let course_repeition_date = null; // 재수강 날짜

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

  // 현재 학기 가져오기
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

  // 재수강 여부
  const registration_info = await model.registration
    .findAll({
      where: { student_id: student_info.student_id, course_id: course_id },
    })
    .catch((err) => console.log(err));
  if (registration_info.length != 0) {
    for (let i = 0; i < registration_info.length; i++) {
      const semester_id = registration_info[i].semester_id;
      // 같은학기에 2번이상 같은과목을 수강신청 하면 -> 중복신청
      if (current_semester_info.semester_id === semester_id) {
        return res.status(401).json({ message: "이미 수강신청한 과목입니다." });
      }
      // 현재학기와 수강신청하는 학기가 다르면 -> 재수강
      else {
        is_repetition = true;
        course_repeition_date = new Date();
      }
    }
    console.log(
      `user_id: ${user_id} ${student_info.name} 학생 course_id: ${course_id} 재수강 신청 완료`
    );
  }
  // 수강신청 내역이 존재하지 않으면
  else {
    console.log(
      `user_id: ${user_id} ${student_info.name} 학생 course_id: ${course_id} 수강 신청 완료`
    );
  }

  // 수강신청 정보
  const data = {
    registration_date: new Date(),
    course_repetition_status: is_repetition,
    course_repeition_date: course_repeition_date,
    student_id: student_info.student_id,
    course_id: course_id,
    semester_id: current_semester_info.semester_id,
  };
  const new_registration_info = await model.registration
    .create(data)
    .catch((err) => console.log(err));

  res.status(201).json(new_registration_info);
}

// DELETE 수강신청 취소
async function courseDropping(req, res) {
  const user_id = req.user_id;
  const registration_id = req.params.id;
  const student_info = await model.student
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => console.log(err));
  if (!student_info) {
    console.log("학생 정보를 찾지 못하였습니다.");
    return res.status(401).json({ message: "Invalid Access" });
  }
  const delete_registration = await model.registration
    .destroy({
      where: {
        registration_id: registration_id,
        student_id: student_info.student_id,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!delete_registration) {
    console.log("삭제할 수강신청 정보를 찾을 수 없습니다.");
    return res.status(404).json({ message: "Invalid Access" });
  } else {
    return res.status(200).json({ message: "수강신청이 취소되었습니다." });
  }
}

module.exports = {
  getAllRegistrationInfo,
  getAllRegistrationInfoById,
  courseRegistration,
  courseDropping,
};
