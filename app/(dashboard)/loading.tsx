export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  )
}
