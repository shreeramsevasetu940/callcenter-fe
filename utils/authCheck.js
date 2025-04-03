import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAuthCheck = () => {
    const router = useRouter();

    useEffect(() => {
            // Prevent redirection loops
            if (["/sign-in", "/unauthorized"].includes(router.pathname)) return;

        if (router.pathname !== "/sign-in") { // Exclude sign-in page
            const checkAuthentication = async () => {
                const session = await getSession();
                if (!session) {
                    router.push("/sign-in");
                    return;
                }

                const userRole = session.user.role; // Get user role from session

                // Define role-based routes
                const roleBasedRoutes = {
                    admin: ["/","/setting","/leads","/addresses","/orders","/products","/delivery","/members"],
                    employee: ["/","/setting","/leads","/addresses","/orders"],
                    teamleader: ["/","/setting","/leads","/addresses","/orders","/delivery","/members"],
                    couriermanager: ["/","/setting","/delivery"],
                    manager: ["/","/setting","/leads","/addresses","/orders","/products","/delivery","/members"],
                };

                const publicRoutes = ["/sign-in","/unauthorized"];
                // Redirect if user role does not have access
                if (
                    !publicRoutes.some(route => router.pathname.startsWith(route)) &&
                    !roleBasedRoutes[userRole]?.some(route => router.pathname.startsWith(route))
                ) {
                    if (router.pathname !== "/unauthorized") {
                        router.push("/unauthorized"); // Avoid infinite loop
                    }
                }
            };

            checkAuthentication();
        }
    }, [router.pathname]);
};
