import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <Loader2 className="text-primary size-10 animate-spin opacity-20" />
    </div>
  );
}
