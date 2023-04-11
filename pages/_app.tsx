import { Loader } from "../src/components";
import "../src/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { AppProviders } from "../lib/providers";

export default function App({ Component, pageProps }: AppProps) {
  const env = process.env.NODE_ENV;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted && env === "development") return null;
  return mounted ? (
    <SessionProvider session={pageProps.session}>
      <AppProviders>
        <Component {...pageProps} />
      </AppProviders>
    </SessionProvider>
  ) : (
    <Loader />
  );
}
