const model = require("../models");
const { Op } = require("sequelize");

// GET 강의계획서 검색
async function getAllSyllabusInfoList(req, res) {
  // 쿼리받아오기
  // 쿼리에 대한 검색조건 생성
  // syllabus테이블에서 찾기
  // list보내기
}

// GET 강의계획서 조회
async function getSyllabusInfo(req, res) {}

// POST 강의계획서 작성
async function makeSyllabus(req, res) {
  // 이미 작성되어있으면 안됨
}

// PUT 강의계획서 수정
async function updateSyllabus(req, res) {}

// DELETE 강의계획서 삭제
async function deleteSyllabus(req, res) {}

module.exports = {
  getAllSyllabusInfoList,
  getSyllabusInfo,
  makeSyllabus,
  updateSyllabus,
  deleteSyllabus,
};
