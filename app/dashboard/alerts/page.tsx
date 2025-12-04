import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "@/components/dashboard/layout"
import AlertsPage from "@/components/dashboard/alerts-page"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout user={data.user}>
      <AlertsPage merchantId={data.user.id} />
    </DashboardLayout>
  )
}
