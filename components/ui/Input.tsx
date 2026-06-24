import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label && <span className="text-text-muted">{label}</span>}
        <input
          ref={ref}
          className={cn(
            "bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2.5 text-text-primary outline-none transition-colors focus:border-gold-400/60 disabled:opacity-50",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-error text-xs" role="alert">
            {error}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";
