import MainBar from "@/components/MainBar";
import ToastComponent from "@/components/ToastComponent";
import "@/styles/globals.css";
import { useAuthCheck } from "@/utils/authCheck";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useAuthCheck(); 
  const router = useRouter();

  // Define pages that should not have a sidebar
  const excludeSideBar = [
    "/sign-in",
    "/forgot-password",
    "/reset-password",
    "/404",
  ].some(path => router.pathname.startsWith(path));

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <link rel="icon" href="/images/logo/favicon.png" />
        </Head>

        <ToastComponent />

        {excludeSideBar ? (
          <Component {...pageProps} />
        ) : (
          <MainBar>
            <Component {...pageProps} />
          </MainBar>
        )}
      </SessionProvider>
    </>
  );
}
