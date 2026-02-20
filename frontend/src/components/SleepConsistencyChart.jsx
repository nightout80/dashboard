import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const SleepConsistencyChart = ({ data }) => {
    const { isIOS } = useStyle();
    // Process data to format times as continuous values for chart
    // e.g. Bedtime 23:00 -> -1.0, 01:00 -> 1.0 (relative to midnight)
    // OR simpler: just plot duration start/end on a 24h axis (18:00 to 12:00 next day)

    // Simplification for MVP: Plot Bedtime and Wake Time on separate lines or as a range bar
    // Recharts doesn't do Range Bar easily without custom shapes.
    // Let's try a simple Line Chart showing Bedtime (hour) and Wake Time (hour)

    const processedData = data.map(d => {
        let bed = null;
        let wake = null;

        if (d.bed_time) {
            const [h, m] = String(d.bed_time).split(':').map(Number);
            // Normalize to "hours after 6 PM (18:00)"
            // 18:00 = 0, 24:00 = 6, 02:00 = 8
            let val = h + m / 60.0;
            if (val < 18) val += 24; // next day
            bed = val;
        }

        if (d.wake_time) {
            const [h, m] = String(d.wake_time).split(':').map(Number);
            // Normalize to same scale
            let val = h + m / 60.0;
            if (val < 18) val += 24;
            wake = val;
        }

        return {
            ...d,
            bed_val: bed,
            wake_val: wake,
            duration: wake && bed ? (wake - bed).toFixed(1) : 0
        };
    }).filter(d => d.bed_val && d.wake_val);

    const formatHour = (val) => {
        if (!val) return '';
        let h = Math.floor(val);
        if (h >= 24) h -= 24;
        return `${h}:00`;
    };

    const bedColor = isIOS ? iosTheme.theme.colors.charts.sleep.primary : '#00E6C8';
    const wakeColor = isIOS ? iosTheme.theme.colors.charts.sleep.secondary : '#34C759';
    const gridColor = isIOS ? 'rgba(197, 185, 230, 0.2)' : 'rgba(0, 230, 200, 0.08)';
    const textColor = isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary;

    return (
        <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date_label" tick={{ fill: textColor, fontSize: 10 }} minTickGap={30} />
                <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={formatHour}
                    tick={{ fill: textColor, fontSize: 10 }}
                    label={{ value: 'Time', angle: -90, position: 'insideLeft', fill: textColor }}
                />
                <Tooltip
                    content={({ payload, label }) => {
                        if (payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div
                                    className="p-2 rounded text-xs"
                                    style={{
                                        backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : '#1f2937',
                                        border: isIOS ? `1px solid ${iosTheme.theme.colors.glass.border}` : '1px solid #374151',
                                        color: isIOS ? iosTheme.theme.colors.text.primary : 'white',
                                        backdropFilter: isIOS ? 'blur(12px)' : 'none',
                                        borderRadius: isIOS ? '8px' : '4px'
                                    }}
                                >
                                    <p>Date: {label}</p>
                                    <p>Bed: {data.bed_time}</p>
                                    <p>Wake: {data.wake_time}</p>
                                    <p>Sleep: {data.duration}h</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                {/* Visualizing Sleep Window as a Bar from Bed to Wake? 
                    Recharts standard Bar doesn't support [min, max] natively easily. 
                    Using Line for Bed and Wake is clearer for consistency. 
                */}
                <Line type="monotone" dataKey="bed_val" stroke={bedColor} name="Bedtime" dot={false} strokeWidth={isIOS ? 3 : 2} />
                <Line type="monotone" dataKey="wake_val" stroke={wakeColor} name="Wake Time" dot={false} strokeWidth={isIOS ? 3 : 2} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default SleepConsistencyChart;
