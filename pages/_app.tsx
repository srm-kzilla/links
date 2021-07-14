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

        <meta name="title" content="Links - Your Ultimate URL Warehouse" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="keywords"
          content="links, srmkzilla, og, open graph, chennai"
        />
        <meta name="language" content="English" />
        <meta name="author" content="SRMKZILLA" />
        <meta name="copyright" content="All rights reserved | SRMKZILLA" />
        <meta httpEquiv="content-language" content="en" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="With Links, you can manage all your social links, just with a single link! Get insightful analytics and shrunken URLs, thanks to KZILLA.XYZ"
        />

        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://metatags.io/" /> */}
        <meta
          property="og:title"
          content="Links - Your Ultimate URL Warehouse"
        />
        <meta
          property="og:description"
          content="With Links, you can manage all your social links, just with a single link! Get insightful analytics and shrunken URLs, thanks to KZILLA.XYZ"
        />
        <meta
          property="og:image"
          content={`https://billboard.srmkzilla.net/api/blog?title=Links&subtitle=Your%20Ultimate%20URL%20Warehouse`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://metatags.io/" /> */}
        <meta
          property="twitter:title"
          content="Links - Your Ultimate URL Warehouse"
        />
        <meta
          property="twitter:description"
          content="With Links, you can manage all your social links, just with a single link! Get insightful analytics and shrunken URLs, thanks to KZILLA.XYZ"
        />
        <meta
          property="twitter:image"
          content={`https://billboard.srmkzilla.net/api/blog?title=Links&subtitle=Your%20Ultimate%20URL%20Warehouse`}
        />
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
