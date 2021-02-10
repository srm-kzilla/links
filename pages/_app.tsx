import { AppProps } from "next/dist/next-server/lib/router/router";

import { Navbar, Footer } from "../components/shared/";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
