import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FeedbackManager from "./FeedbackManager";

export default async function AdminFeedbackPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("[::1]");

  if (!isLocal) {
    redirect("/");
  }

  return <FeedbackManager />;
}
