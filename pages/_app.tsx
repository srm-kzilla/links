import Head from "next/head";
import { useRouter } from "next/router";
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

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>LINKS</title>
      </Head>
      <RecoilRoot>
        <AuthContextProvider>
          <ImageContextProvider>
            <div className="relative min-h-custom">
              <div className="pb-4">
                <Navbar />
                <Component {...pageProps} />
                <style jsx global>{`
                  body, html {
                    background-color: ${router.pathname == "/dashboard" ? "#E0E0E0" : "#FFFFFF"};
                  }
                `}</style>
              </div>
              <Footer />
              <ToastContainer />
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
