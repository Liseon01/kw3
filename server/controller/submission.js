const model = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const deleteUploadedFiles = require("../utiles/deleteUploadedFiles");

// GET 과제제출 리스트 조회 -> 교수
async function getAllSubmissionListByIdForProfessor(req, res) {
  const assignment_id = req.params.id;

  const submission_list = await model.submission
    .findAll({
      where: { assignment_id: assignment_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (submission_list.length === 0) {
    console.log("과제제출 목록이 존재하지 않습니다.");
    return res
      .status(401)
      .json({ message: "과제제출 목록이 존재하지 않습니다." });
  }

  return res.status(200).json(submission_list);
}

// GET 과제제출 리스트 조회 -> 학생
async function getAllSubmissionListByIdForStudent(req, res) {
  const assignment_id = req.params.id;
  const student_id = req.student_id;

  const submission_list = await model.submission
    .findAll({
      where: { assignment_id: assignment_id, student_id: student_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  if (submission_list.length === 0) {
    console.log("과제제출 목록이 존재하지 않습니다.");
    return res
      .status(401)
      .json({ message: "과제제출 목록이 존재하지 않습니다." });
  }

  return res.status(200).json(submission_list);
}

// GET 과제제출 조회 -> 학생 -> 본인것만
async function getOneSubmissionByIdForStudent(req, res) {
  const submission_id = req.params.id;
  const student_id = req.student_id;
  const submission_info = await model.submission
    .findOne({
      where: { submission_id: submission_id, student_id: student_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!submission_info) {
    console.log("해당 과제제출 내역이 존재하지 않습니다.");
    return res
      .status(400)
      .json({ message: "해당 과제제출 내역이 존재하지 않습니다." });
  }
  const file_info = await model.submission_file
    .findAll({
      where: { submission_id: submission_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (file_info.length === 0) {
    console.log("과제제출 파일이 존재하지 않습니다.");
    return res.status(200).json(submission_info);
  }

  const submission_with_file = {
    submission_info,
    submission_file: file_info,
  };
  return res.status(200).json(submission_with_file);
}

// GET 과제제출 조회 -> 교수 -> 모두조회가능
async function getOneSubmissionByIdForProfessor(req, res) {
  const submission_id = req.params.id;
  const submission_info = await model.submission
    .findOne({ where: { submission_id: submission_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!submission_info) {
    console.log("해당 과제제출 내역이 존재하지 않습니다.");
    return res
      .status(400)
      .json({ message: "해당 과제제출 내역이 존재하지 않습니다." });
  }
  const file_info = await model.submission_file
    .findAll({
      where: { submission_id: submission_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (file_info.length === 0) {
    console.log("과제제출 파일이 존재하지 않습니다.");
    return res.status(200).json(submission_info);
  }

  const submission_with_file = {
    submission_info,
    submission_file: file_info,
  };
  return res.status(200).json(submission_with_file);
}

// POST 과제제출 쓰기 -> 학생
async function makeSubmission(req, res) {
  const student_id = req.student_id;
  const { title, content, assignment_id } = req.body;
  const files = req.files;

  const is_exist = await model.submission
    .findOne({
      where: { assignment_id: assignment_id, student_id, student_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (is_exist) {
    deleteUploadedFiles(files, req.folder_name);
    return res.status(404).json({ message: "이미 과제를 제출하였습니다." });
  }

  // 과제제출 데이터 생성
  const data = {
    title,
    content,
    submission_date: new Date(),
    assignment_score: 0,
    submission_status: 1,
    student_id,
    assignment_id,
  };

  // 데이터베이스에 입력
  const new_submission = await model.submission.create(data).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });

  // 업로드된 파일이 있다면
  if (files && files.length > 0) {
    const fileData = files.map((file) => ({
      submission_id: new_submission.submission_id,
      file_url: "/uploads/submissions/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));

    // 파일 URL을 데이터베이스에 저장
    await model.submission_file.bulkCreate(fileData).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res
    .status(201)
    .json({ message: "과제제출 완료", submission: new_submission });
}

// PUT 과제 점수 부여 -> 교수
async function assignSubmissionGrade(req, res) {
  const { assignment_score } = req.body;
  const submission_id = req.params.id;

  // 과제제출 존재하는지 확인
  const submission = await model.submission
    .findOne({
      where: { submission_id: submission_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!submission) {
    return res
      .status(404)
      .json({ message: "과제제출 내역을 찾을 수 없습니다." });
  }

  // 데이터베이스에 입력
  await submission.update({ assignment_score }).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  });

  return res.status(201).json({ message: "과제 점수 부여 완료" });
}

// PUT 과제제출 업데이트 -> 학생
async function updateSubmission(req, res) {
  const submission_id = req.params.id;
  const student_id = req.student_id;
  const { title, content, removed_file_ids } = req.body;
  const files = req.files;

  // 과제제출 존재하는지 확인
  const submission = await model.submission
    .findOne({
      where: { submission_id: submission_id, student_id: student_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  if (!submission) {
    deleteUploadedFiles(files, req.folder_name);
    return res
      .status(404)
      .json({ message: "과제제출 내역을 찾을 수 없습니다." });
  }
  const data = {
    title,
    content,
    submission_date: new Date(),
  };

  // 과제제출 데이터 업데이트
  await submission.update(data);

  // 파일 수정시 파일 삭제
  // removed_file_ids 값이 존재한다면 && removed_file_ids가 배열이라면
  if (removed_file_ids && Array.isArray(JSON.parse(removed_file_ids))) {
    const fileIds = JSON.parse(removed_file_ids);

    // 과제제출 파일 테이블에서 모든 파일데이터 배열로 가져오기
    const filesToDelete = await model.submission_file
      .findAll({
        where: { submission_file_id: fileIds, submission_id: submission_id },
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
        "submissions",
        path.basename(file.file_url)
      );
      // 해당경로에 파일이 존재 한다면
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
      }
    }

    // 과제제출 파일 데이터 삭제
    await model.submission_file
      .destroy({
        where: { submission_file_id: fileIds },
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      });
  }

  // 입력받은 추가적인 파일이 존재한다면
  if (files && files.length > 0) {
    const existing_files = await model.submission_file
      .findAll({ where: { submission_id: submission_id } })
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
      submission_id: submission_id,
      file_url: "/uploads/submissions/" + file.filename,
      original_name: file.originalname,
      uploaded_at: new Date(),
    }));
    await model.submission_file.bulkCreate(newFiles).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });
  }

  return res.status(200).json({ message: "과제제출 내역이 수정되었습니다." });
}

// DELETE 과제제출 삭제 -> 학생
async function deleteSubmission(req, res) {
  const submission_id = req.params.id;
  const student_id = req.student_id;

  // 과제제출 존재확인
  const submission = await model.submission.findOne({
    where: { submission_id: submission_id, student_id: student_id },
  });
  if (!submission) {
    console.log("과제제출 내역을 찾을 수 없습니다.");
    return res
      .status(404)
      .json({ message: "과제제출 내역을 찾을 수 없습니다." });
  }

  // 2. 연결된 파일 데이터 조회
  const submission_files = await model.submission_file
    .findAll({
      where: { submission_id: submission_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 3. 실제 파일 삭제
  for (const file of submission_files) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "submissions",
      path.basename(file.file_url)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 물리적 파일 삭제
    }
  }

  // 4. submission_files 테이블에서 삭제
  await model.submission_file
    .destroy({ where: { submission_id: submission_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  // 5. submissions 테이블에서 과제제출 삭제
  await model.submission
    .destroy({ where: { submission_id: submission_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    });

  return res.status(200).json({ message: "과제제출 내역이 삭제되었습니다." });
}

module.exports = {
  getAllSubmissionListByIdForProfessor,
  getAllSubmissionListByIdForStudent,
  getOneSubmissionByIdForProfessor,
  getOneSubmissionByIdForStudent,
  makeSubmission,
  assignSubmissionGrade,
  updateSubmission,
  deleteSubmission,
};
