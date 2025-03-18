import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAuthCheck = () => {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname !== '/sign-in') {  // Exclude '/sign-in'
            const checkAuthentication = async () => {
                const session = await getSession();
                if (!session) {
                router.push('/sign-in');
                }
            };
            checkAuthentication();
        }
    }, [router.pathname]);
};