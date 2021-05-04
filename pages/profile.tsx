import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

import ProfileComponent from "../components/profile";
import { getUserProfile } from "../utils/api";

export default function Profile({_resProfile}): JSX.Element {
    return (
        <>
            <ProfileComponent _resProfile={_resProfile.data}/>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    try {
      const { authToken } = parseCookies(ctx);
      const _resProfile = await getUserProfile(authToken);
      return {
        props: {
         _resProfile,
        },
      };
    } catch (err) {
      return {
        props: {
          _resProfile: [],
        },
      };
    }
  }