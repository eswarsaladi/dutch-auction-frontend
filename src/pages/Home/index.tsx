import NftCard from "../../components/NftCard";
import { useMoralisQuery, useMoralis } from "react-moralis";

function Home() {
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    // TableName
    // Function for the query
    "AuctionsCreated",
    (query) => query.limit(10).descending("tokenId")
  );
  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <p className="title">NFT Auctions</p>
            <p className="subtitle">Presenting Dutch Auction</p>
          </div>
        </div>
      </section>
      <div className="container">
        {fetchingListedNfts ? (
          <div>Loading...</div>
        ) : (
          listedNfts.map((nft, index) => {
            console.log(nft.attributes);
            const { nftAddress, tokenId, payToken } = nft.attributes;
            return (
              <NftCard
                nftAddress={nftAddress}
                tokenId={tokenId}
                payToken={payToken}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default Home;
