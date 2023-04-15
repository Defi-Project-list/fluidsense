import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
import abi from "../../abi/contracts.json";

import { client, Profiles } from "../pages/api/Profile";
import Alert from "./Alerts/Alert";

interface EventIdInputInterface {
  amountInSMC: number;
  amountFlowRate: number;
  clientInfo: string;
  txLoadingApprove: boolean;
  txErrorApprove: boolean;
  txSuccessApprove: boolean;
  dataApproveHash: `0x${string}` | undefined;
  isHuman: boolean;
}

export default function CreateCampaingButton({
  amountInSMC,
  amountFlowRate,
  clientInfo,
  txSuccessApprove,
  txLoadingApprove,
  txErrorApprove,
  dataApproveHash,
  isHuman,
}: EventIdInputInterface) {
  const { address } = useAccount();
  const [lensProfile, setLensProfile] = useState<any>();
  const [body, setBody] = useState<any>();
  const [type, setType] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [campaign, setCampaing] = useState<string>();
  const [noLensProfile, setNoLensProfile] = useState<boolean>(false);
  const [hash, setHash] = useState<string>();

  const campaignsFactoryAddress = "0x9AaC2fcBDEE400BcdD118eb2d80Bbc875634605f";

  const amount = ethers.utils
    .parseUnits(amountInSMC.toString(), "6")
    .toString();

  const unwatch = watchContractEvent(
    {
      address: campaignsFactoryAddress,
      abi: abi.abiCampaignFactory,
      eventName: "NewCampaign",
    },
    (sender: any, campaign: any) => {
      setCampaing(campaign);
    }
  );

  const { config: createCampaignContractConfig } = usePrepareContractWrite({
    address: campaignsFactoryAddress,
    abi: abi.abiCampaignFactory,
    functionName: "deployCampaign",
    args: [amount],
  });

  const { writeAsync: createCampaignContractTx, data: dataCampaign } =
    useContractWrite(createCampaignContractConfig);

  const {
    isSuccess: txSuccessCampaign,
    isError: txErrorCampaign,
    isLoading: txLoadingCampaign,
  } = useWaitForTransaction({
    confirmations: 2,
    hash: dataCampaign?.hash,
  });

  async function fetchProfiles(typeQuery: string) {
    const queryBody = `query Profiles {
      profiles(request: { ${typeQuery}: ["${clientInfo}"], limit: 1 }) {
        items {
          id
          interests
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          onChainIdentity{
            ens{
              name
              __typename
            }
            proofOfHumanity
            __typename
            worldcoin{
              isHuman
              __typename
            }
            sybilDotOrg{
              source{
                __typename
              }
              __typename
              verified
            }
          }
          followNftAddress
          metadata
          isDefault
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          handle
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  symbol
                  name
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
             type
            }
            ... on RevertFollowModuleSettings {
             type
            }
          }
        }
        pageInfo {
          prev
          next
          totalCount
        }
      }
    }`;

    try {
      let response = await client.query({ query: Profiles(queryBody) });
      let profileData = await Promise.all(
        response.data.profiles.items.map(async (profileInfo: any) => {
          let profile = { ...profileInfo };
          let picture = profile.picture;
          if (picture && picture.original && picture.original.url) {
            if (picture.original.url.startsWith("ipfs://")) {
              let result = picture.original.url.substring(
                7,
                picture.original.url.length
              );
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
            } else {
              profile.avatarUrl = picture.original.url;
            }
          }
          return profile;
        })
      );
      if (profileData[0] === undefined) {
        setNoLensProfile(true);
      } else {
        setLensProfile(profileData[0]);
      }
    } catch (err) {
      console.log({ err });
    }
  }

  async function postClient() {
    try {
      await fetch(process.env.NEXT_PUBLIC_API as string, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: body,
        mode: "no-cors" as RequestMode,
      }).catch((err) => console.error(err));
    } catch (err) {
      console.log(err);
    }
  }

  const onCreateClick = async () => {
    try {
      await createCampaignContractTx?.();
      unwatch();
    } catch (error) {
      console.log(error);
    }
  };

  const getCloseAlert = (closeAlert: boolean) => {
    closeAlert && setMessage(undefined);
  };

  useEffect(() => {
    if (clientInfo.slice(0, 2) === "0x") {
      fetchProfiles("ownedBy");
    }
    if (clientInfo.slice(-5) === ".lens") {
      fetchProfiles("handles");
    }
  }, []);

  useEffect(() => {
    setNoLensProfile(false);
    if (clientInfo.slice(0, 2) === "0x") {
      fetchProfiles("ownedBy");
    }
    if (clientInfo.slice(-5) === ".lens") {
      fetchProfiles("handles");
    }
  }, [clientInfo]);

  useEffect(() => {
    setBody(
      JSON.stringify({
        clientProfile: lensProfile?.id.toString(),
        clientAddress: lensProfile?.ownedBy.toString(),
        flowSenderAddress: campaign,
        followNftAddress: lensProfile?.followNftAddress,
        amountFlowRate: Number(amountFlowRate),
        amount: Number(amountInSMC),
        owner: address,
        isHuman: isHuman,
      })
    );
  }, [lensProfile, campaign]);

  useEffect(() => {
    if (txLoadingApprove || txLoadingCampaign) {
      if (txLoadingApprove) {
        setHash(dataApproveHash);
      } else {
        setHash(dataCampaign?.hash);
      }
      setType("loading");
      setMessage(
        "Your transaction is being processed, don't close or reload the page!"
      );
    }
  }, [txLoadingApprove, txLoadingCampaign]);

  useEffect(() => {
    if (txSuccessApprove || txSuccessCampaign) {
      if (txSuccessApprove) {
        setHash(dataApproveHash);
        setType("success");
        setMessage("USDC approved!");
      }
      if (txSuccessCampaign) {
        setHash(dataCampaign?.hash);
        setType("success");
        setMessage("Your campaign has been successfully created!");
      }
    }
  }, [txSuccessCampaign, txSuccessApprove]);

  useEffect(() => {
    if (txErrorCampaign || txErrorApprove) {
      if (txErrorApprove) {
        setHash(dataApproveHash);
      } else {
        setHash(dataCampaign?.hash);
      }
      setType("fail");
      setMessage("Your transaction failed");
    }
  }, [txErrorCampaign, txErrorApprove]);

  useEffect(() => {
    if (txSuccessCampaign) {
      postClient();
    }
  }, [txSuccessCampaign]);

  return (
    <>
      <div>
        {type !== undefined && message !== undefined && (
          <Alert
            type={type}
            message={message}
            getCloseAlert={getCloseAlert}
            hash={hash}
          />
        )}
        {noLensProfile ? (
          <Alert
            type={"fail"}
            message={"This address is not owner of a Lens Profile"}
            getCloseAlert={getCloseAlert}
          />
        ) : amountInSMC === 0 || amountFlowRate === 0 ? (
          <div className="mt-5 flex justify-center ">
            <div className="px-20 py-5 rounded-full text-gray-600 bg-gray-200 leading-8 font-bold opacity-50 tracking-wide">
              Create Campaign
            </div>
          </div>
        ) : !txLoadingCampaign ? (
          <div className="mt-5 flex justify-center ">
            <button
              onClick={() => onCreateClick()}
              className=" px-20 py-5 rounded-full bg-superfluid-100 leading-8 font-bold tracking-wide"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center ">
            <div className=" px-20 py-5 rounded-full bg-superfluid-100 leading-8 font-bold tracking-wide flex">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-500 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              Creating Campaign
            </div>
          </div>
        )}
      </div>
    </>
  );
}
