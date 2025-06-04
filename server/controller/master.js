const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models");
const config = require("../configs/config");

// GET
async function getAllSignUpRequestList(req, res) {
  const is_verified = false;
  try {
    const singup_list = await model.user.findAll({
      where: { is_active_verified: is_verified },
    });
    if (singup_list.length === 0) {
      console.log("회원가입 요청목록이 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "회원가입 요청목록이 존재하지 않습니다." });
    }
    return res.status(200).json(singup_list);
  } catch (err) {
    console.log(err);
    console.log("Server Error");
    return res.status(500).json({ message: "Server Error" });
  }
}

// POST
async function permitStudentSignUpRequest(req, res) {
  const is_verified = false;
  const {
    id_num,
    grade,
    address,
    status,
    zip_code,
    admission_type,
    tuition_status,
    department_id,
    user_id,
  } = req.body; // 여기서부터

  const user_data = {
    id_num,
    is_active_verified: true,
  };

  try {
    const signup_info = await model.user.findOne({
      where: { user_id: user_id, is_active_verified: is_verified },
    });
    if (!signup_info) {
      console.log("해당 회원가입 요청이 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "해당 회원가입 요청이 존재하지 않습니다." });
    }
    if (signup_info.role !== "학생") {
      return res.status(404).json({ message: "학생의 회원요청이 아닙니다." });
    }
    await signup_info.update(user_data);

    const student_data = {
      grade,
      address,
      enrollment_date: new Date(),
      status,
      zip_code,
      admission_type,
      tuition_status,
      department_id,
      user_id: signup_info.user_id,
    };

    await model.student.create(student_data);

    return res
      .status(201)
      .json({ message: "회원가입 요청을 정상적으로 승인하였습니다." });
  } catch (err) {
    console.log(err);
    console.log("Server Error");
    return res.status(500).json({ message: "Server Error" });
  }
}

// POST
async function permitProfessorSignUpRequest(req, res) {
  const is_verified = false;
  const {
    id_num,
    address,
    status,
    zip_code,
    title,
    field,
    department_id,
    user_id,
  } = req.body;

  const user_data = {
    id_num,
    is_active_verified: true,
  };
  try {
    const signup_info = await model.user.findOne({
      where: { user_id: user_id, is_active_verified: is_verified },
    });
    if (!signup_info) {
      console.log("해당 회원가입 요청이 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "해당 회원가입 요청이 존재하지 않습니다." });
    }
    if (signup_info.role !== "교수") {
      return res.status(404).json({ message: "교수의 회원요청이 아닙니다." });
    }

    await signup_info.update(user_data);

    const professor_data = {
      address,
      hire_date: new Date(),
      status,
      zip_code,
      title,
      field,
      department_id,
      user_id: signup_info.user_id,
    };

    await model.professor.create(professor_data);
    return res
      .status(201)
      .json({ message: "회원가입 요청을 정상적으로 승인하였습니다." });
  } catch (err) {
    console.log(err);
    console.log("Server Error");
    return res.status(500).json({ message: "Server Error" });
  }
}

// DELETE
async function deleteSignUpRequest(req, res) {
  const user_id = req.params.id;
  try {
    const signup_info = await model.user.findByPk(user_id);
    if (!signup_info) {
      console.log("해당 회원가입 요청이 존재하지 않습니다.");
      return res
        .status(404)
        .json({ message: "해당 회원가입 요청이 존재하지 않습니다." });
    }

    await model.user.destroy({ where: { user_id: user_id } });
    return res
      .status(201)
      .json({ message: "회원가입 요청을 정상적으로 삭제하였습니다." });
  } catch (err) {
    console.log(err);
    console.log("Server Error");
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllSignUpRequestList,
  permitStudentSignUpRequest,
  permitProfessorSignUpRequest,
  deleteSignUpRequest,
};
