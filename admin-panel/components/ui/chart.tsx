import React from 'react'
import { Tooltip, TooltipProps } from 'recharts'

export const ChartContainer: React.FC<{
    children: React.ReactNode
    config: Record<string, { label: string; color: string }>
    className?: string
}> = ({ children, config, className }) => {
    return (
        // <div className={className} style={{ '--color-revenue': config.revenue.color, '--color-classes': config.classes.color } as React.CSSProperties}>
        <div className={className} >
            {children}
        </div>
    )
}

export const ChartTooltip: (props: any) => React.JSX.Element = (props:any) => {
    return <Tooltip {...props} />
}

export const ChartTooltipContent: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 rounded shadow">
                <p className="font-bold">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        )
    }

    return null
}

