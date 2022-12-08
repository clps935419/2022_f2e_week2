import React, { Suspense, useEffect, useState, useContext } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { GlobalDataContext } from "@/GlobalProvider.js";

function RouterInterceptor({ inner }) {
  const {type} = inner;
  const { GlobalState, GlobalDispatch } = useContext(GlobalDataContext);
  const { pdfImg, signImg } = GlobalState;
  if (type.name === "CreateSign"){
    if (!!!pdfImg) {
      //如果沒有PDF回到首頁
      return <Navigate to="/upload" replace />;
    }
  }else if (type.name === "PDFEditPage") {
    if (!!!pdfImg || !!!signImg) {
      //如果沒有PDF或是簽名就回到首頁
      return <Navigate to="/upload" replace />;
    }
  }

  return <>{inner}</>;
}

export default RouterInterceptor;
