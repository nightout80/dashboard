import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const TSSChart = ({ data }) => {
    const { isIOS } = useStyle();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="p-3 rounded shadow-lg border text-sm"
                    style={{
                        backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : designTokens.theme.colors.bg.card,
                        borderColor: isIOS ? iosTheme.theme.colors.glass.border : designTokens.theme.colors.bg.secondary,
                        color: isIOS ? iosTheme.theme.colors.text.primary : designTokens.theme.colors.text.primary,
                        backdropFilter: isIOS ? 'blur(12px)' : 'none',
                        borderRadius: isIOS ? '12px' : '4px'
                    }}
                >
                    <p className="font-bold mb-1">{label}</p>
                    <p style={{ color: isIOS ? iosTheme.theme.colors.charts.strain.primary : designTokens.theme.colors.brand.strainBlue }}>
                        TSS: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    const strokeColor = isIOS ? iosTheme.theme.colors.charts.strain.primary : '#00E6C8';
    const gridColor = isIOS ? 'rgba(168, 216, 234, 0.2)' : designTokens.theme.colors.bg.secondary;
    const textColor = isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={isIOS ? "colorTssIOS" : "colorTss"} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={isIOS ? 0.4 : 0.3} />
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: textColor, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fill: textColor, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="tss"
                        stroke={strokeColor}
                        fillOpacity={1}
                        fill={isIOS ? "url(#colorTssIOS)" : "url(#colorTss)"}
                        strokeWidth={isIOS ? 3 : 2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TSSChart;
