import { Link, useNavigate } from "react-router-dom";
import { clearToken, isAuthed } from "../lib/auth";

export function Layout({ children }) {
  const navigate = useNavigate();
  const authed = isAuthed();

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">Campus Resource Hub</div>
        <div className="links">
          <Link to="/browse">Browse</Link>
          {authed ? (
            <>
              <Link to="/upload">Upload</Link>
              <button className="btn danger" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

