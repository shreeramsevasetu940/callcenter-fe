import { requireAuthentication } from "@/utils/utils";

export default function  index() {
  return (
    <>
HELLO
    </>
  )
}

export async function getServerSideProps(context) {
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session },
    };
  });
}
