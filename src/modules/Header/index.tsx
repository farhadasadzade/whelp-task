import { Link } from "react-router-dom";
import "./style.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <Link to="/">Persona</Link>
          </div>
          <div className="header__user">
            <div className="header__user-avatar">
              <img src="https://via.placeholder.com/32" alt="avatar" />
            </div>
            <div className="header__user-status"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
