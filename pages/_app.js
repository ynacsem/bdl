import { SessionProvider } from 'next-auth/react';
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider 
      session={pageProps.session} 
      refetchOnWindowFocus={false}  // Disable refetch on window/tab switch
      refetchInterval={0}           // Disable periodic session refresh
      staleTime={30 * 60 * 1000}    // 30 minutes stale time, session doesn't refetch unless explicitly invalidated
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
