-- 교수 데이터와 강의 연결 상태 확인
SELECT 
  c.course_id,
  c.course_name,
  c.professor_id,
  u.username,
  u.name as professor_name,
  u.role
FROM courses c
LEFT JOIN users u ON c.professor_id = u.username
WHERE c.professor_id IS NOT NULL
ORDER BY c.course_id;

-- 공지사항과 교수 정보 연결 상태 확인
SELECT 
  ca.announcement_id,
  ca.title,
  ca.course_id,
  c.course_name,
  c.professor_id,
  u.name as professor_name
FROM course_announcements ca
JOIN courses c ON ca.course_id = c.course_id
LEFT JOIN users u ON c.professor_id = u.username
ORDER BY ca.created_at DESC
LIMIT 10;
