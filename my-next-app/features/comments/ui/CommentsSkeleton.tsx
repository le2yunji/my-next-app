export default function CommentsSkeleton() {
  return (
    <div className="flex-1 px-4 py-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-5 flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-linen" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 rounded bg-linen" />
            <div className="h-3 w-full rounded bg-linen" />
            <div className="h-3 w-2/3 rounded bg-linen" />
          </div>
        </div>
      ))}
    </div>
  );
}
