-- 대시보드 공지사항 조회 함수 생성
CREATE OR REPLACE FUNCTION get_dashboard_announcements()
RETURNS TABLE (
    announcement_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    is_important BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    course_id INTEGER,
    course_name VARCHAR(100),
    professor_name VARCHAR(100)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ca.announcement_id,
        ca.title,
        ca.content,
        ca.is_important,
        ca.created_at,
        ca.course_id,
        c.course_name,
        COALESCE(p.name, u.name, '알 수 없는 교수') as professor_name
    FROM course_announcements ca
    LEFT JOIN courses c ON ca.course_id = c.course_id
    LEFT JOIN professors p ON c.professor_id = p.professor_id
    LEFT JOIN users u ON c.professor_id = u.username
    ORDER BY ca.created_at DESC
    LIMIT 5;
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_dashboard_announcements() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_announcements() TO anon;

SELECT 'Dashboard function created successfully!' as message;
