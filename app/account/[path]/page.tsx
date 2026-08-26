// import { auth } from "@/lib/auth"; // path to your auth config
import { headers } from "next/headers";

export async function MyServerComponent() {
  const session = await auth.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user;

  if (!currentUser) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello, {currentUser.name}</div>;
}