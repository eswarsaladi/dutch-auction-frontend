import address from "../constants/contractAddress.json";
import auctionAbi from "../constants/DutchAuction.json";
import erc20Abi from "../constants/BasicErc20.json";
import nftAbi from "../constants/BasicNft.json";
import { useWeb3Contract } from "react-moralis";
import { useState, useEffect } from "react";

interface AuctionResponse {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  owner: string;
  payToken: string;
  startingPrice: string;
  startsAt: string;
  expiresAt: string;
  discountRate: string;
  acceptedBid: string;
  bidder: string;
  nftTransfered: boolean;
  proceedsRecieved: string;
}
function NftCard({
  nftAddress,
  tokenId,
  payToken,
}: {
  nftAddress: string;
  tokenId: any;
  payToken: string;
}) {
  const [auctionData, setAuctionData] = useState<Object>({});

  const [isAuctionActive, setAuctionActive] = useState(false);
  const [price, setPrice] = useState<string>();
  const [nftDetails, setNftDetails] = useState<Object>({});
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [creator, setCreator] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [bidAmount, setBidAmount] = useState<string>();
  const [bidPlaced, setBidPlaced] = useState(false);

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract({});

  async function getCurrentPrice() {
    const options = {
      contractAddress: address.auction,
      abi: auctionAbi,
      functionName: "getPrice",
      params: {
        _nftAddress: nftAddress,
        _tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: options,
      onSuccess: (data) => {
        if (data instanceof Object && data !== undefined) {
          setPrice(`${data}`);
          setBidAmount(`${data}`);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  const { runContractFunction: auctions } = useWeb3Contract({
    contractAddress: address.auction,
    abi: auctionAbi,
    functionName: "auctions",
    params: {
      nftAddress,
      tokenId,
    },
  });

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  useEffect(() => {
    async function getDataFromAuction() {
      const auctionData = await auctions();
      console.log("test");
      console.log(auctionData);
      if (auctionData instanceof Object && auctionData !== undefined) {
        const data = auctionData as AuctionResponse;
        console.log("Hello");
        console.log(data.nftTransfered);
        setAuctionActive(!data.nftTransfered);
      }
    }
    getCurrentPrice();
    async function getNftDetails() {
      const tokenURI = await getTokenURI();
      console.log(`The TokenURI is ${tokenURI}`);
      // We are going to cheat a little here...
      if (tokenURI) {
        // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
        const requestURL = `${tokenURI}`;
        const tokenURIResponse = await (await fetch(requestURL)).json();
        const imageURI = tokenURIResponse.image;
        const imageURIURL = imageURI;
        setImageURI(imageURIURL);
        setTokenName(tokenURIResponse.name);
        setCreator(tokenURIResponse.creator);
        setTokenDescription(tokenURIResponse.description);
        // We could render the Image on our sever, and just call our sever.
        // For testnets & mainnet -> use moralis server hooks
        // Have the world adopt IPFS
        // Build our own IPFS gateway
      }
    }
    getDataFromAuction();
    getNftDetails();
  }, [bidPlaced]);

  async function approve(event: any) {
    event.preventDefault();

    const options = {
      contractAddress: address.erc20,
      abi: erc20Abi,
      functionName: "approve",
      params: {
        spender: address.auction,
        amount: bidAmount,
      },
    };

    await runContractFunction({
      params: options,
      onSuccess: () => console.log("Success"),
    });
  }

  async function placeBid(event: any) {
    event.preventDefault();
    const options = {
      contractAddress: address.auction,
      abi: auctionAbi,
      functionName: "placeBid",
      params: {
        _nftAddress: nftAddress,
        _tokenId: tokenId,
        _bidAmount: bidAmount,
      },
    };
    await runContractFunction({
      params: options,
      onSuccess: () => console.log("Success added bid"),
      onError: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <>
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={imageURI} />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-6 is-uppercase">{tokenName}</p>
              <p className="subtitle is-6">@{creator}</p>
              <p>{tokenDescription}</p>
              {/* <p>expires at : {`${auctionData["expiresAt"]}`}</p> */}
              {Object.entries(auctionData).map(([key, values]) => (
                <p>
                  {key} : {values.toString()}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="card-content">
          {isAuctionActive ? (
            <div className="level">
              <div className="level-left">
                <p className="card-footer-tem">{price} TKN</p>
              </div>
              <div className="level-right ">
                <form className="card-footer-item">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input border-white"
                        type="text"
                        placeholder="Bid Amount"
                        id="bid-amount"
                        value={bidAmount}
                        onChange={(event) => setBidAmount(event.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="button is-primary  margin-left"
                    onClick={async (event) => await approve(event)}
                  >
                    Approve Pay
                  </button>
                  <button
                    className="button is-primary card-footer-item margin-left"
                    onClick={async (event) => await placeBid(event)}
                  >
                    Bid NFT
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card-footer-item">Auction Closed</div>
          )}
        </div>
      </div>
    </>
  );
}

export default NftCard;
