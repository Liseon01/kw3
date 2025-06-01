const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.folder_name || "default";
    const dir = `uploads/${folder}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const folder = req.folder_name || "default";
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${folder}_` + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
