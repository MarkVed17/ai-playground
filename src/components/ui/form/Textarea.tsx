import React from "react";
import { Textarea as BaseTextarea, type TextareaProps as BaseProps } from "../../ui/Textarea";

export type TextareaProps = BaseProps;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <BaseTextarea
      ref={ref}
      className={[
        "rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
