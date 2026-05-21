import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  const host = (await headers()).get("host") || "";
  
  if (host.includes(":3002")) {
    redirect("/superadmin");
  } else if (host.includes(":3001")) {
    redirect("/api-docs");
  } else {
    redirect("/home");
  }
}
