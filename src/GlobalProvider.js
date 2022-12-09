import React, { useReducer } from "react";

//初始化值
const initState = {
  pdfImg: "",
  signImg: "",
  pdfImgArr:[],
  pageNo: 0,
};

function globalReducer(state, action) {
  switch (action.type) {
    case "setPDFImg":
      return {
        ...state,
        pdfImg: action.payload.pdfImg,
      };
    case "setPDFImgArr":
      return {
        ...state,
        pdfImgArr: action.payload.pdfImgArr,
        pdfImg: action.payload.pdfImgArr[0],
      };
    case "setSignImg":
      return {
        ...state,
        signImg: action.payload.signImg,
      };
    case "setPageNo":
      console.log("page", action.payload.pageNo);
      return {
        ...state,
        pageNo: action.payload.pageNo,
        pdfImg: state.pdfImgArr[action.payload.pageNo],
      };
    case "setResetToIndex":
      return {
        ...state,
        pageNo: 0,
        pdfImg: "",
        pdfImgArr:[],
      };
  }
}

export const GlobalDataContext = React.createContext();
function GlobalDataProvider({ children, data = {} }) {
  const [state, dispatch] = useReducer(globalReducer, initState);

  return (
    <GlobalDataContext.Provider
      value={{
        GlobalState: state,
        GlobalDispatch: dispatch,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}

export default GlobalDataProvider;
