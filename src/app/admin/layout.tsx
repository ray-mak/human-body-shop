import AdminNav from "./_components/AdminNav"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <AdminNav />
      <div>{children}</div>
    </div>
  )
}
