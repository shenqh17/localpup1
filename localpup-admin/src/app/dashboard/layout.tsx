import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={session.user} />
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}