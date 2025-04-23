import React from 'react';
import { cn } from '@/lib/utils'
import '@/styles/animations.css'; // Import the animations CSS

const Grid = ({ 
  children, 
  className,
  gap = 5
}) => {
  const childCount = React.Children.count(children);
  const cols = Math.min(childCount, 6); // Limit to a maximum of 6 columns

  return (
    <div className={cn(
      'grid',
      `grid-cols-${Math.min(cols, 1)}`,
      `md:grid-cols-2`,
      `lg:grid-cols-3`,
      `xl:grid-cols-3`, // Ensure one row for desktop view
      `2xl:grid-cols-3`, // Ensure one row for desktop view
      `3xl:grid-cols-6`, // Ensure one row for desktop view
      `gap-${gap}`,
      'my-4', // Margin
      className
    )}>
      {React.Children.map(children, (child, index) => (
        <div className="animate-fade-in" style={{ animationDelay: `${index * 500}ms` }}>
          {child}
        </div>
      ))}
    </div>
  )
}

export default Grid;