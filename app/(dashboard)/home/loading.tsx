export default function HomeLoading() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 h-[380px] bg-muted rounded-xl" />
        <div className="lg:col-span-3 h-[380px] bg-muted rounded-xl" />
      </div>
    </div>
  )
}
