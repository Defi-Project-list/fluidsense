import React, { useState } from "react";
import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../../abi/contracts.json";

import CreateCampaingButton from "./CreateCampaingButton";
import Alert from "./Alerts/Alert";

export default function CampaignForm() {
  const [clientInfo, setClientInfo] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [amountFlowRate, setAmountFlowRate] = useState<number>();
  const [amountInSMC, setAmountInSMC] = useState<number>();
  const [isHuman, setIsHuman] = useState<boolean>(false);

  const campaignsFactoryAddress = "0x9AaC2fcBDEE400BcdD118eb2d80Bbc875634605f";

  const { config: approveTokensContractConfig } = usePrepareContractWrite({
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    abi: abi.abiFUSDC,
    functionName: "approve",
    args: [
      campaignsFactoryAddress,
      amountInSMC
        ? ethers.utils.parseUnits(amountInSMC.toString(), "6").toString()
        : undefined,
    ],
  });

  const { writeAsync: ApproveTokensContractTx, data: dataApprove } =
    useContractWrite(approveTokensContractConfig);

  const {
    data: txReceiptApprove,
    isSuccess: txSuccessApprove,
    isError: txErrorApprove,
    isLoading: txLoadingApprove,
  } = useWaitForTransaction({
    confirmations: 12,
    hash: dataApprove?.hash,
  });

  const handleAmountFlowRateChange = (val: string) => {
    setAmountFlowRate(Number(val));
  };

  const handleAmountInSMCChange = (val: string) => {
    setAmountInSMC(Number(val));
  };

  const handleClientChange = (e: any) => {
    setClientInfo(e.target.value);
  };

  const onApproveClick = async () => {
    try {
      await ApproveTokensContractTx?.();
    } catch (error) {
      console.log(error);
    }
  };

  const getCloseAlert = (closeAlert: boolean) => {
    closeAlert && setMessage(undefined);
  };

  const handleIsHumanChange = (e: any) => {
    setIsHuman(e.target.checked);
  };

  return (
    <div className="mx-14">
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="flow"
            className="block text-xl font-bold leading-6 text-gray-900 pb-2"
          >
            Flow in fUSDC
          </label>
          <div className="text-base leading-5 pb-2">
            Define how much each user will get with your campaign.
          </div>
          <div className="mt-2">
            <input
              value={amountFlowRate}
              onChange={(e) => handleAmountFlowRateChange(e.target.value)}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
              step="any"
              type="number"
              name="flow"
              id="flow"
              autoComplete="given-name"
              className="px-4 block w-full rounded-md border-1 border-superfluid-100 py-1.5 text-superfluid-100 shadow-sm placeholder:text-superfluid-100 sm:text-sm sm:leading-6 focus:outline-none focus:ring-1 focus:ring-superfluid-100"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="amount"
            className="block text-xl font-bold leading-6 text-gray-900 pb-2"
          >
            Amount in fUSDC
          </label>
          <div className="text-base leading-5 pb-2">
            Define the total investment for your campaign.
          </div>
          <div className="mt-2">
            <input
              value={amountInSMC}
              onChange={(e) => handleAmountInSMCChange(e.target.value)}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
              step="any"
              type="number"
              name="amount"
              id="amount"
              autoComplete="family-name"
              className="px-4 block w-full rounded-md border-1 border-superfluid-100 py-1.5 text-superfluid-100 shadow-sm placeholder:text-superfluid-100 sm:text-sm sm:leading-6 focus:outline-none focus:ring-1 focus:ring-superfluid-100"
            />
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="address"
            className="block text-xl font-bold leading-6 text-gray-900 pb-2"
          >
            Address with Lens profile or Lens profile
          </label>
          <div className="text-base leading-5 pb-2">
            Provide the address of the Lens Profile that will be used in the
            campaign.
          </div>
          <div className="mt-2">
            <input
              placeholder="0x......"
              value={clientInfo}
              onChange={(e) => handleClientChange(e)}
              id="address"
              name="address"
              type="text"
              className="px-4 block w-full rounded-md border-1 border-superfluid-100 py-1.5 text-superfluid-100 shadow-sm placeholder:text-superfluid-100 sm:text-sm sm:leading-6 focus:outline-none focus:ring-1 focus:ring-superfluid-100"
            />
          </div>
        </div>
        <div className="sm:col-span-4 mt-4 opacity-20">
          <span className="block text-xl font-bold leading-6 text-gray-900 pb-2">
            Settings comming soon
          </span>
          <div className="text-base leading-5 pb-2">
            <input
              checked={isHuman}
              disabled={true}
              onChange={(e) => handleIsHumanChange(e)}
              id="isHuman"
              name="isHuman"
              type="checkbox"
              className="inline-block rounded-md mr-2 border-1 border-superfluid-100 py-1.5 text-superfluid-100 shadow-sm placeholder:text-superfluid-100 focus:outline-none focus:ring-1 focus:ring-superfluid-100"
            />
            <label htmlFor="isHuman">
              Only Worldcoin human verified accounts comming soon
            </label>
          </div>
        </div>
        <div className="sm:col-span-4">
          {amountInSMC !== undefined &&
          amountFlowRate !== undefined &&
          clientInfo !== undefined ? (
            txReceiptApprove === undefined ? (
              amountInSMC === 0 || amountFlowRate === 0 ? (
                <div className="mt-2 flex justify-center ">
                  <div className="px-20 py-5 rounded-full text-gray-600 bg-gray-200 leading-8 font-bold opacity-50 tracking-wide">
                    Approve USDC
                  </div>
                </div>
              ) : !txLoadingApprove ? (
                <div className="mt-2 flex justify-center ">
                  <button
                    onClick={() => onApproveClick()}
                    className=" px-20 py-5 rounded-full bg-superfluid-100 leading-8 font-bold tracking-wide"
                  >
                    Approve USDC
                  </button>
                </div>
              ) : (
                <div>
                  <Alert
                    type={"loading"}
                    message={
                      "Your transaction is being processed, don't close or reload the page!"
                    }
                    getCloseAlert={getCloseAlert}
                    hash={dataApprove?.hash}
                  />
                  <div className="mt-2 flex justify-center ">
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
                      Approving
                    </div>
                  </div>
                </div>
              )
            ) : (
              <CreateCampaingButton
                amountInSMC={amountInSMC}
                clientInfo={clientInfo}
                isHuman={isHuman}
                amountFlowRate={amountFlowRate}
                txLoadingApprove={txLoadingApprove}
                txErrorApprove={txErrorApprove}
                txSuccessApprove={txSuccessApprove}
                dataApproveHash={dataApprove?.hash}
              />
            )
          ) : (
            <div className="mt-2 flex justify-center ">
              <div className="px-20 py-5 rounded-full text-gray-600 bg-gray-200 leading-8 font-bold opacity-50 tracking-wide">
                Approve USDC
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
