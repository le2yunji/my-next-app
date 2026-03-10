// app/loading.tsx
import Spinner from "@/components/common/Spinner";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <Spinner size={50} className="text-primary-500" />
      </div>
    </main>
  );
}
