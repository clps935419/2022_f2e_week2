import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="header">
        <div className="header__left">
          <div className="header__logo">
            點點簽
          </div>
        </div>
        <div className="header__right">
          <Link className="header__index-btn" to={`/`}>首頁</Link>
        </div>
      </div>
    </>
  );
}
export default Header;
