import { redirect } from "next/navigation";

// The admin panel is a separate app at https://smag-admin-panel.vercel.app
// This old admin section on the customer site is disabled for security.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  redirect("https://smag-admin-panel.vercel.app");
  return <>{children}</>;
}
