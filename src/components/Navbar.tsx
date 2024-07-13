import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar(): JSX.Element {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/editor") ? "active" : ""
                    }`}
                    to="/editor"
                  >
                    <i className="ion-compose"></i>&nbsp;New Article
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/settings") ? "active" : ""
                    }`}
                    to="/settings"
                  >
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive(`/profile/${user?.username}`) ? "active" : ""
                    }`}
                    to={`/profile/${user?.username}`}
                  >
                    <img
                      src={user?.image}
                      className="user-pic"
                      alt={user?.username}
                    />
                    {user?.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/login") ? "active" : ""}`}
                    to="/login"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/register") ? "active" : ""
                    }`}
                    to="/register"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
