import { cookies } from "next/headers";
import Logout from "~/components/auths/logout";
import { api } from "~/utils/api.util";

export default async function Home() {
  const c = cookies();
  const authSession = c.get("auth_session");

  const res = await api.auth.me.$get(undefined, {
    init: {
      headers: {
        Cookie: `auth_session=${authSession?.value ?? ""}`, // attach auth_session cookie to the request
      },
    },
  });

  const isLogged = (await res.json()) !== null;

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      {isLogged ? "Logged" : "Logged out"}
      <Logout />
    </div>
  );
}
