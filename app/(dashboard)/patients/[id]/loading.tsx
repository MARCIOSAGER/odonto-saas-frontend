export default function PatientDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border rounded-xl p-5">
        <div className="h-7 bg-muted rounded w-1/3 mb-3" />
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>
      </div>
      <div className="h-24 bg-muted rounded-xl" />
      <div className="h-10 bg-muted rounded" />
      <div className="h-64 bg-muted rounded" />
    </div>
  )
}
