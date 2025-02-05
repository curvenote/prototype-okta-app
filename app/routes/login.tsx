import { useActionData, Form } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { sessionStorage } from '~/backend/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  if (user) throw redirect('/');

  return null;
}

export default function Login() {
  const data = useActionData<{ error?: string }>();
  return (
    <div className="flex justify-center py-16">
      <div className="space-y-3">
        <div className="text-xl text-center">LOGIN</div>
        <Form className="flex flex-col gap-1" method="post" action="/auth/okta">
          <div className="flex justify-center">
            <button className="px-2 py-1 border border-black rounded" type="submit">
              Login with OKTA
            </button>
          </div>
        </Form>
        {/* <Form className="flex flex-col gap-1" method="post" action="/auth/orcid">
          <div className="flex justify-center">
            <button className="px-2 py-1 border border-black rounded" type="submit">
              Login with ORCID
            </button>
          </div>
        </Form> */}
        {/* <Form className="flex flex-col gap-1" method="post" action="/auth/form">
          <legend>Login with Username & Password</legend>
          <input
            className="p-1 border border-black rounded"
            type="text"
            name="username"
            placeholder="Username"
          />
          <input
            className="p-1 border border-black rounded"
            type="password"
            name="password"
            placeholder="Password"
          />
          <div className="flex justify-center">
            <button className="px-2 py-1 border border-black rounded" type="submit">
              Login
            </button>
          </div>
        </Form> */}
        {data?.error && <div className="font-mono text-red-600">{data.error}</div>}
      </div>
    </div>
  );
}
