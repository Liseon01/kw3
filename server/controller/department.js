const model = require("../models");
const { Op } = require("sequelize");

async function getALLDepartmentInfo(req, res, next) {
  const department_info = await model.department.findAll().catch((err) => {
    console.log(err);
    console.log("학부 정보를 찾는데 오류가 발생하였습니다.");
    return res.status(401).json({ message: "Server Error" });
  });
  if (department_info.length == 0) {
    console.log("학부 정보가 비어있습니다.");
    return res.status(401).json({ message: "학부 정보를 찾을 수 없습니다." });
  }

  return res.status(200).json(department_info);
}

module.exports = { getALLDepartmentInfo };
