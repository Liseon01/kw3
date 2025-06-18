-- 기존 테스트 강의들의 강의 유형을 다양하게 업데이트

-- 전공필수로 변경 (핵심 전공 과목들)
UPDATE courses SET course_type = '전공필수' 
WHERE course_code IN ('CS301', 'CS303', 'CS405', 'CS101') 
AND course_id BETWEEN 9001 AND 9020;

-- 전공선택으로 유지 (선택적 전공 과목들)
UPDATE courses SET course_type = '전공선택' 
WHERE course_code IN ('CS302', 'CS304', 'CS402', 'CS404') 
AND course_id BETWEEN 9001 AND 9020;

-- 교양필수로 변경 (기초 필수 과목들)
UPDATE courses SET course_type = '교양필수' 
WHERE course_code IN ('CS123', 'EE101') 
AND course_id BETWEEN 9001 AND 9020;

-- 교양선택으로 변경 (교양 선택 과목들)
UPDATE courses SET course_type = '교양선택' 
WHERE course_code IN ('CS444', 'CS104') 
AND course_id BETWEEN 9001 AND 9020;

-- 일반선택으로 변경 (일반 선택 과목들)
UPDATE courses SET course_type = '일반선택' 
WHERE course_code IN ('CS401', 'CS403', 'CS201', 'CS301') 
AND course_id BETWEEN 9001 AND 9020;

-- 추가 강의들도 다양하게 분류
UPDATE courses SET course_type = '전공필수' WHERE course_name = '데이터베이스시스템';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '웹프로그래밍';
UPDATE courses SET course_type = '전공필수' WHERE course_name = '알고리즘';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '소프트웨어공학';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '네트워크보안';
UPDATE courses SET course_type = '전공필수' WHERE course_name = '운영체제';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '인공지능개론';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '모바일프로그래밍';
UPDATE courses SET course_type = '교양선택' WHERE course_name = '데이터마이닝';
UPDATE courses SET course_type = '전공선택' WHERE course_name = '컴퓨터그래픽스';
UPDATE courses SET course_type = '교양필수' WHERE course_name = '자동공학개론';
UPDATE courses SET course_type = '교양선택' WHERE course_name = '김치';
UPDATE courses SET course_type = '일반선택' WHERE course_name = '자유 생성 교수';
UPDATE courses SET course_type = '교양필수' WHERE course_name = '자유구조';
UPDATE courses SET course_type = '일반선택' WHERE course_name = '컴퓨터학개론';

-- 결과 확인 - 강의 유형별 분포 확인
SELECT 
    course_type,
    COUNT(*) as count,
    STRING_AGG(course_name, ', ') as courses
FROM courses 
WHERE course_id BETWEEN 9001 AND 9020 OR course_name IN ('김치', '자동공학개론', '자유 생성 교수', '자유구조', '컴퓨터학개론')
GROUP BY course_type
ORDER BY course_type;

-- 전체 강의 목록 확인
SELECT 
    course_code,
    course_name,
    course_type,
    professor_id,
    year,
    semester
FROM courses 
WHERE course_id BETWEEN 9001 AND 9020 OR course_name IN ('김치', '자동공학개론', '자유 생성 교수', '자유구조', '컴퓨터학개론')
ORDER BY course_type, course_name;
