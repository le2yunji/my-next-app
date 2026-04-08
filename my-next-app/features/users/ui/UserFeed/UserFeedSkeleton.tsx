"use client";

export default function UserFeedListSkeleton() {
  return (
    <main className="w-[393px]">
      <ul className="grid grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <li key={index} className="relative">
            <div className="relative aspect-square w-full overflow-hidden">
              <div className="h-full w-full animate-pulse bg-gray-200 p-0.5" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
