-- 테스트 강의 데이터 추가 (정수형 course_id 사용)
-- 먼저 기존 테스트 데이터가 있다면 삭제 (9001-9020 범위)
DELETE FROM courses WHERE course_id BETWEEN 9001 AND 9020;

-- 테스트 강의 데이터 삽입
INSERT INTO courses (course_id, course_name, credits, professor_id, department_id, semester, year, day_of_week, start_time, end_time, classroom, max_students, current_students, status) VALUES
(9001, '데이터베이스시스템', 3, 'PROF001', 'CS', '1학기', 2024, '월', '09:00', '12:00', 'IT관 101호', 30, 25, '개설'),
(9002, '웹프로그래밍', 3, 'PROF002', 'CS', '1학기', 2024, '화', '13:00', '16:00', 'IT관 102호', 35, 30, '개설'),
(9003, '알고리즘', 3, 'PROF001', 'CS', '1학기', 2024, '수', '09:00', '12:00', 'IT관 103호', 40, 35, '개설'),
(9004, '소프트웨어공학', 3, 'PROF003', 'CS', '1학기', 2024, '목', '14:00', '17:00', 'IT관 104호', 30, 28, '개설'),
(9005, '네트워크보안', 3, 'PROF002', 'CS', '1학기', 2024, '금', '10:00', '13:00', 'IT관 105호', 25, 20, '개설'),
(9006, '인공지능개론', 3, 'PROF004', 'CS', '2학기', 2024, '월', '14:00', '17:00', 'IT관 201호', 35, 32, '개설'),
(9007, '모바일프로그래밍', 3, 'PROF003', 'CS', '2학기', 2024, '화', '09:00', '12:00', 'IT관 202호', 30, 25, '개설'),
(9008, '데이터마이닝', 3, 'PROF004', 'CS', '2학기', 2024, '수', '13:00', '16:00', 'IT관 203호', 25, 22, '개설'),
(9009, '컴퓨터그래픽스', 3, 'PROF001', 'CS', '2학기', 2024, '목', '10:00', '13:00', 'IT관 204호', 30, 27, '개설'),
(9010, '운영체제', 3, 'PROF002', 'CS', '2학기', 2024, '금', '14:00', '17:00', 'IT관 205호', 35, 33, '개설');

-- 테스트 교수 데이터도 추가 (없는 경우)
INSERT INTO users (id, name, email, password, role, department_id) VALUES
('PROF001', '김교수', 'prof1@university.ac.kr', 'password123', 'professor', 'CS'),
('PROF002', '이교수', 'prof2@university.ac.kr', 'password123', 'professor', 'CS'),
('PROF003', '박교수', 'prof3@university.ac.kr', 'password123', 'professor', 'CS'),
('PROF004', '최교수', 'prof4@university.ac.kr', 'password123', 'professor', 'CS')
ON CONFLICT (id) DO NOTHING;

-- 테스트 학과 데이터도 추가 (없는 경우)
INSERT INTO departments (department_id, name) VALUES
('CS', '컴퓨터공학과'),
('EE', '전자공학과'),
('ME', '기계공학과'),
('CE', '토목공학과')
ON CONFLICT (department_id) DO NOTHING;

-- 결과 확인
SELECT 
    c.course_id,
    c.course_name,
    c.credits,
    u.name as professor_name,
    d.name as department_name,
    c.semester,
    c.year,
    c.day_of_week,
    c.start_time,
    c.end_time,
    c.classroom,
    c.current_students || '/' || c.max_students as enrollment,
    c.status
FROM courses c
LEFT JOIN users u ON c.professor_id = u.id
LEFT JOIN departments d ON c.department_id = d.department_id
WHERE c.course_id BETWEEN 9001 AND 9020
ORDER BY c.course_id;
