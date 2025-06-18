-- 대시보드 공지사항 조회 함수 생성
CREATE OR REPLACE FUNCTION get_dashboard_announcements()
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    content TEXT,
    is_important BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    course_id INTEGER,
    courses JSON
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ca.id,
        ca.title,
        ca.content,
        ca.is_important,
        ca.created_at,
        ca.course_id,
        json_build_object(
            'course_name', c.course_name,
            'professor_id', c.professor_id,
            'users', json_build_object(
                'name', u.name
            )
        ) as courses
    FROM course_announcements ca
    LEFT JOIN courses c ON ca.course_id = c.id
    LEFT JOIN users u ON c.professor_id = u.id
    ORDER BY ca.created_at DESC
    LIMIT 5;
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_dashboard_announcements() TO anon;
GRANT EXECUTE ON FUNCTION get_dashboard_announcements() TO authenticated;

-- 함수 테스트
SELECT * FROM get_dashboard_announcements();
