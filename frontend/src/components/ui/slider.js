
import React from 'react';

export function Slider({ defaultValue, max, step, className }) {
  return (
    <input
      type="range"
      defaultValue={defaultValue}
      max={max}
      step={step}
      className={className}
    />
  );
}