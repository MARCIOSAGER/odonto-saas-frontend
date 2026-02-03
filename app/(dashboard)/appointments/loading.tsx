export default function AppointmentsLoading() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-muted rounded" />
          <div className="h-10 w-40 bg-muted rounded" />
        </div>
      </div>
      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
