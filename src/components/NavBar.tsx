import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
function NavBar(props: { isAuthenticated: boolean; login: any; logOut: any }) {
  const { isAuthenticated, login, logOut } = props;
  // console.log(user);
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item">
          <img src={logo} width="150" height="40" />
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!isAuthenticated ? (
                <>
                  <button className="button is-primary" onClick={login}>
                    <strong>Connect Wallet</strong>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className="navbar-item">
                    Home
                  </Link>
                  <Link to="/faucet" className="navbar-item">
                    Faucet
                  </Link>
                  <Link to="/list-item" className="navbar-item">
                    List Item
                  </Link>
                  <Link to="/create-nft" className="navbar-item">
                    Create NFT
                  </Link>

                  {/* <p className="navbar-item">{user}</p> */}
                  <button className="button is-primary" onClick={logOut}>
                    <strong>LogOut</strong>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
