import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { sessionStorage } from '~/backend/session.server';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  if (!user) throw redirect('/login');

  return user ? json(user) : null;
}

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as { displayName: string; email: string; provider: string };
  const { displayName, email, provider } = data;
  return (
    <div className="flex justify-center w-full p-16 font-sans">
      <div className="w-10/12 space-y-6">
        <h1 className="text-3xl">
          Welcome <span className="font-semibold text-green-700">{displayName}</span>!
        </h1>
        <div>Your Stuff</div>
        <p>
          You logged in using <code className="font-semibold text-red-700">{provider}</code> and
          your account email is <code className="font-semibold text-red-700">{email}</code>.
        </p>
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div>
          <form method="post" action="/logout">
            <button className="px-2 py-1 border border-black rounded" type="submit">
              logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
