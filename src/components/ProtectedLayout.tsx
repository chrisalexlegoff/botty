import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader } from ".";

type ProtectedLayoutProps = {
  children: React.ReactElement;
};

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  console.log(session?.user?.email, process.env.EMAIL_1);
  const authorized =
    sessionStatus === "authenticated" &&
    session?.user?.email ===
      (process.env.EMAIL_1 !== undefined ? process.env.EMAIL_1 : "");
  // const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loading || !router.isReady) return;

    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (!authorized) {
      router.push({
        pathname: "/api/auth/signin",
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, sessionStatus, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return <Loader />;
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return authorized ? <div className="h-full">{children}</div> : <></>;
};
