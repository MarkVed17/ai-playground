import React from "react";
import { Checkbox as BaseCheckbox, type CheckboxProps as BaseProps } from "../../ui/Checkbox";

export type CheckboxProps = BaseProps;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <BaseCheckbox
      ref={ref}
      className={["text-emerald-600", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
