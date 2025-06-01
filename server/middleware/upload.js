const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/notices/";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "uploads/notices/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "notice_" + uniqueSuffix + ext);
  },
});

const upload_notice = multer({ storage });

module.exports = upload_notice;
