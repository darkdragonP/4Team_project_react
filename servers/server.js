import express from "express";
import cors from "cors"; //local서버 환경에서 API 연동을 위해서 cors 라이브러리를 설치했습니다.
import bodyParser from "body-parser"; // 요청을 parser해주는 라이브러리
import { getRows, getResult } from "./db"; // db.js에서 설명완료

const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // 포트 3001
app.use(bodyParser.json());

app.get("/api/users/:page*?", (req, res) => {
  // /api/users/:page get으로 요청하면 작동합니다. 다른점은, :page*? 이부분인데, URL의 Params를 받아옵니다. ex) /api/users/1
  getRows(`SELECT COUNT(*)FROM ADMIN_BOARD`).then((result) => {
    let page = req.params.page ? req.params.page : 1; // params가 없다면, 1로 자동 세팅하게 해두었습니다.
    let list = 10; // 보여줄 게시글 수
    let startRow = (page - 1) * list + 1; // 1페이지일시 1번째 row부터, 2페이지일시 11번재 row부터, 3페이지일시 21번째 row부터
    let endRow = page * list; // 1페이지일시, 10번째 row까지. 2페이지일시 20번째 row까지. 3페이지일시 30번째 row까지. 페이지가 달라질수록 값이 변합니다.
    let totalRow = result[0][0]; // 전체 Row의 갯수
    let totalPage = Math.ceil(totalRow / list); // 30개면 3.
    // if (endRow > totalPage) endRow = totalPage; // 전체Rows가 26개인데, endRow가 30으로 계산됬을시, 26으로 숫자를 같게 맞춰줍니다
    getRows(
      // 위의 변수들을 활용하여, :page 값에 따라 다른 데이터들이 조회됩니다.
      `
      SELECT *
      FROM
        ( 
          SELECT /*+ INDEX(b PK1) */
              b.ADMIN_BOARD_CODE, u.NAME, b.ADMIN_BOARD_TITLE, 
              b.ADMIN_BOARD_CONTENTS, b.ADMIN_BOARD_DATE 
          FROM 
              ADMIN_BOARD b, USERS u
          WHERE 
              ROWNUM <= ${endRow} 
          AND 
              b.USER_CODE=u.USER_CODE
          ORDER BY 
              b.ADMIN_BOARD_CODE ASC
        )
      WHERE
          ${startRow} <= ROWNUM
      `
    ).then((result) => {
      res.json({ result, totalPage }); // 회원정보들과, 총 페이지의 수를 Return 합니다.
    });
  });
});

app.get("/api/user/:idx", (req, res) => {
  // idx는 DB에서 고유한 키입니다. 1명의 유저의 정보를 조회할때 사용합니다.
  const idx = req.params.admin_board_code;
  getRows(
    // 조회 쿼리 동일
    `SELECT USER_CODE, ADMIN_BOARD_TITLE, ADMIN_BOARD_CONTENTS, ADMIN_BOARD_DATE FROM ADMIN_BOARD WHERE ADMIN_BOARD_CODE = ${idx}`
  ).then((result) => {
    res.json(result); // 결과 리턴
  });
});

app.get("/api/user/search/:id", (req, res) => {
  // /api/user/search/:id 이부분은, 이름을 URL Params로 받아와 검색해서 일부분일치하는 결과를 알려줍니다.
  const id = req.params.id;
  var sql = `SELECT * FROM ADMIN_BOARD WHERE ADMIN_BOARD_TITLE LIKE '%${id}%'`;
  // ${id}% 는, 예를들어, "박관" 이라고 검색했을때, "박관" 으로 시작하는 모든것을 조회합니다.
  getRows(sql).then((result) => {
    res.json(result); // 결과리턴
  });
});

app.listen(port, () => {
  // 서버 키는 코드
  console.log(`express is running on ${port}`);
});
