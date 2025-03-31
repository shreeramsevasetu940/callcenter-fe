import { getServerSession } from "next-auth";

export const requireAuthentication = async (context, cb) => {
  const session = await getServerSession(context.req, context.res);
  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  return cb(JSON.parse(JSON.stringify({ session })));
};
