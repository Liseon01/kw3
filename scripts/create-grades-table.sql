-- 성적 테이블 생성
CREATE TABLE IF NOT EXISTS grades (
    grade_id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    course_id INTEGER NOT NULL,
    midterm_score DECIMAL(5,2) DEFAULT 0,
    final_score DECIMAL(5,2) DEFAULT 0,
    assignment_score DECIMAL(5,2) DEFAULT 0,
    attendance_score DECIMAL(5,2) DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0,
    letter_grade VARCHAR(2),
    gpa_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- 성적 업데이트 시 자동으로 updated_at 갱신하는 트리거
CREATE OR REPLACE FUNCTION update_grades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION update_grades_updated_at();

-- 성적 계산 함수
CREATE OR REPLACE FUNCTION calculate_grade(
    p_midterm DECIMAL,
    p_final DECIMAL,
    p_assignment DECIMAL,
    p_attendance DECIMAL
) RETURNS TABLE(total_score DECIMAL, letter_grade VARCHAR, gpa_score DECIMAL) AS $$
DECLARE
    v_total DECIMAL;
    v_letter VARCHAR(2);
    v_gpa DECIMAL(3,2);
BEGIN
    -- 총점 계산 (중간고사 30%, 기말고사 40%, 과제 20%, 출석 10%)
    v_total := (p_midterm * 0.3) + (p_final * 0.4) + (p_assignment * 0.2) + (p_attendance * 0.1);
    
    -- 학점 계산
    IF v_total >= 95 THEN
        v_letter := 'A+'; v_gpa := 4.5;
    ELSIF v_total >= 90 THEN
        v_letter := 'A'; v_gpa := 4.0;
    ELSIF v_total >= 85 THEN
        v_letter := 'B+'; v_gpa := 3.5;
    ELSIF v_total >= 80 THEN
        v_letter := 'B'; v_gpa := 3.0;
    ELSIF v_total >= 75 THEN
        v_letter := 'C+'; v_gpa := 2.5;
    ELSIF v_total >= 70 THEN
        v_letter := 'C'; v_gpa := 2.0;
    ELSIF v_total >= 65 THEN
        v_letter := 'D+'; v_gpa := 1.5;
    ELSIF v_total >= 60 THEN
        v_letter := 'D'; v_gpa := 1.0;
    ELSE
        v_letter := 'F'; v_gpa := 0.0;
    END IF;
    
    RETURN QUERY SELECT v_total, v_letter, v_gpa;
END;
$$ LANGUAGE plpgsql;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_course_id ON grades(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_course ON grades(student_id, course_id);
