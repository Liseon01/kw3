const model = require("../models");
const { Op } = require("sequelize");
const document = require("../models/document");
const path = require("path");
const fs = require("fs");
const deleteUploadedFiles = require("../utiles/deleteUploadedFiles");

// GET 강의자료 리스트 조회 -> 학생
async function getAllDocumentListById(req, res) {
  const course_assignment_id = req.params.id;

  const document_list = await model.document
    .findAll({
      where: { course_assignment_id: course_assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (document_list.length === 0) {
    console.log("강의자료가 존재하지 않습니다.");
    return res.status(401).json({ message: "강의자료가 존재하지 않습니다." });
  }

  return res.status(200).json(document_list);
}

// GET 강의자료 조회
async function getOneDocumentById(req, res) {
  const document_id = req.params.id;
  const document_info = await model.document
    .findOne({ where: { document_id: document_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!document_info) {
    console.log("해당 강의자료가 존재하지 않습니다.");
    return res.status(400).json({ message: "강의자료가 존재하지 않습니다." });
  }
  const file_info = await model.document_file
    .findAll({
      where: { document_id: document_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (file_info.length === 0) {
    console.log("해당 강의자료가 존재하지 않습니다.");
    return res.status(200).json(document_info);
  }

  const document_with_file = {
    document_info,
    document_file: file_info,
  };
  return res.status(200).json(document_with_file);
}

// POST 강의자료 쓰기 -> 교수
async function makeDocument(req, res) {
  const { title, writer_name, content, course_assignment_id } = req.body;
  const files = req.files;

  // 강의자료 데이터 생성
  const data = {
    title,
    writer_name,
    write_date: new Date(),
    view_count: 0,
    content,
    course_assignment_id,
  };

  // 데이터베이스에 입력
  const new_document = await model.document.create(data).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });

  // 업로드된 파일이 있다면
  if (files && files.length > 0) {
    const fileData = files.map((file) => ({
      document_id: new_document.document_id,
      file_url: "/uploads/documents/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));

    // 파일 URL을 데이터베이스에 저장
    await model.document_file.bulkCreate(fileData).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res
    .status(201)
    .json({ message: "강의자료 등록 완료", document: new_document });
}

// POST 강의자료 업데이트 -> 교수
async function updateDocument(req, res) {
  const document_id = req.params.id;
  const { title, writer_name, content, removed_file_ids } = req.body;
  const files = req.files;

  // 강의자료 존재하는지 확인
  const document = await model.document.findByPk(document_id).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });
  if (!document) {
    deleteUploadedFiles(files, req.folder_name);
    return res.status(404).json({ message: "강의자료를 찾을 수 없습니다." });
  }

  // 강의자료 데이터 업데이트
  await document.update({ title, writer_name, content });

  // 파일 수정시 파일 삭제
  // removed_file_ids 값이 존재한다면 && removed_file_ids가 배열이라면
  if (removed_file_ids && Array.isArray(JSON.parse(removed_file_ids))) {
    const fileIds = JSON.parse(removed_file_ids);

    // 강의자료 파일 테이블에서 모든 파일데이터 배열로 가져오기
    const filesToDelete = await model.document_file
      .findAll({
        where: { document_file_id: fileIds, document_id: document_id },
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
        "documents",
        path.basename(file.file_url)
      );
      // 해당경로에 파일이 존재 한다면
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
      }
    }

    // 강의자료 파일 데이터 삭제
    await model.document_file
      .destroy({
        where: { document_file_id: fileIds },
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });
  }

  // 입력받은 추가적인 파일이 존재한다면
  if (files && files.length > 0) {
    const existing_files = await model.document_file
      .findAll({ where: { document_id: document_id } })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });

    // 데이터베이스에 추가할 파일의 개수 확인
    const total_file_count = existing_files.length + files.length;

    if (total_file_count > 5) {
      deleteUploadedFiles(files, req.folder_name);
      console.log("데이터베이스에 저장할 파일의 개수가 5개를 초과합니다.");
      return res
        .status(400)
        .json({ message: "파일은 최대 5개까지 등록할 수 있습니다." });
    }

    const newFiles = files.map((file) => ({
      document_id: document_id,
      file_url: "/uploads/documents/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));
    await model.document_file.bulkCreate(newFiles).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res.status(200).json({ message: "강의자료가 수정되었습니다." });
}

// DELETE 강의자료 삭제 -> 교수
async function deleteDocument(req, res) {
  const document_id = req.params.id;

  // 강의자료 존재확인
  const document = await model.document.findByPk(document_id);
  if (!document) {
    console.log("강의자료를 찾을 수 없습니다.");
    return res.status(404).json({ message: "강의자료를 찾을 수 없습니다." });
  }

  // 2. 연결된 파일 데이터 조회
  const document_files = await model.document_file
    .findAll({
      where: { document_id: document_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 3. 실제 파일 삭제
  for (const file of document_files) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "documents",
      path.basename(file.file_url)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 물리적 파일 삭제
    }
  }

  // 4. document_files 테이블에서 삭제
  await model.document_file
    .destroy({ where: { document_id: document_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 5. documents 테이블에서 강의자료 삭제
  await model.document
    .destroy({ where: { document_id: document_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  return res.status(200).json({ message: "강의자료가 삭제되었습니다." });
}

module.exports = {
  getAllDocumentListById,
  getOneDocumentById,
  makeDocument,
  updateDocument,
  deleteDocument,
};
