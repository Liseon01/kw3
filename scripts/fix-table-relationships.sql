-- 외래키 제약조건 추가 (이미 존재할 수 있으므로 IF NOT EXISTS 사용)
DO $$ 
BEGIN
    -- course_announcements 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_announcements_course_id'
    ) THEN
        ALTER TABLE course_announcements 
        ADD CONSTRAINT fk_course_announcements_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(id);
    END IF;

    -- course_materials 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_materials_course_id'
    ) THEN
        ALTER TABLE course_materials 
        ADD CONSTRAINT fk_course_materials_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(id);
    END IF;

    -- assignments 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_assignments_course_id'
    ) THEN
        ALTER TABLE assignments 
        ADD CONSTRAINT fk_assignments_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(id);
    END IF;

    -- courses 테이블의 professor_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_courses_professor_id'
    ) THEN
        ALTER TABLE courses 
        ADD CONSTRAINT fk_courses_professor_id 
        FOREIGN KEY (professor_id) REFERENCES users(id);
    END IF;
END $$;

-- 관계 확인
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('course_announcements', 'course_materials', 'assignments', 'courses')
ORDER BY tc.table_name, tc.constraint_name;
