import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const WorkRestChart = ({ data }) => {
    const { isIOS } = useStyle();
    // Expects data to be array of objects with { date_label, tss, recovery }

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
                            {entry.name}: {Math.round(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const strainColor = isIOS ? iosTheme.theme.colors.charts.strain.primary : '#00E6C8';
    const recoveryColor = isIOS ? iosTheme.theme.colors.charts.recovery.high : '#34C759';
    const gridColor = isIOS ? 'rgba(168, 216, 234, 0.2)' : 'rgba(0, 230, 200, 0.08)';
    const textColor = isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                    dataKey="date_label"
                    tick={{ fill: textColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: textColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'TSS', angle: -90, position: 'insideLeft', fill: textColor }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: textColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Recovery', angle: 90, position: 'insideRight', fill: textColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="tss" name="Strain (TSS)" barSize={10} fill={strainColor} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="recovery" name="Recovery %" stroke={recoveryColor} strokeWidth={isIOS ? 3 : 2} dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default WorkRestChart;
