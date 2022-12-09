import { Link } from "react-router-dom";
import { GlobalDataContext } from "@/GlobalProvider.js";
import { useEffect, useContext, useRef, useState } from "react";

function Header() {
const { GlobalDispatch, GlobalState } = useContext(GlobalDataContext);
  return (
    <>
      <div className="header">
        <div className="header__left">
          <div className="header__logo">
            點點簽
          </div>
        </div>
        <div className="header__right">
          <Link className="header__index-btn" onClick={()=>{
            GlobalDispatch({
              type: "setResetToIndex",
            });
          }} to={`/`}>首頁</Link>
        </div>
      </div>
    </>
  );
}
export default Header;
