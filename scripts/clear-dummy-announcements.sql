-- 기존 더미 공지사항 데이터 삭제
DELETE FROM course_announcements;

-- 확인
SELECT COUNT(*) as remaining_announcements FROM course_announcements;

-- 테이블 구조 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'course_announcements'
ORDER BY ordinal_position;
