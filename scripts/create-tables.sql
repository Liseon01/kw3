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
  status VARCHAR(20) DEFAULT '수강중',
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
('경제학과')
ON CONFLICT (department_id) DO NOTHING;
