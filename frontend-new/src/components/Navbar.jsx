import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        PMS
      </div>

      <ul>
        <li>
          <Link to="/login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;