import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import LinkPageComponent, { CardLink } from "../components/publicPage/index";
import { getPublicLinks, getUserProfile } from "../utils/api";
import { parseCookies } from "nookies";

interface LinkPageProps {
  publicLinksData: CardLink[];
  _resProfile: Object;
}

export default function LinkPage({ publicLinksData, _resProfile }) {
  return (
    <>
      <LinkPageComponent _resLinks={publicLinksData} _resProfile={_resProfile.data} />
    </>
  );
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<LinkPageProps>> => {
  const { username } = ctx.params;

  try {
    const publicLinksData = await getPublicLinks(username as string);
    const { authToken } = parseCookies(ctx);
    const _resProfile = await getUserProfile(authToken);

    if (!publicLinksData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        publicLinksData,
        _resProfile
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
