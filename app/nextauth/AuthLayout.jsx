"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading

    if (!session) {
      router.push("/login"); // Redirect to login if not authenticated
    }
   
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading state while the session is being fetched
  }

  return <>{children}</>;
};

export default AuthLayout;
