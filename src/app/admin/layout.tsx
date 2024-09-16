import AdminNav from "./_components/AdminNav"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <AdminNav />
      <div>
        <div>
          <div className="mt-32 mb-16">{children}</div>
        </div>
      </div>
    </div>
  )
}
