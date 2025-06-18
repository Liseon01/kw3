-- 기존 테이블 삭제 후 재생성 (데이터가 있다면 주의!)
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 학과 테이블
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 교수 테이블  
CREATE TABLE professors (
  professor_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 강의 테이블
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

-- 학생 테이블
CREATE TABLE students (
  student_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 수강신청 테이블
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

-- 기본 학과 데이터 삽입
INSERT INTO departments (name) VALUES
('컴퓨터공학과'),
('전자공학과'),
('수학과'),
('물리학과'),
('화학과'),
('영어영문학과'),
('경영학과'),
('경제학과');

-- 기본 교수 데이터 삽입 (테스트용)
INSERT INTO professors (professor_id, name, email, department_id) VALUES
('professor-id-1', '김교수', 'professor1@kwangwoon.ac.kr', 1),
('prof2', '이교수', 'professor2@kwangwoon.ac.kr', 1),
('prof3', '박교수', 'professor3@kwangwoon.ac.kr', 2);

-- 기본 학생 데이터 삽입 (테스트용)
INSERT INTO students (student_id, name, email, department_id) VALUES
('2023101001', '김광운', 'student1@kwangwoon.ac.kr', 1),
('2023101002', '이광운', 'student2@kwangwoon.ac.kr', 1),
('2023101003', '박광운', 'student3@kwangwoon.ac.kr', 1);

-- 테스트용 강의 데이터 삽입
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
 '2025-01-01', '다양한 자료구조의 개념과 구현 방법을 학습합니다.', '2025', '1학기');
