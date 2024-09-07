'use client';
import { SessionProvider } from "next-auth/react";

export default function NextAuthSessionProvider({ children }) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}  // Disable refetch on tab/window switch
      refetchInterval={0}           // Disable background refetching
      staleTime={30 * 60 * 1000}    // Keep session fresh for 30 minutes
    >
      {children}
    </SessionProvider>
  );
}
