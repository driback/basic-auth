"use client";

import { Button } from "@vevibe/ui";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api.util";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await api.auth.logout.$post({}, { init: { credentials: "include" } });
    if (res.status !== 200) return;
    router.push("/auth/signin");
  };

  return <Button onClick={() => handleLogout()}>Logout</Button>;
};

export default Logout;
