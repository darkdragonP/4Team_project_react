import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@rmwc/button"; // React Material 디자인 Button 컴포넌트 입니다.
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell,
} from "@rmwc/data-table"; //React Material 디자인 Data-Table 컴포넌트 입니다.
import { TextField } from "@rmwc/textfield"; //React Material 디자인 TextField 컴포넌트 입니다.
import "@rmwc/textfield/styles"; // //React Material TextField 디자인 입니다.
import "@rmwc/button/styles"; // React Material Button 디자인 CSS 입니다.
import "@rmwc/data-table/styles"; // React Material Data-Table 디자인 CSS 입니다.
import "@rmwc/checkbox/styles"; // React Meterial checkbox 디자인 CSS 입니다.
import "../css/home.css"; // 이 페이지의 커스텀 디자인 CSS 입니다.

const Board = () => {
  const history = useHistory();
  const [allChecked, setAllChecked] = useState(false);
  const [isChecked, setChecked] = useState([]);
  const [rows, setRows] = React.useState(0);
  const [cols, setCols] = React.useState(0);
  const [state, setState] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [globalArray, setGlobalArray] = useState([]);
  const [tempCount, setTempCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    // 페이지 로딩시 딱 한번만 실행되는 부분입니다. (로딩시 회원정보들을 불러와야 함.)
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/users/", {
        //모든 유저들을 불러오는데, api단에서, params가 없으면 기본적으로 1page로 세팅이 되기때문에 처음 1~10개의 데이터만 요청됩니다.
        method: "GET",
      });
      const jsonData = await response.json();
      setState(jsonData.result); //state 업데이트
      setTotalPage(jsonData.totalPage);
    };
    fetchData();
  }, [tempCount]); // tempCount가 값이 변하면 리렌더링되는데, 비중이 적어 신경안쓰셔도 될거같습니다.

  const getPageData = async (page) => {
    // 이부분은 페이지 블록을 클릭했을때 해당 페이지의 정보를 다시 로딩합니다. [2]를 누르면 당연히 2번 페이지가 요청이 되겟죠?
    const URL = `http://localhost:3001/api/users/${page}`;
    const response = await fetch(URL, {
      method: "GET",
    });
    const jsonData = await response.json();
    setState(jsonData.result);
    setTotalPage(jsonData.totalPage); // state 업데이트
  };

  const searchHandle = (evt) => {
    // 이부분은 회원정보 검색 input부분 state 업데이트 입니다.
    setSearchInput(evt.target.value);
  };

  const searchClick = async (evt) => {
    // 검색버튼 클릭시 작동합니다.
    if (searchInput.length < 1) {
      // 한글자라도 적지않으면 알림창이 나옵니다.
      alert("검색어를 입력하세요");
      return;
      evt.preventDefault();
    }

    const response = await fetch(
      `http://localhost:3001/api/user/search/${searchInput}`,
      {
        method: "GET",
      }
    );

    const jsonData = await response.json();
    setState(jsonData); // 결과를 state에 반영합니다.
  };

  const pageClick = (evt) => {
    // 페이지클릭시 작동
    const pageNum = evt.currentTarget.id;
    getPageData(pageNum); // 동일
  };

  constructor(props) {
    super(props);
    this.state = {
      isCheckChangeBoard:false
    };
  };

  isChangeBoardName = ()=> {
    this.setState({ isCheckChangeBoard: !this.state.isCheckChangeBoard });
  };

  return (
    <div className="wrapper table_wrapper">
      <div className="column"></div>
      <div style="margin:10px;">
        <button
          data-toggle="collapse"
          href="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Click
        </button>
      </div>
      <div class="collapse" id="collapseExample">
        <div class="well">hello world</div>
      </div>
      <DataTable
        style={{
          height: "auto",
          width: "auto",
          maxHeight: "1000px",
          minWidth: "375px",
          margin: "0px",
        }}
        stickyRows={rows}
        stickyColumns={cols}
      >
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>No</DataTableHeadCell>
              <DataTableHeadCell>게시자</DataTableHeadCell>
              <DataTableHeadCell>제목</DataTableHeadCell>
              <DataTableHeadCell>내용</DataTableHeadCell>
              <DataTableHeadCell>작성일</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {state.map((v, i) => (
              <DataTableRow key={i + 1123}>
                {/* 게시물 번호 */}
                <DataTableCell>{v[0]}</DataTableCell>
                {/* 게시자 */}
                <DataTableCell>{v[1]}</DataTableCell>
                {/* 제목 */}
                <DataTableCell onClick={this.isChangeBoardName}>{v[2]}</DataTableCell>
                {/* 작성일 */}
                <DataTableCell>{v[4]}</DataTableCell>
                {/* 내용 */}

                <DataTableCell>{v[3]}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTableContent>
      </DataTable>
      {/* 페이징 처리 */}
      <center>
        <div className="column pagination_wrapper">
          <ul class="pagination">
            {[...Array(totalPage)].map((n, index) => {
              return (
                <li class="page-item">
                  <b
                    class="page-link"
                    className="pagination_number"
                    value={index + 1}
                    onClick={pageClick}
                    id={index + 1}
                    key={index + 5}
                  >
                    [{index + 1}]
                  </b>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="column">
          <TextField
            outlined
            label="공지제목 검색 란"
            className="userName searchInput"
            placeholder="검색할 이름 입력"
            onChange={searchHandle}
          />
          <Button
            label="공지 제목 조회"
            outlined
            className="searchButton homeButtons"
            onClick={searchClick}
          />
        </div>
      </center>
    </div>
  );
};

export default Board;
