-- 기존 강의 데이터에 강의 유형 임의 할당

-- 먼저 course_type 컬럼이 없다면 추가
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type VARCHAR(20) DEFAULT '전공선택';

-- 컴퓨터공학과, 전자공학과, 소프트웨어학과 강의들을 전공으로 설정
UPDATE courses 
SET course_type = CASE 
  WHEN course_code LIKE 'CS%' OR course_code LIKE 'CE%' OR course_code LIKE 'SW%' THEN '전공필수'
  WHEN department_id IN (1, 2, 3) AND course_code ~ '^[A-Z]{2}[0-9]{3}$' THEN '전공선택'
  ELSE '교양선택'
END
WHERE course_type IS NULL OR course_type = '';

-- 기초 과목들을 교양필수로 설정
UPDATE courses 
SET course_type = '교양필수'
WHERE course_name LIKE '%수학%' 
   OR course_name LIKE '%물리%' 
   OR course_name LIKE '%화학%'
   OR course_name LIKE '%영어%'
   OR course_name LIKE '%국어%'
   OR course_name LIKE '%체육%';

-- 고급 전공 과목들을 전공필수로 설정
UPDATE courses 
SET course_type = '전공필수'
WHERE course_name LIKE '%알고리즘%'
   OR course_name LIKE '%데이터구조%'
   OR course_name LIKE '%운영체제%'
   OR course_name LIKE '%데이터베이스%'
   OR course_name LIKE '%네트워크%'
   OR course_name LIKE '%소프트웨어공학%';

-- 프로그래밍 관련 과목들을 전공선택으로 설정
UPDATE courses 
SET course_type = '전공선택'
WHERE course_name LIKE '%프로그래밍%'
   OR course_name LIKE '%개발%'
   OR course_name LIKE '%시스템%'
   OR course_name LIKE '%웹%'
   OR course_name LIKE '%모바일%';

-- 결과 확인
SELECT 
  course_type,
  COUNT(*) as count,
  STRING_AGG(course_name, ', ' ORDER BY course_name) as sample_courses
FROM courses 
GROUP BY course_type
ORDER BY course_type;

-- 각 학과별 강의 유형 분포 확인
SELECT 
  d.name as department_name,
  c.course_type,
  COUNT(*) as count
FROM courses c
LEFT JOIN departments d ON c.department_id = d.department_id
GROUP BY d.name, c.course_type
ORDER BY d.name, c.course_type;
