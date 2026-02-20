import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const HRVTrendChart = ({ data }) => {
    const { isIOS } = useStyle();
    // data: [{date: '01.01', hrv: 50, baseline: 52}, ...]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded shadow-lg border text-sm" style={{
                    backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : designTokens.theme.colors.bg.card,
                    borderColor: isIOS ? iosTheme.theme.colors.glass.border : designTokens.theme.colors.bg.secondary,
                    color: isIOS ? iosTheme.theme.colors.text.primary : designTokens.theme.colors.text.primary,
                    backdropFilter: isIOS ? 'blur(12px)' : 'none',
                    borderRadius: isIOS ? '12px' : '4px'
                }}>
                    <p className="font-bold mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {Math.round(entry.value)} ms
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const hrvColor = isIOS ? iosTheme.theme.colors.charts.hrv.line : '#00E6C8';
    const baselineColor = isIOS ? iosTheme.theme.colors.charts.hrv.baseline : '#34C759';
    const gridColor = isIOS ? 'rgba(168, 216, 234, 0.2)' : 'rgba(0, 230, 200, 0.08)';
    const textColor = isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary;

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                    dataKey="date"
                    tick={{ fill: textColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                />
                <YAxis
                    tick={{ fill: textColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                    type="monotone"
                    dataKey="hrv"
                    name="Daily HRV"
                    stroke={hrvColor}
                    strokeWidth={isIOS ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="baseline"
                    name="30d Baseline"
                    stroke={baselineColor}
                    strokeWidth={isIOS ? 3 : 2}
                    strokeDasharray="5 5"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HRVTrendChart;
