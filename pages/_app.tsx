import Head from "next/head";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { parseCookies } from "nookies";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";
import { Navbar, Footer } from "../components/shared";
import AuthContextProvider from "../utils/authContext";
import ImageContextProvider from "../utils/profileImageContext";
import { authRoutes } from "../utils/constants";

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <AuthContextProvider>
        <ImageContextProvider>
          <div className="relative min-h-screen">
            <div className="pb-4">  
              <Navbar />
              <Component {...pageProps} />
            </div>
            <Footer />
            <ToastContainer />
          </div>
        </ImageContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default MyApp;

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps;
  const { authToken } = parseCookies(ctx);

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  if (!authToken && authRoutes.includes(ctx.asPath)) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
  }

  return { pageProps, pathname: ctx.asPath };
};
