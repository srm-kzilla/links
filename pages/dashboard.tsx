import { useEffect, useContext } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DashboardComponent from "../components/dashboard/dashboard";
import SidebarContextProvider from "../utils/sidebarContext";
import { AuthContext } from "../utils/authContext";
import { getLinks } from "../utils/api";

export default function Dashboard({ _resLinks }) {
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("isAuth", "true");
    if (!isAuth) {
      toast.error("❌ Access Denied, log in to continue!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      localStorage.removeItem("isAuth");
      router.replace("/login");
    }
  });

  return (
    <SidebarContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <DashboardComponent _resLinks={_resLinks} />
    </SidebarContextProvider>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const { authToken } = parseCookies(ctx);
    const _resLinks = await getLinks(authToken);

    return {
      props: {
        _resLinks,
      },
    };
  } catch (err) {
    return {
      props: {
        _resLinks: [],
      },
    };
  }
}
