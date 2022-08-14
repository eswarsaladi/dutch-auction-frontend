import { useWeb3Contract } from "react-moralis";

import erc20 from "../../constants/BasicErc20.json";

function Faucet() {
  const erc20Addr = "0x7B775B3cFCDE81f4923803c9B84e72D433e492c0";
  const options = {
    contractAddress: erc20Addr,
    abi: erc20,
    functionName: "faucet",
  };
  const { runContractFunction, isLoading, isFetching } = useWeb3Contract({});

  async function getErcFromFaucet() {
    await runContractFunction({
      params: options,
      onSuccess: () => console.log("SUccess"),
      onError: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <>
      <div className="faucet-container">
        <div className="container">
          <h2>Contract Address : {erc20Addr}</h2>
          {isLoading || isFetching ? (
            <p>Loading</p>
          ) : (
            <button
              className="button is-primary"
              onClick={() => {
                console.log("test");
                getErcFromFaucet();
              }}
            >
              Faucet
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Faucet;
