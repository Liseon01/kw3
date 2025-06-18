-- First, check if we need to update the professors table
DO $$
BEGIN
  -- Check if the table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'professors') THEN
    -- Delete existing professors to avoid conflicts
    DELETE FROM professors;
    
    -- Insert professors with IDs that match the session storage format
    INSERT INTO professors (professor_id, name, email, department_id) VALUES
    ('professor-id-1', '김교수', 'professor1@kwangwoon.ac.kr', 1),
    ('professor-id-2', '이교수', 'professor2@kwangwoon.ac.kr', 1),
    ('professor-id-3', '박교수', 'professor3@kwangwoon.ac.kr', 2);
    
    RAISE NOTICE 'Professors table updated successfully';
  ELSE
    RAISE NOTICE 'Professors table does not exist';
  END IF;
END $$;
