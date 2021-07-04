import Head from "next/head";
import Router from "next/router";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { parseCookies } from "nookies";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";
import { Navbar, Footer } from "../components/shared";
import AuthContextProvider from "../store/authContext";
import ImageContextProvider from "../store/profileImageContext";
import { authRoutes, authRestrictedRoutes } from "../utils/constants";

const showLoader = () => {
  document.getElementById("page-loader").classList.add("loading");
};
const hideLoader = () => {
  document.getElementById("page-loader").classList.remove("loading");
};

Router.events.on("routeChangeStart", () => showLoader());
Router.events.on("routeChangeComplete", () => hideLoader());
Router.events.on("routeChangeError", () => hideLoader());

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>LINKS</title>
      </Head>

      <ToastContainer />
      <RecoilRoot>
        <AuthContextProvider>
          <ImageContextProvider>
            <div className="min-h-screen relative">
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </div>
          </ImageContextProvider>
        </AuthContextProvider>
      </RecoilRoot>
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

  if (authToken && authRestrictedRoutes.includes(ctx.asPath)) {
    ctx.res.writeHead(302, { Location: "/dashboard" });
    ctx.res.end();
  }

  return { pageProps, pathname: ctx.asPath };
};
