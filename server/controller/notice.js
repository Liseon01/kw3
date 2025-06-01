const model = require("../models");
const { Op } = require("sequelize");
const notice = require("../models/notice");
const path = require("path");
const fs = require("fs");

// GET 강의공지사항 리스트 조회 -> 학생
async function getAllNoticeListById(req, res) {
  const course_assignment_id = req.params.id;

  const notice_list = await model.notice
    .findAll({
      where: { course_assignment_id: course_assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (notice_list.length === 0) {
    console.log("공지사항이 존재하지 않습니다.");
    return res.status(401).json({ message: "공지사항이 존재하지 않습니다." });
  }

  return res.status(200).json(notice_list);
}

// GET 강의공지사항 조회
async function getOneNoticeById(req, res) {
  const notice_id = req.params.id;
  const notice_info = await model.notice
    .findOne({ where: { notice_id: notice_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!notice_info) {
    console.log("해당 공지사항이 존재하지 않습니다.");
    return res.status(400).json({ message: "공지사항이 존재하지 않습니다." });
  }
  const file_info = await model.notice_file
    .findAll({
      where: { notice_id: notice_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (file_info.length === 0) {
    console.log("해당 공지사항이 존재하지 않습니다.");
    return res.status(200).json(notice_info);
  }

  const notice_with_file = {
    notice_info,
    notice_file: file_info,
  };
  return res.status(200).json(notice_with_file);
}

// POST 강의공지사항 쓰기 -> 교수
async function makeNotice(req, res) {
  const { title, writer_name, content, course_assignment_id } = req.body;
  const files = req.files;

  // 공지사항 데이터 생성
  const data = {
    title,
    writer_name,
    write_date: new Date(),
    view_count: 0,
    content,
    course_assignment_id,
  };

  // 데이터베이스에 입력
  const new_notice = await model.notice.create(data).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });

  // 업로드된 파일이 있다면
  if (files && files.length > 0) {
    const fileData = files.map((file) => ({
      notice_id: new_notice.notice_id,
      file_url: "/uploads/notices/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));

    // 파일 URL을 데이터베이스에 저장
    await model.notice_file.bulkCreate(fileData).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res
    .status(201)
    .json({ message: "공지사항 등록 완료", notice: new_notice });
}

// POST 강의공지사항 업데이트 -> 교수
async function updateNotice(req, res) {
  const notice_id = req.params.id;
  const { title, writer_name, content, removed_file_ids } = req.body;
  const files = req.files;

  // 공지사항 존재하는지 확인
  const notice = await model.notice.findByPk(notice_id).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });
  if (!notice)
    return res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });

  // 공지사항 데이터 업데이트
  await notice.update({ title, writer_name, content });

  // 파일 수정시 파일 삭제
  // removed_file_ids 값이 존재한다면 && removed_file_ids가 배열이라면
  if (removed_file_ids && Array.isArray(JSON.parse(removed_file_ids))) {
    const fileIds = JSON.parse(removed_file_ids);

    // 공지사항 파일 테이블에서 모든 파일데이터 배열로 가져오기
    const filesToDelete = await model.notice_file
      .findAll({
        where: { notice_file_id: fileIds, notice_id: notice_id },
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });

    // 파일베열 데이터 하나씩 돌면서 파일 삭제
    for (const file of filesToDelete) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "notices",
        path.basename(file.file_url)
      );
      // 해당경로에 파일이 존재 한다면
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
      }
    }

    // 공지사항 파일 데이터 삭제
    await model.notice_file
      .destroy({
        where: { notice_file_id: fileIds },
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });
  }

  // 입력받은 추가적인 파일이 존재한다면
  if (files && files.length > 0) {
    const existing_files = await model.notice_file
      .findAll({ where: { notice_id: notice_id } })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });

    // 데이터베이스에 추가할 파일의 개수 확인
    const total_file_count = existing_files.length + files.length;

    if (total_file_count > 5) {
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
      console.log("데이터베이스에 저장할 파일의 개수가 5개를 초과합니다.");
      return res
        .status(400)
        .json({ message: "파일은 최대 5개까지 등록할 수 있습니다." });
    }

    const newFiles = files.map((file) => ({
      notice_id: notice_id,
      file_url: "/uploads/notices/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));
    await model.notice_file.bulkCreate(newFiles).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res.status(200).json({ message: "공지사항이 수정되었습니다." });
}

// DELETE 강의공지사항 삭제 -> 교수
async function deleteNotice(req, res) {
  const notice_id = req.params.id;

  // 공지사항 존재확인
  const notice = await model.notice.findByPk(notice_id);
  if (!notice) {
    console.log("공지사항을 찾을 수 없습니다.");
    return res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });
  }

  // 2. 연결된 파일 데이터 조회
  const notice_files = await model.notice_file
    .findAll({
      where: { notice_id: notice_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 3. 실제 파일 삭제
  for (const file of notice_files) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "notices",
      path.basename(file.file_url)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 물리적 파일 삭제
    }
  }

  // 4. notice_files 테이블에서 삭제
  await model.notice_file
    .destroy({ where: { notice_id: notice_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 5. notices 테이블에서 공지사항 삭제
  await model.notice
    .destroy({ where: { notice_id: notice_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  return res.status(200).json({ message: "공지사항이 삭제되었습니다." });
}

module.exports = {
  getAllNoticeListById,
  getOneNoticeById,
  makeNotice,
  updateNotice,
  deleteNotice,
};
