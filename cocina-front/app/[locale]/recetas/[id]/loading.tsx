import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-[400px] w-full rounded-lg md:h-[500px]" />
        </div>

        <div className="mb-6 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

