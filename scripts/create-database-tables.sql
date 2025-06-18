-- 학과 테이블
CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 교수 테이블  
CREATE TABLE IF NOT EXISTS professors (
  professor_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 강의 테이블
CREATE TABLE IF NOT EXISTS courses (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  department_id INTEGER REFERENCES departments(department_id),
  professor_id VARCHAR(50) REFERENCES professors(professor_id),
  day1 VARCHAR(10),
  day1_start_time VARCHAR(10),
  day1_end_time VARCHAR(10),
  day2 VARCHAR(10),
  day2_start_time VARCHAR(10),
  day2_end_time VARCHAR(10),
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
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  department_id INTEGER REFERENCES departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 수강신청 테이블
CREATE TABLE IF NOT EXISTS enrollments (
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

-- 회원가입 요청 테이블 (이미 있을 수 있음)
CREATE TABLE IF NOT EXISTS signup_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  social_security_number VARCHAR(20),
  gender VARCHAR(10),
  phone_number VARCHAR(20),
  role VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- 사용자 테이블 (이미 있을 수 있음)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  english_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  student_id VARCHAR(50) UNIQUE,
  phone_number VARCHAR(20),
  mobile_phone VARCHAR(20),
  birthday DATE,
  bank_account VARCHAR(100),
  postal_code VARCHAR(10),
  address1 VARCHAR(255),
  address2 VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
('경제학과')
ON CONFLICT DO NOTHING;

-- 기본 교수 데이터 삽입 (테스트용)
INSERT INTO professors (professor_id, name, email, department_id) VALUES
('prof1', '김교수', 'professor1@kwangwoon.ac.kr', 1),
('prof2', '이교수', 'professor2@kwangwoon.ac.kr', 1),
('prof3', '박교수', 'professor3@kwangwoon.ac.kr', 2)
ON CONFLICT DO NOTHING;

-- 기본 강의 데이터 삽입 (테스트용)
INSERT INTO courses (
  course_code, course_name, credits, department_id, professor_id,
  day1, day1_start_time, day1_end_time, day2, day2_start_time, day2_end_time,
  course_classroom, max_enrollments, current_enrollments, course_status,
  course_establish_date, description, year, semester
) VALUES
('CS101', '컴퓨터과학개론', 3, 1, 'prof1', 
 '월', '09:00:00', '10:50:00', NULL, NULL, NULL,
 '새빛관 101', 30, 25, '개강', 
 '2025-01-01', '컴퓨터과학의 기초 개념과 원리를 학습합니다.', '2025', '1학기'),
('CS201', '자료구조', 3, 1, 'prof1',
 '화', '11:00:00', '12:50:00', '목', '11:00:00', '12:50:00',
 '새빛관 102', 25, 20, '개강',
 '2025-01-01', '다양한 자료구조의 개념과 구현 방법을 학습합니다.', '2025', '1학기'),
('CS301', '알고리즘', 3, 1, 'prof2',
 '수', '13:00:00', '14:50:00', '금', '13:00:00', '14:50:00',
 '새빛관 201', 30, 28, '개강',
 '2025-01-01', '효율적인 알고리즘 설계와 분석 방법을 학습합니다.', '2025', '1학기')
ON CONFLICT DO NOTHING;

-- 기본 학생 데이터 삽입 (테스트용)
INSERT INTO students (student_id, name, email, department_id) VALUES
('2023101001', '김광운', 'student1@kwangwoon.ac.kr', 1),
('2023101002', '이광운', 'student2@kwangwoon.ac.kr', 1),
('2023101003', '박광운', 'student3@kwangwoon.ac.kr', 1)
ON CONFLICT DO NOTHING;
