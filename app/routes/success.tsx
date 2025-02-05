import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { sessionStorage } from '../backend/session.server';
import { Link } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  if (!user) throw redirect('/login');

  return user ? json(user) : null;
}

export default function Success() {
  return (
    <div className="flex justify-center w-full p-16 font-sans">
      <div className="w-10/12">
        <h1 className="text-3xl">Success</h1>
        <Link to="/" className="underline cursor-pointer">
          Go To Dashboard
        </Link>
      </div>
    </div>
  );
}
