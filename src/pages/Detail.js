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
import "@rmwc/textfield/styles"; // //React Material TextField 디자인 입니다.
import "@rmwc/button/styles"; // React Material Button 디자인 CSS 입니다.
import "@rmwc/data-table/styles"; // React Material Data-Table 디자인 CSS 입니다.
import "@rmwc/checkbox/styles"; // React Meterial checkbox 디자인 CSS 입니다.
import "../css/home.css"; // 이 페이지의 커스텀 디자인 CSS 입니다.

const Detail = () => {
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
      const response = await fetch(`http://localhost:3001/api/user/detail/1`, {
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
    const URL = `http://localhost:3001/api/user/detail/1`;
    const response = await fetch(URL, {
      method: "GET",
    });
    const jsonData = await response.json();
    setState(jsonData.result);
    setTotalPage(jsonData.totalPage); // state 업데이트
  };

  return (
   {allChecked}
  );
};

export default Detail;
