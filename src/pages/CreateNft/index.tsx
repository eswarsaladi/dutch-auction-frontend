import { useMoralisFile } from "react-moralis";
import { useState } from "react";
import { encode as btoa } from "base-64";
import { useWeb3Contract, useMoralis } from "react-moralis";

import nft from "../../constants/BasicNft.json";
import address from "../../constants/contractAddress.json";

function CreateNft() {
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [metafile, setMetaFile] = useState<File | null | undefined>();
  const { error, isUploading, saveFile } = useMoralisFile();
  const { runContractFunction, isLoading, isFetching } = useWeb3Contract({});

  const createNft = async (event: any) => {
    // event.preventDefault();

    const image = await uploadFile();

    const result = await uploadNFTDetails({
      name,
      creator,
      description,
      image,
    });

    const options = {
      contractAddress: address.nft,
      abi: nft,
      functionName: "mintNft",
    };

    await runContractFunction({
      params: { ...options, params: { _tokenuri: result } },
      onSuccess: () => console.log("Success"),
      onError: (error) => {
        console.log(error);
      },
    });

    // call basic nft here
    console.log(result);
  };

  const uploadFile = async () => {
    if (!metafile) return;
    const data = metafile;

    const result = await saveFile(data.name, data, { saveIPFS: true });
    return result?.ipfs();
  };

  const uploadNFTDetails = async (metadata: {
    name: string;
    creator: string;
    description: string;
    image: string | undefined;
  }) => {
    const result = await saveFile(
      "file.json",
      { base64: btoa(JSON.stringify(metadata)) },
      { saveIPFS: true }
    );
    return result?.ipfs();
  };
  return (
    <>
      {isUploading || isLoading || isFetching ? (
        <p>Loading</p>
      ) : (
        <div className="create-nft-container">
          <div className="container">
            <form className="create-nft-form">
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Name"
                    id="meta-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Creator</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Creator"
                    id="meta-creator"
                    value={creator}
                    onChange={(event) => setCreator(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="Description"
                    id="meta-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="level">
                <div className="file">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      name="Choose File"
                      onChange={(event) => {
                        if (event.target.files)
                          setMetaFile(event.target.files[0]);
                      }}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Choose a file…</span>
                    </span>
                  </label>
                </div>

                <button
                  className="button is-primary"
                  onClick={(event) => createNft(event)}
                >
                  Create NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateNft;
