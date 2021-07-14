import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";

import { ProfileComponent } from "../components/profile";
import { getUserProfile } from "../utils/api";

interface ProfilePageProps {
  _resProfile: [];
}

export default function Profile({ _resProfile }) {
  return (
    <>
      <ProfileComponent _resProfile={_resProfile.data} />
    </>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ProfilePageProps>> {
  try {
    const { authToken } = parseCookies(ctx);
    const _resProfile = await getUserProfile(authToken);
    if (_resProfile.response && _resProfile.response.status === 401) {
      destroyCookie(ctx, "authToken");
      throw _resProfile;
    }
    return {
      props: {
        _resProfile,
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
