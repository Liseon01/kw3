1. configs 디렉토리 생성 후 디렉토리 내에 config.js파일 생성
2. npx sequelize db:create (mysql에 se3_project DB없을시)
3. npx sequelize db:migrate
4. npx sequelize db:seed:all


model 생성(마이그레이션 파일 자동 생성) -> model, migration 파일 수정 -> migration진행 -> seeder파일 작성
-> seeder 데이터 삽입

<Model 생성>
npx sequelize model:generate --name registration --attributes column:datatype

<Seeder 생성>
npx sequelize seed:generate --name #생성할이름#


<특정 seeders 파일만 이용>
npx sequelize-cli db:seed --seed 20250519061618-Student.js
npx sequelize-cli db:seed:undo --seed 20250519061618-Student.js

<주의할점>
Sequelize bulkInsert()는 defaultValue를 무시함
Sequelize에서 seeder를 실행할 때 주로 사용하는 bulkInsert()는 모델의 defaultValue나 제약 조건을 적용하지 않습니다.


validate는 model에 작성하는것임. migration파일에는 validate작성 ❌

즉, admission_type을 직접 넣지 않으면, null이 들어갑니다. 이것은 Sequelize의 알려진 동작 방식입니다.

migration 파일의 defaultValue는 DB 스키마에만 영향을 줍니다.
bulkInsert()는 그것을 따르지 않고 그냥 명시된 값만 insert합니다.


핵심 원인: db:seed:undo는 seed 파일 이름만 인자로 받음
--seed 옵션에는 전체 경로가 아니라 파일명만 넘겨야 합니다.




<Datatypes.TIME>
문자열 "HH:MM:SS"형식으로 작성해야함


커밋할때 [branch명] 수정한파일 수정내용

<Postman 한글 인코딩 필수>

