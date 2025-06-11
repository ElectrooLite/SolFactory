import { useEffect } from "react";
import Head from "next/head";
import WalletProvider from "../components/wallet/WalletProvider";
import Layout from "../components/layout/Layout";
import { TokenProvider } from "../contexts/TokenContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // Add viewport meta tag for better mobile experience
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }, []);

  return (
    <>
      <Head>
        <title>SolFactory | Create Solana Token </title>
        <meta
          name="description"
          content="Create your own Solana token in minutes without coding. Simple, secure, and low-cost token creation."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <WalletProvider>
        <TokenProvider>
          <Layout>f
            <Component {...pageProps} />
          </Layout>
        </TokenProvider>
      </WalletProvider>
    </>
  );
}

export default MyApp;
