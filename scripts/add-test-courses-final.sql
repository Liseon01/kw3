-- 테스트 강의 데이터 추가 (실제 테이블 구조에 맞춤)
-- 먼저 기존 테스트 데이터가 있다면 삭제 (9001-9020 범위)
DELETE FROM courses WHERE course_id BETWEEN 9001 AND 9020;

-- 테스트 강의 데이터 삽입 (실제 courses 테이블 구조 사용)
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

-- 결과 확인
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
    c.day2,
    c.day2_start_time,
    c.day2_end_time,
    c.course_classroom,
    c.current_enrollments || '/' || c.max_enrollments as enrollment,
    c.course_status
FROM courses c
LEFT JOIN professors p ON c.professor_id = p.professor_id
LEFT JOIN departments d ON c.department_id = d.department_id
WHERE c.course_id BETWEEN 9001 AND 9020
ORDER BY c.course_id;
