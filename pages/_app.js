// import SideBar from "@/components/SideBar";
// import ToastComponent from "@/components/ToastComponent";
// import "@/styles/globals.css";
// import { SessionProvider } from 'next-auth/react'
// import Head from "next/head";
// import { useRouter } from "next/router";
// export default function App({ Component, pageProps: { session, ...pageProps } }) {
//   const router=useRouter();
//   const excludeSideBar =router.pathname.startsWith("/sign-in")||router.pathname.startsWith("/forgot-password")||router.pathname.startsWith("/reset-password")||router.pathname.startsWith("/404")
//   return (
//   <>
//     <SessionProvider session={session}>
//     <Head>
// <link rel="icon" href="/images/logo/favicon.png" />
// </Head>
// <ToastComponent />
// {excludeSideBar?<Component {...pageProps} />:
// <SideBar children={<Component {...pageProps} />}/>}
//     </SessionProvider>
//   </>
//   );
// }

// import SideBar from "@/components/SideBar";
import MainBar from "@/components/MainBar";
// import SideBarComp from "@/components/SideBar";
import ToastComponent from "@/components/ToastComponent";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
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

        {/* Toast Component should be placed here */}
        <ToastComponent />

        {/* Render Component with or without Sidebar based on the condition */}
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
