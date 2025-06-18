-- 김치 과목의 현재 상태 확인
SELECT 
  course_id,
  course_code,
  course_name,
  course_type,
  credits,
  department_id
FROM courses 
WHERE course_name LIKE '%김치%' OR course_code = 'CS104';

-- 김치 과목이 전공선택으로 설정되어 있는지 확인
UPDATE courses 
SET course_type = '전공선택'
WHERE course_name = '김치' OR course_code = 'CS104';

-- 성적 데이터와 함께 확인
SELECT 
  g.grade_id,
  g.student_id,
  c.course_name,
  c.course_type,
  c.credits,
  g.total_score,
  g.letter_grade
FROM grades g
JOIN courses c ON g.course_id = c.course_id
WHERE c.course_name = '김치' OR c.course_code = 'CS104';

-- 결과 재확인
SELECT 
  course_name,
  course_type,
  credits,
  CASE 
    WHEN course_type IN ('전공필수', '전공선택') THEN '전공'
    WHEN course_type IN ('교양필수', '교양선택') THEN '교양'
    ELSE '기타'
  END as category
FROM courses 
WHERE course_name = '김치' OR course_code = 'CS104';
