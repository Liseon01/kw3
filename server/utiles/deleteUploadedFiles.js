const fs = require("fs");
const path = require("path");

function deleteUploadedFilesInNotice(files) {
  if (!files || files.length === 0) return;

  for (const file of files) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "notices",
      file.filename
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = deleteUploadedFilesInNotice;
