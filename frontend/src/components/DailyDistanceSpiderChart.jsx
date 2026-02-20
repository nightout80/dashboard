import React from 'react';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const CustomTooltip = ({ active, payload, label, isIOS }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : 'rgba(18, 24, 38, 0.95)',
                border: `1px solid rgba(0, 230, 200, 0.3)`,
                borderRadius: '10px',
                padding: '10px 14px',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                fontSize: '13px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}>
                <p style={{ fontWeight: 700, marginBottom: 6, color: '#a1a1a6' }}>{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color, margin: '2px 0' }}>
                        <span style={{ fontWeight: 600 }}>{entry.name}:</span>{' '}
                        {entry.value != null ? `${entry.value} km` : '—'}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CustomTick = ({ payload, x, y, cx, cy }) => {
    const isRight = x > cx;
    const isTop = y < cy;
    return (
        <text
            x={x} y={y}
            textAnchor={Math.abs(x - cx) < 10 ? 'middle' : isRight ? 'start' : 'end'}
            dominantBaseline={isTop ? 'auto' : 'hanging'}
            fill="#a1a1a6"
            fontSize={11}
            fontWeight={600}
            dy={isTop ? -4 : 4}
            dx={Math.abs(x - cx) < 10 ? 0 : isRight ? 4 : -4}
        >
            {payload.value}
        </text>
    );
};

const DailyDistanceSpiderChart = ({ data }) => {
    const { isIOS } = useStyle();

    if (!data || data.length === 0) {
        return <div style={{ color: designTokens.theme.colors.text.muted, padding: '16px' }}>Keine Tagesdaten verfügbar.</div>;
    }

    const tealColor = '#00E6C8';
    const greenColor = '#34C759';

    return (
        <div style={{ width: '100%', height: 380, position: 'relative' }}>
            {/* Glow blob */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 280, height: 280, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(52,199,89,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} margin={{ top: 20, right: 70, bottom: 20, left: 70 }}>
                    <defs>
                        <filter id="tealGlowDaily" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="greenGlowDaily" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <PolarGrid gridType="polygon" stroke="rgba(0,230,200,0.12)" strokeWidth={1} />
                    <PolarAngleAxis dataKey="day_label" tick={<CustomTick />} />
                    <PolarRadiusAxis
                        angle={90}
                        tick={{ fill: '#636366', fontSize: 10 }}
                        axisLine={false} tickLine={false} tickCount={4}
                        domain={[0, 'auto']}
                    />
                    <Radar
                        name="Geplant (km)" dataKey="planned_km"
                        stroke={tealColor} fill={tealColor} fillOpacity={0.12} strokeWidth={2}
                        dot={{ r: 4, fill: tealColor, strokeWidth: 0, filter: 'url(#tealGlowDaily)' }}
                        activeDot={{ r: 6, fill: tealColor, strokeWidth: 2, stroke: '#fff' }}
                        filter="url(#tealGlowDaily)"
                    />
                    <Radar
                        name="Gelaufen (km)" dataKey="actual_km"
                        stroke={greenColor} fill={greenColor} fillOpacity={0.18} strokeWidth={2}
                        dot={{ r: 4, fill: greenColor, strokeWidth: 0, filter: 'url(#greenGlowDaily)' }}
                        activeDot={{ r: 6, fill: greenColor, strokeWidth: 2, stroke: '#fff' }}
                        filter="url(#greenGlowDaily)"
                    />
                    <Tooltip content={<CustomTooltip isIOS={isIOS} />} />
                    <Legend
                        iconType="circle" iconSize={8}
                        wrapperStyle={{ paddingTop: '12px', fontSize: '13px', color: '#a1a1a6' }}
                        formatter={(value, entry) => <span style={{ color: entry.color, fontWeight: 600 }}>{value}</span>}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyDistanceSpiderChart;
