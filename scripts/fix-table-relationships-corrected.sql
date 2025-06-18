-- 먼저 테이블 구조 확인
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('courses', 'course_announcements', 'course_materials', 'assignments', 'users', 'professors')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 외래키 제약조건 추가 (올바른 컬럼명 사용)
DO $$ 
BEGIN
    -- course_announcements 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_announcements_course_id'
    ) THEN
        ALTER TABLE course_announcements 
        ADD CONSTRAINT fk_course_announcements_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(course_id);
    END IF;

    -- course_materials 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_materials_course_id'
    ) THEN
        ALTER TABLE course_materials 
        ADD CONSTRAINT fk_course_materials_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(course_id);
    END IF;

    -- assignments 테이블의 course_id에 외래키 제약조건 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_assignments_course_id'
    ) THEN
        ALTER TABLE assignments 
        ADD CONSTRAINT fk_assignments_course_id 
        FOREIGN KEY (course_id) REFERENCES courses(course_id);
    END IF;

    -- courses 테이블의 professor_id에 외래키 제약조건 추가 (professors 테이블이 있는 경우)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'professors') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_courses_professor_id'
        ) THEN
            ALTER TABLE courses 
            ADD CONSTRAINT fk_courses_professor_id 
            FOREIGN KEY (professor_id) REFERENCES professors(professor_id);
        END IF;
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

SELECT 'Table relationships fixed successfully!' as message;
