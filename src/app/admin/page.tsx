import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // localhost, 127.0.0.1, [::1] 또는 포트가 포함된 로컬 환경 확인
  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("[::1]");

  if (!isLocal) {
    redirect("/");
  }

  return <AdminDashboard host={host} />;
}
