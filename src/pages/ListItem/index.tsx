import { useState } from "react";
import address from "../../constants/contractAddress.json";
import auctionAbi from "../../constants/DutchAuction.json";
import nftAbi from "../../constants/BasicNft.json";
import { useWeb3Contract } from "react-moralis";

function ListItem() {
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [reservePrice, setReservePrice] = useState(0);
  const [payToken, setPayToken] = useState("");
  const [discountRate, setDiscountRate] = useState("");

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract({});

  const createListing = async (event: any) => {
    event.preventDefault();

    await listItemForAuction();
  };

  async function setApproveAllNFT() {
    const options = {
      contractAddress: address.nft,
      abi: nftAbi,
      functionName: "setApprovalForAll",
      params: {
        operator: address.auction,
        approved: "true",
      },
    };

    await runContractFunction({
      params: options,
      onSuccess: () => console.log("success"),
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function approvePermissions(event: any) {
    event.preventDefault();

    await setApproveAllNFT();
  }

  async function listItemForAuction() {
    const options = {
      contractAddress: address.auction,
      abi: auctionAbi,
      functionName: "createAuction",
      params: {
        _nftAddress: nftAddress,
        _tokenId: tokenId,
        _payToken: payToken,
        _reservePrice: reservePrice,
        _discountRate: discountRate,
      },
    };
    await runContractFunction({
      params: options,
      onSuccess: () => console.log("Success for listing item"),
      onError: (error) => {
        console.log(error);
      },
    });
  }

  const ListItemForm = (
    <form className="list-item-form">
      <div className="field">
        <label className="label">NFT Address</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="NFT Address"
            id="nft-addr"
            value={nftAddress}
            onChange={(event) => setNftAddress(event.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Token Id</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Token Id"
            id="token-id"
            value={tokenId}
            onChange={(event) => setTokenId(event.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Pay Token</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Pay Token"
            id="pay-token"
            value={payToken}
            onChange={(event) => setPayToken(event.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="field">
        <label className="label">Reserve Price</label>
        <div className="control">
          <input
            className="textarea"
            placeholder="Reserve Price"
            id="reserve-price"
            value={reservePrice}
            onChange={(event) => setReservePrice(parseInt(event.target.value))}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Discount Rate</label>
        <div className="control">
          <input
            className="textarea"
            placeholder="Discount Rate"
            id="discount-rate"
            value={discountRate}
            onChange={(event) => setDiscountRate(event.target.value)}
          />
        </div>
      </div>

      <button
        className="button is-primary"
        onClick={(event) => approvePermissions(event)}
      >
        Grant Permissions
      </button>
      <button
        className="button is-primary margin-left"
        onClick={(event) => createListing(event)}
      >
        Create Listing
      </button>
    </form>
  );
  return (
    <>
      <div className="list-item-container">
        <div className="container">
          {isLoading || isFetching ? <p>Loading</p> : ListItemForm}
        </div>
      </div>
    </>
  );
}

export default ListItem;
