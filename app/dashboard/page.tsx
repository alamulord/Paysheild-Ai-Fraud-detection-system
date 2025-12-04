import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "@/components/dashboard/layout"
import DashboardOverview from "@/components/dashboard/overview"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout user={data.user}>
      <DashboardOverview merchantId={data.user.id} />
    </DashboardLayout>
  )
}
