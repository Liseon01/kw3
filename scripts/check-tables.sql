-- 테이블 존재 여부 확인
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✓ 존재함'
    ELSE '✗ 없음'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'course_materials', 
    'assignments', 
    'course_announcements', 
    'assignment_submissions'
  )
ORDER BY table_name;

-- 각 테이블의 레코드 수 확인
SELECT 'course_materials' as table_name, COUNT(*) as record_count FROM course_materials
UNION ALL
SELECT 'assignments' as table_name, COUNT(*) as record_count FROM assignments  
UNION ALL
SELECT 'course_announcements' as table_name, COUNT(*) as record_count FROM course_announcements
UNION ALL
SELECT 'assignment_submissions' as table_name, COUNT(*) as record_count FROM assignment_submissions;
