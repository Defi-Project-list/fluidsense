import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { LensConfig, LensProvider, staging } from "@lens-protocol/react";
import { localStorage } from "@lens-protocol/react/web";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";

const { chains, provider, webSocketProvider } = configureChains(
  [polygon],
  [publicProvider()]
);

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: staging,
  storage: localStorage(),
};

const { connectors } = getDefaultWallets({
  appName: "Fluid Sense",
  chains,
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fluid Lens</title>
        <meta name="description" content="Fluid Sense Official Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <LensProvider config={lensConfig}>
            <Component {...pageProps} />
          </LensProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
