import { useMoralis } from "react-moralis";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ListItem from "./pages/ListItem";
import CreateNft from "./pages/CreateNft";
import Faucet from "./pages/Faucet";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import address from "./constants/contractAddress.json";

import beboop from "./assets/images/beboop.png";

function App() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
    enableWeb3,
  } = useMoralis();

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  useEffect(() => {
    enableWeb3();
  }, []);

  const walletNotConnectedDisplay = (
    <>
      <div className="container">
        <div className="columns is-vcentered">
          <div className="column">
            <div className="content">
              <h1>Wallet not connected!!!</h1>
              <p>Please connect your wallet to continue</p>
            </div>
          </div>
          <div className="column">
            <figure>
              <img
                src={beboop}
                alt="Sad Astronaut crying"
                className="image max-height-50"
              />
            </figure>
          </div>
        </div>
      </div>
    </>
  );

  const walletConnectedDisplay = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faucet" element={<Faucet />} />
      <Route path="/list-item" element={<ListItem />} />
      <Route path="/create-nft" element={<CreateNft />} />
    </Routes>
  );
  return (
    <div className="App">
      <NavBar isAuthenticated={isAuthenticated} login={login} logOut={logOut} />

      {isAuthenticated ? walletConnectedDisplay : walletNotConnectedDisplay}

      <div className="footer background-color-secondary margin-top-20">
        <div className="container">
          Addresses for the demo
          <br />
          {Object.entries(address).map(([key, value]) => (
            <p>
              {key} address : {value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
