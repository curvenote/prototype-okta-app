// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { OktaIdTokenClaims, OktaProfile, OktaStrategy } from '@curvenote/remix-auth-okta';
import jwt from 'jsonwebtoken';

type OktaUser = {
  userId: string;
  profile: OktaProfile;
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<OktaUser>();

const oktaStrategy = new OktaStrategy<OktaUser>(
  {
    oktaDomain: process.env.OKTA_DOMAIN ?? 'INVALID',
    clientId: process.env.OKTA_CLIENT_ID ?? 'INVALID',
    clientSecret: process.env.OKTA_CLIENT_SECRET ?? 'INVALID',
    redirectURI: `${process.env.APP_URL}/auth/okta/callback` || 'INVALID',
  },
  async ({ tokens }) => {
    const { id_token, access_token } = tokens.data as { id_token: string; access_token: string };
    const idClaims = jwt.decode(id_token) as OktaIdTokenClaims;
    const profile = await OktaStrategy.userProfile(access_token);

    return {
      userId: idClaims.sub as string,
      profile,
    } as OktaUser;
  }
);

authenticator.use(oktaStrategy, 'okta');
