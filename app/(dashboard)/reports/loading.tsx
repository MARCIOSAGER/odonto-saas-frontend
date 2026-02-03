export default function ReportsLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted rounded" />
          <div className="h-10 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="h-12 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-72 bg-muted rounded-xl" />
    </div>
  )
}
