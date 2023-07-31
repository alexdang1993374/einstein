import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Helmet>
        <title>Einstein</title>
      </Helmet>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}
