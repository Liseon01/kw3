const model = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const deleteUploadedFiles = require("../utiles/deleteUploadedFiles");

// GET 과제 리스트 조회 -> 학생
async function getAllAssignmentListById(req, res) {
  const course_assignment_id = req.params.id;

  const assignment_list = await model.assignment
    .findAll({
      where: { course_assignment_id: course_assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (assignment_list.length === 0) {
    console.log("과제가 존재하지 않습니다.");
    return res.status(401).json({ message: "과제가 존재하지 않습니다." });
  }

  return res.status(200).json(assignment_list);
}

// GET 과제 조회
async function getOneAssignmentById(req, res) {
  const assignment_id = req.params.id;
  const assignment_info = await model.assignment
    .findOne({ where: { assignment_id: assignment_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!assignment_info) {
    console.log("해당 과제가 존재하지 않습니다.");
    return res.status(400).json({ message: "과제가 존재하지 않습니다." });
  }
  const file_info = await model.assignment_file
    .findAll({
      where: { assignment_id: assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (file_info.length === 0) {
    console.log("과제 파일이 존재하지 않습니다.");
    return res.status(200).json(assignment_info);
  }

  const assignment_with_file = {
    assignment_info,
    assignment_file: file_info,
  };
  return res.status(200).json(assignment_with_file);
}

// POST 과제 쓰기 -> 교수
async function makeAssignment(req, res) {
  const {
    title,
    writer_name,
    start_date,
    end_date,
    method,
    content,
    file_format,
    course_assignment_id,
  } = req.body;
  const files = req.files;

  // 과제 데이터 생성
  const data = {
    title,
    writer_name,
    write_date: new Date(),
    start_date,
    end_date,
    method,
    view_count: 0,
    file_format,
    content,
    course_assignment_id,
  };

  // 데이터베이스에 입력
  const new_assignment = await model.assignment.create(data).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });

  // 업로드된 파일이 있다면
  if (files && files.length > 0) {
    const fileData = files.map((file) => ({
      assignment_id: new_assignment.assignment_id,
      file_url: "/uploads/assignments/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));

    // 파일 URL을 데이터베이스에 저장
    await model.assignment_file.bulkCreate(fileData).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res
    .status(201)
    .json({ message: "과제 등록 완료", assignment: new_assignment });
}

// PUT 과제 업데이트 -> 교수
async function updateAssignment(req, res) {
  const assignment_id = req.params.id;
  const {
    title,
    writer_name,
    start_date,
    end_date,
    method,
    content,
    file_format,
    removed_file_ids,
  } = req.body;
  const files = req.files;

  // 과제 존재하는지 확인
  const assignment = await model.assignment
    .findByPk(assignment_id)
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!assignment) {
    deleteUploadedFiles(files, req.folder_name);
    return res.status(404).json({ message: "과제을 찾을 수 없습니다." });
  }

  // 과제 데이터 업데이트
  await assignment.update({
    title,
    writer_name,
    start_date,
    end_date,
    method,
    content,
    file_format,
  });

  // 파일 수정시 파일 삭제
  // removed_file_ids 값이 존재한다면 && removed_file_ids가 배열이라면
  if (removed_file_ids && Array.isArray(JSON.parse(removed_file_ids))) {
    const fileIds = JSON.parse(removed_file_ids);

    // 과제 파일 테이블에서 모든 파일데이터 배열로 가져오기
    const filesToDelete = await model.assignment_file
      .findAll({
        where: { assignment_file_id: fileIds, assignment_id: assignment_id },
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
        "assignments",
        path.basename(file.file_url)
      );
      // 해당경로에 파일이 존재 한다면
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
      }
    }

    // 과제 파일 데이터 삭제
    await model.assignment_file
      .destroy({
        where: { assignment_file_id: fileIds },
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });
  }

  // 입력받은 추가적인 파일이 존재한다면
  if (files && files.length > 0) {
    const existing_files = await model.assignment_file
      .findAll({ where: { assignment_id: assignment_id } })
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
      assignment_id: assignment_id,
      file_url: "/uploads/assignments/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));
    await model.assignment_file.bulkCreate(newFiles).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res.status(200).json({ message: "과제가 수정되었습니다." });
}

// DELETE 과제 삭제 -> 교수
async function deleteAssignment(req, res) {
  const assignment_id = req.params.id;

  // 과제 존재확인
  const assignment = await model.assignment.findByPk(assignment_id);
  if (!assignment) {
    console.log("과제을 찾을 수 없습니다.");
    return res.status(404).json({ message: "과제을 찾을 수 없습니다." });
  }

  // 2. 연결된 파일 데이터 조회
  const assignment_files = await model.assignment_file
    .findAll({
      where: { assignment_id: assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 3. 실제 파일 삭제
  for (const file of assignment_files) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "assignments",
      path.basename(file.file_url)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 물리적 파일 삭제
    }
  }

  // 4. assignment_files 테이블에서 삭제
  await model.assignment_file
    .destroy({ where: { assignment_id: assignment_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 5. assignments 테이블에서 과제 삭제
  await model.assignment
    .destroy({ where: { assignment_id: assignment_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  return res.status(200).json({ message: "과제가 삭제되었습니다." });
}

module.exports = {
  getAllAssignmentListById,
  getOneAssignmentById,
  makeAssignment,
  updateAssignment,
  deleteAssignment,
};
