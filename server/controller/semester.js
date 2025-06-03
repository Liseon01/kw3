const model = require("../models");
const { Op } = require("sequelize");

async function getALLSemesterInfo(req, res, next) {
  const semester_info = await model.semester.findAll().catch((err) => {
    console.log(err);
    console.log("학기 정보를 찾는데 오류가 발생하였습니다.");
    return res.status(401).json({ message: "Server Error" });
  });
  if (semester_info.length == 0) {
    console.log("학기 정보가 비어있습니다.");
    return res.status(401).json({ message: "학기 정보를 찾을 수 없습니다." });
  }

  return res.status(200).json(semester_info);
}

module.exports = { getALLSemesterInfo };
