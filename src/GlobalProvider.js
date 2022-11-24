import React, { useReducer } from "react";

//初始化值
const initState = {
  pdfImg:"",
  signImg:""
};

function globalReducer(state, action) {
  switch (action.type) {
    case "setPDFImg":
      return {
        ...state,
        pdfImg: action.payload.pdfImg,
      };
    case "setSignImg":
      return {
        ...state,
        signImg: action.payload.signImg,
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
