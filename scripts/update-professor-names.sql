-- 기존 교수 데이터 업데이트
UPDATE professors
SET name = '김교수'
WHERE name = '자동 생성 교수' AND professor_id = 'professor-id-1';

UPDATE professors
SET name = '이교수'
WHERE name = '자동 생성 교수' AND professor_id = 'professor-id-2';

UPDATE professors
SET name = '박교수'
WHERE name = '자동 생성 교수' AND professor_id = 'professor-id-3';

-- 교수 데이터 확인
SELECT professor_id, name, email, department_id FROM professors;
