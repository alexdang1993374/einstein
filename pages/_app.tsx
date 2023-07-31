import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Helmet } from "react-helmet";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
      <Helmet>
        <title>Einstein</title>
      </Helmet>
      
      <Component {...pageProps} />
  </>
  )
}
