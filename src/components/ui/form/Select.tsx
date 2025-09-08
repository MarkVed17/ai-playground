import React from "react";
import { SelectDropdown, type SelectDropdownProps } from "../../ui/SelectDropdown";

export type SelectProps = SelectDropdownProps;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <SelectDropdown
      ref={ref}
      className={[
        "py-2.5 pr-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);
Select.displayName = "Select";
