import { AppProps } from "next/dist/next-server/lib/router/router";
import Footer from "../shared/components/footer";
import Navbar from "../shared/components/navbar";
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
