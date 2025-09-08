import React from "react";
import { ToggleSwitch as BaseToggle, type ToggleSwitchProps as BaseProps } from "../../ui/ToggleSwitch";

export type ToggleProps = BaseProps;

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...props }, ref) => (
    <BaseToggle ref={ref} className={className} {...props} />
  )
);
Toggle.displayName = "Toggle";
