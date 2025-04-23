import React from 'react';
import { cn } from '@/lib/utils'
import '@/styles/animations.css';

const Grid = ({ 
  children, 
  className,
  gap = 4
}) => {
  const childCount = React.Children.count(children);

  return (
    <div className={cn(
      'grid',
      'grid-cols-1',
      `md:grid-cols-1`,
      // `ipad-landscape:grid-cols-${Math.min(cols, 2)}`,
      `lg:grid-cols-2`,
      `xl:grid-cols-2`,
      `2xl:grid-cols-3`,
      `3xl:grid-cols-5`,
      `gap-${gap}`,
      'my-4',
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