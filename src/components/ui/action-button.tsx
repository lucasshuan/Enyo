import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

interface ActionButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: LucideIcon;
  label: string;
}

export function ActionButton({
  icon: Icon,
  label,
  className,
  intent = "secondary",
  size = "md",
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ intent, size }),
        "w-full cursor-pointer rounded-2xl py-6 font-medium shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20",
        className,
      )}
      {...props}
    >
      <Icon className="mr-2 size-4" />
      {label}
    </button>
  );
}
