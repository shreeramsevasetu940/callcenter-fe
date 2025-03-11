import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function  index() {
    const router = useRouter()
     useEffect(() => {
        const checkAuthentication = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/sign-in');
            }
        };
        checkAuthentication();
    }, []); // The empty dependency array ensures that the effect runs only once on mount
  return (
    <>
HELLO
    </>
  )
}