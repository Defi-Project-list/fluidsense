import { ConnectButton } from "@rainbow-me/rainbowkit";

import Image from "next/image";
import Wallet from "../../public/wallet.svg";

export const Profile = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="absolute top-1/3 end-10">
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="border-1 border-superfluid-100 text-superfluid-100 px-5 py-4 rounded-full h-12 bg-superfluid-200 flex items-center font-bold text-xl leading-6"
                    >
                      Connect Wallet
                    </button>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <div className="absolute top-1/3 end-10">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="border-1 border-superfluid-100 text-superfluid-100 px-5 py-4 rounded-full h-12 bg-superfluid-200 flex items-center font-bold text-xl leading-6"
                    >
                      Wrong network
                    </button>
                  </div>
                );
              }
              return (
                <div
                  style={{ display: "flex", gap: 12 }}
                  className="absolute top-1/3 end-10"
                >
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  ></button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="border-1 border-superfluid-100 text-superfluid-100 px-5 py-4 rounded-full h-12 bg-superfluid-200 flex items-center font-bold text-xl leading-6"
                  >
                    <Image
                      priority
                      src={Wallet}
                      height={30}
                      width={30}
                      alt="Fluid sense logo"
                      className="mx-1"
                    />
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
