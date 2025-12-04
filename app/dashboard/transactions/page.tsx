import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "@/components/dashboard/layout"
import TransactionsPage from "@/components/dashboard/transactions-page"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout user={data.user}>
      <TransactionsPage merchantId={data.user.id} />
    </DashboardLayout>
  )
}
