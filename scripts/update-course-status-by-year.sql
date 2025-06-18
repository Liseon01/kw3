-- 2025년 과목은 개설 상태로 유지
UPDATE courses 
SET course_status = 'active'
WHERE year = '2025';

-- 2024년 과목은 폐강 상태로 변경
UPDATE courses 
SET course_status = 'closed'
WHERE year = '2024';

-- 2023년 이전 과목도 폐강 상태로 변경
UPDATE courses 
SET course_status = 'closed'
WHERE year < '2024';

-- 업데이트 결과 확인
SELECT year, course_status, COUNT(*) as count
FROM courses 
GROUP BY year, course_status
ORDER BY year DESC, course_status;
