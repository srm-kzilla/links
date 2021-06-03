import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { CardLink } from "../components/publicPage/LinkPage";
import { LinkPageComponent } from "../components/publicPage";
import { getPublicLinks } from "../utils/api";

interface LinkPageProps {
  publicLinksData: CardLink[];
}

export default function LinkPage({ publicLinksData }) {
  return (
    <>
      <LinkPageComponent _resLinks={publicLinksData} />
    </>
  );
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<LinkPageProps>> => {
  const { username } = ctx.params;

  try {
    const publicLinksData = await getPublicLinks(username as string);

    if (!publicLinksData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        publicLinksData
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
