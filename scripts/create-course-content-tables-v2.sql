-- 기존 테이블이 있다면 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS course_materials CASCADE;
DROP TABLE IF EXISTS course_announcements CASCADE;

-- 강의 자료 테이블
CREATE TABLE course_materials (
  material_id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  file_size VARCHAR(50),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 과제 테이블
CREATE TABLE assignments (
  assignment_id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_score INTEGER DEFAULT 100,
  assignment_type VARCHAR(50) DEFAULT 'homework',
  file_url VARCHAR(500),
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 과제 제출 테이블
CREATE TABLE assignment_submissions (
  submission_id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL,
  student_id VARCHAR(50),
  submission_text TEXT,
  file_url VARCHAR(500),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score INTEGER,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by VARCHAR(50),
  UNIQUE(assignment_id, student_id)
);

-- 공지사항 테이블
CREATE TABLE course_announcements (
  announcement_id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX idx_course_announcements_course_id ON course_announcements(course_id);

-- 테스트 데이터 삽입
INSERT INTO course_materials (course_id, title, description, file_name, file_size, created_by) VALUES
(1, '1주차 강의자료 - 컴퓨터과학 개론', '컴퓨터과학의 기본 개념과 역사', 'week1_intro.pdf', '2.5MB', 'professor-id-1'),
(1, '2주차 강의자료 - 프로그래밍 언어', '다양한 프로그래밍 언어의 특징', 'week2_programming.pdf', '3.2MB', 'professor-id-1'),
(2, '자료구조 1강 - 배열과 리스트', '배열과 연결리스트의 구현과 활용', 'datastructure_ch1.pdf', '4.1MB', 'professor-id-1');

INSERT INTO assignments (course_id, title, description, due_date, max_score, created_by) VALUES
(1, '프로그래밍 기초 과제', 'C언어를 사용하여 간단한 계산기 프로그램을 작성하세요.', '2025-01-20 23:59:00', 100, 'professor-id-1'),
(2, '자료구조 구현 과제', '스택과 큐를 구현하고 테스트 코드를 작성하세요.', '2025-01-25 23:59:00', 100, 'professor-id-1');

INSERT INTO course_announcements (course_id, title, content, is_important, created_by) VALUES
(1, '첫 번째 수업 안내', '다음 주 월요일부터 정규 수업이 시작됩니다. 교재를 미리 준비해주세요.', true, 'professor-id-1'),
(1, '중간고사 일정 공지', '중간고사는 4월 15일에 실시됩니다.', false, 'professor-id-1'),
(2, '실습실 변경 안내', '이번 주 목요일 수업은 새빛관 201호에서 진행됩니다.', false, 'professor-id-1');

SELECT 'Course content tables created successfully!' as message;
