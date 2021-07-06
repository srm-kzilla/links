import { useEffect, useContext } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DashboardComponent from "../components/dashboard/dashboard";
import SidebarContextProvider from "../store/sidebarContext";
import { AuthContext } from "../store/authContext";
import { getLinks } from "../utils/api";

interface DashboardPageProps {
  _resLinks: [];
}

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
      <DashboardComponent
        _resLinks={_resLinks.result}
        totalViews={_resLinks.viewCount}
      />
    </SidebarContextProvider>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DashboardPageProps>> {
  try {
    const { authToken } = parseCookies(ctx);
    const _resLinks = await getLinks(authToken);
    if (_resLinks.response && _resLinks.response.status === 401) {
      destroyCookie(ctx, "authToken");
      throw _resLinks;
    }
    return {
      props: {
        _resLinks,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
