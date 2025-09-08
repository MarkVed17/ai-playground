import React from "react";
import { RangeSlider as BaseSlider, type RangeSliderProps as BaseProps } from "../../ui/RangeSlider";

export type SliderProps = BaseProps;

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => (
    <BaseSlider
      ref={ref}
      className={[
        "h-2 bg-emerald-100 rounded-full [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);
Slider.displayName = "Slider";
