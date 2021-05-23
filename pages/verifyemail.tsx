import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { VerifyEmail as VerifyEmailComponent } from "../components/verifyEmail";
import { getSecretToken } from "../utils/api";

interface AuthTokenProps {
  authToken: string;
}

export default function VerifyEmail({ authToken }) {
  return <VerifyEmailComponent authTokenProp={authToken} />;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<AuthTokenProps>> => {
  const secret = ctx.query.secret;

  try {
    const _res = await getSecretToken(secret as string);
    const authToken = _res.authToken;
    if (!_res) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        authToken,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
