import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";

import CrispProvider from "@/components/CrispProvider";
import ModalProvider from "@/components/ModalProvider";
import ToasterProvider from "@/components/ToasterProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Helmet>
        <title>Einstein</title>
      </Helmet>
      <ClerkProvider {...pageProps}>
        <CrispProvider />
        <ModalProvider />
        <ToasterProvider />

        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}
