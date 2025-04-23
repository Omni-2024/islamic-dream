import React from 'react';
import { cn } from '@/lib/utils'
import '@/styles/animations.css'; // Import the animations CSS

const Grid = ({ 
  children, 
  className,
  gap = 4,
  minWidth = '150px' // Add minWidth prop for auto-fit
}) => {
  return (
    <div className={cn(
      'grid',
      'w-full',
      `gap-${gap}`,
      className
    )}
    style={{
      gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
    }}>
      {React.Children.map(children, (child, index) => (
        <div className="animate-fade-in" style={{ animationDelay: `${index * 500}ms` }}>
          {child}
        </div>
      ))}
    </div>
  )
}

export default Grid;

