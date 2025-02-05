import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '../backend/auth.server';
import { sessionStorage } from '../backend/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await authenticator.authenticate('okta', request);
    if (!user) {
      console.error('/auth/okta/callback - Failed to authenicate with OKTA');
      throw redirect('/login');
    }

    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    session.set('user', user);

    return redirect('/success', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    console.error('/auth/okta/callback - Failed to authenicate with OKTA', error);
    throw redirect('/login');
  }
}
