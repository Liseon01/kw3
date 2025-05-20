const model = require("../models");
// GET (TEST)
async function getAllRegistrationInfo(req, res) {
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

  const registration = await model.registration // 리턴값 Object
    .findOne({ where: { id_num: id_num } })
    .catch((err) => console.log(err));

  if (!user)
    return res.status(401).json({ message: "Invalid user or password" });

  const isValidPassword = await bcrypt.compare(password, user.password_hashed);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid password" }); // TEST 문구 바꾸기
  }
  const token = createJwtToken(user.user_id);
  res.status(200).json({ token, id_num });
}
// GET
async function getAllRegistrationInfoById(req, res) {}

// POST
async function courseRegistration(req, res) {}
// DELETE
async function courseDropping(req, res) {}

module.exports = {
  getAllRegistrationInfo,
  getAllRegistrationInfoById,
  courseRegistration,
  courseDropping,
};
