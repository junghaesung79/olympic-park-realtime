import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MapPinManager from "./MapPinManager";

export default async function AdminMapPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("[::1]");

  if (!isLocal) {
    redirect("/");
  }

  return <MapPinManager />;
}
