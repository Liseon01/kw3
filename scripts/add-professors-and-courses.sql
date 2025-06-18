-- 교수와 강의 데이터를 함께 추가하는 스크립트

-- 1. 먼저 필요한 교수 데이터가 있는지 확인하고 없으면 추가
INSERT INTO professors (professor_id, name, email, department_id) VALUES
('prof1', '김교수', 'kim.professor@kwangwoon.ac.kr', 1),
('prof2', '이교수', 'lee.professor@kwangwoon.ac.kr', 1),
('prof3', '박교수', 'park.professor@kwangwoon.ac.kr', 1)
ON CONFLICT (professor_id) DO NOTHING;

-- 2. 기존 테스트 강의 데이터 삭제 (9001-9020 범위)
DELETE FROM courses WHERE course_id BETWEEN 9001 AND 9020;

-- 3. 테스트 강의 데이터 삽입
INSERT INTO courses (
    course_id, course_code, course_name, credits, department_id, professor_id,
    day1, day1_start_time, day1_end_time, day2, day2_start_time, day2_end_time,
    course_classroom, max_enrollments, current_enrollments, course_status,
    course_establish_date, description, year, semester
) VALUES
(9001, 'CS301', '데이터베이스시스템', 3, 1, 'prof1', 
 '월', '09:00:00', '10:50:00', '수', '09:00:00', '10:50:00',
 'IT관 101호', 30, 25, '개강', 
 '2024-03-01', '데이터베이스의 기본 개념과 설계 방법을 학습합니다.', '2024', '1학기'),

(9002, 'CS302', '웹프로그래밍', 3, 1, 'prof2',
 '화', '13:00:00', '14:50:00', '목', '13:00:00', '14:50:00',
 'IT관 102호', 35, 30, '개강',
 '2024-03-01', 'HTML, CSS, JavaScript를 활용한 웹 개발을 학습합니다.', '2024', '1학기'),

(9003, 'CS303', '알고리즘', 3, 1, 'prof1',
 '수', '11:00:00', '12:50:00', '금', '11:00:00', '12:50:00',
 'IT관 103호', 40, 35, '개강',
 '2024-03-01', '효율적인 알고리즘 설계와 분석 방법을 학습합니다.', '2024', '1학기'),

(9004, 'CS304', '소프트웨어공학', 3, 1, 'prof3',
 '목', '14:00:00', '15:50:00', NULL, NULL, NULL,
 'IT관 104호', 30, 28, '개강',
 '2024-03-01', '소프트웨어 개발 생명주기와 프로젝트 관리를 학습합니다.', '2024', '1학기'),

(9005, 'CS305', '네트워크보안', 3, 1, 'prof2',
 '금', '10:00:00', '11:50:00', NULL, NULL, NULL,
 'IT관 105호', 25, 20, '개강',
 '2024-03-01', '네트워크 보안의 기본 원리와 실습을 진행합니다.', '2024', '1학기'),

(9006, 'CS401', '인공지능개론', 3, 1, 'prof3',
 '월', '14:00:00', '15:50:00', '수', '14:00:00', '15:50:00',
 'IT관 201호', 35, 32, '개강',
 '2024-09-01', '인공지능의 기본 개념과 머신러닝을 학습합니다.', '2024', '2학기'),

(9007, 'CS402', '모바일프로그래밍', 3, 1, 'prof1',
 '화', '09:00:00', '10:50:00', '목', '09:00:00', '10:50:00',
 'IT관 202호', 30, 25, '개강',
 '2024-09-01', 'Android와 iOS 앱 개발 방법을 학습합니다.', '2024', '2학기'),

(9008, 'CS403', '데이터마이닝', 3, 1, 'prof2',
 '수', '13:00:00', '14:50:00', '금', '13:00:00', '14:50:00',
 'IT관 203호', 25, 22, '개강',
 '2024-09-01', '빅데이터 분석과 패턴 인식 기법을 학습합니다.', '2024', '2학기'),

(9009, 'CS404', '컴퓨터그래픽스', 3, 1, 'prof3',
 '목', '10:00:00', '11:50:00', NULL, NULL, NULL,
 'IT관 204호', 30, 27, '개강',
 '2024-09-01', '2D/3D 그래픽스 프로그래밍을 학습합니다.', '2024', '2학기'),

(9010, 'CS405', '운영체제', 3, 1, 'prof1',
 '금', '14:00:00', '15:50:00', NULL, NULL, NULL,
 'IT관 205호', 35, 33, '개강',
 '2024-09-01', '운영체제의 구조와 동작 원리를 학습합니다.', '2024', '2학기');

-- 4. 결과 확인 - 교수 정보
SELECT 'Professors:' as info;
SELECT professor_id, name, email, department_id FROM professors WHERE professor_id IN ('prof1', 'prof2', 'prof3');

-- 5. 결과 확인 - 추가된 강의 목록
SELECT 'Test Courses:' as info;
SELECT 
    c.course_id,
    c.course_code,
    c.course_name,
    c.credits,
    p.name as professor_name,
    d.name as department_name,
    c.semester,
    c.year,
    c.day1,
    c.day1_start_time,
    c.day1_end_time,
    CASE 
        WHEN c.day2 IS NOT NULL THEN c.day2 || ' ' || c.day2_start_time || '-' || c.day2_end_time
        ELSE ''
    END as day2_schedule,
    c.course_classroom,
    c.current_enrollments || '/' || c.max_enrollments as enrollment,
    c.course_status
FROM courses c
LEFT JOIN professors p ON c.professor_id = p.professor_id
LEFT JOIN departments d ON c.department_id = d.department_id
WHERE c.course_id BETWEEN 9001 AND 9020
ORDER BY c.course_id;
