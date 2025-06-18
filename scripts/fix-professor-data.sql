-- 교수 데이터 확인 및 수정
UPDATE courses 
SET professor_id = 'professor1' 
WHERE course_name = '안녕하세요' AND professor_id IS NULL;

-- 교수 사용자가 존재하는지 확인
INSERT INTO users (username, password, name, role, student_id) 
VALUES ('professor1', 'prof123', '김교수', 'professor', 'PROF001')
ON CONFLICT (username) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- 데이터 확인
SELECT 
  ca.title,
  c.course_name,
  c.professor_id,
  u.name as professor_name
FROM course_announcements ca
JOIN courses c ON ca.course_id = c.course_id
LEFT JOIN users u ON c.professor_id = u.username
WHERE ca.title = '안녕하세요';
