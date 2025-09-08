import React from "react";
import { TextInput, type TextInputProps } from "../../ui/TextInput";

export type InputProps = TextInputProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <TextInput
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
Input.displayName = "Input";
