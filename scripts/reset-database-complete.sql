-- 모든 테이블을 안전하게 삭제 (외래 키 제약 조건 때문에 순서가 중요)
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 학과 테이블 생성
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 교수 테이블 생성
CREATE TABLE professors (
  professor_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 강의 테이블 생성
CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  department_id INTEGER REFERENCES departments(department_id),
  professor_id VARCHAR(50) REFERENCES professors(professor_id),
  day1 VARCHAR(10),
  day1_start_time TIME,
  day1_end_time TIME,
  day2 VARCHAR(10),
  day2_start_time TIME,
  day2_end_time TIME,
  course_classroom VARCHAR(50),
  max_enrollments INTEGER DEFAULT 30,
  current_enrollments INTEGER DEFAULT 0,
  course_status VARCHAR(20) DEFAULT '개강',
  course_establish_date DATE,
  course_cancel_date DATE,
  description TEXT,
  year VARCHAR(10),
  semester VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 학생 테이블 생성
CREATE TABLE students (
  student_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 수강신청 테이블 생성
CREATE TABLE enrollments (
  enrollment_id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(student_id),
  course_id INTEGER REFERENCES courses(course_id),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  enrollment_status VARCHAR(20) DEFAULT '수강중',
  cancellation_date TIMESTAMP WITH TIME ZONE,
  midterm_score INTEGER,
  final_score INTEGER,
  assignment_score INTEGER,
  attendance_score INTEGER,
  total_score INTEGER,
  grade VARCHAR(5),
  UNIQUE(student_id, course_id)
);

-- 1. 학과 데이터 삽입
INSERT INTO departments (name) VALUES
('컴퓨터공학과'),
('전자공학과'),
('수학과'),
('물리학과'),
('화학과'),
('영어영문학과'),
('경영학과'),
('경제학과');

-- 2. 교수 데이터 삽입 (올바른 이름으로)
INSERT INTO professors (professor_id, name, email, department_id) VALUES
('professor-id-1', '김교수', 'professor1@kwangwoon.ac.kr', 1),
('professor-id-2', '이교수', 'professor2@kwangwoon.ac.kr', 1),
('professor-id-3', '박교수', 'professor3@kwangwoon.ac.kr', 2),
('prof2', '최교수', 'professor4@kwangwoon.ac.kr', 1),
('prof3', '정교수', 'professor5@kwangwoon.ac.kr', 2);

-- 3. 강의 데이터 삽입 (존재하는 교수 ID만 사용)
INSERT INTO courses (
  course_code, course_name, credits, department_id, professor_id,
  day1, day1_start_time, day1_end_time, day2, day2_start_time, day2_end_time,
  course_classroom, max_enrollments, current_enrollments, course_status,
  course_establish_date, description, year, semester
) VALUES
('CS101', '컴퓨터과학개론', 3, 1, 'professor-id-1', 
 '월', '09:00:00', '10:50:00', NULL, NULL, NULL,
 '새빛관 101', 30, 25, '개강', 
 '2025-01-01', '컴퓨터과학의 기초 개념과 원리를 학습합니다.', '2025', '1학기'),
('CS201', '자료구조', 3, 1, 'professor-id-1',
 '화', '11:00:00', '12:50:00', '목', '11:00:00', '12:50:00',
 '새빛관 102', 25, 20, '개강',
 '2025-01-01', '다양한 자료구조의 개념과 구현 방법을 학습합니다.', '2025', '1학기'),
('CS301', '알고리즘', 3, 1, 'professor-id-2',
 '수', '13:00:00', '14:50:00', '금', '13:00:00', '14:50:00',
 '새빛관 201', 30, 28, '개강',
 '2025-01-01', '효율적인 알고리즘 설계와 분석 방법을 학습합니다.', '2025', '1학기'),
('EE101', '전자공학개론', 3, 2, 'professor-id-3',
 '월', '14:00:00', '15:50:00', NULL, NULL, NULL,
 '비마관 101', 30, 15, '개강',
 '2025-01-01', '전자공학의 기초 개념을 학습합니다.', '2025', '1학기'),
('CS123', '자동 생성 교수', 3, 1, 'professor-id-1',
 '월', '15:00:00', '17:00:00', NULL, NULL, NULL,
 '새빛관 101', 30, 0, '개강',
 '2025-01-01', '테스트 강의입니다.', '2025', '1학기');

-- 4. 학생 데이터 삽입
INSERT INTO students (student_id, name, email, department_id) VALUES
('2023101001', '김광운', 'student1@kwangwoon.ac.kr', 1),
('2023101002', '이광운', 'student2@kwangwoon.ac.kr', 1),
('2023101003', '박광운', 'student3@kwangwoon.ac.kr', 1);

-- 데이터 확인
SELECT 'Departments created:' as info, COUNT(*) as count FROM departments
UNION ALL
SELECT 'Professors created:', COUNT(*) FROM professors
UNION ALL
SELECT 'Courses created:', COUNT(*) FROM courses
UNION ALL
SELECT 'Students created:', COUNT(*) FROM students;

-- 교수와 강의 매핑 확인
SELECT 
  c.course_code,
  c.course_name,
  p.name as professor_name,
  d.name as department_name
FROM courses c
JOIN professors p ON c.professor_id = p.professor_id
JOIN departments d ON c.department_id = d.department_id
ORDER BY c.course_code;
