import React from 'react';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const ActivityHeatmap = ({ data }) => {
    const { isIOS } = useStyle();

    // Determine color based on TSS
    const getColor = (tss) => {
        if (isIOS) {
            if (!tss || tss === 0) return iosTheme.theme.colors.charts.heatmap.low;
            if (tss < 30) return 'rgba(168, 216, 234, 0.3)';
            if (tss < 60) return 'rgba(168, 216, 234, 0.6)';
            if (tss < 100) return iosTheme.theme.colors.charts.heatmap.medium;
            return iosTheme.theme.colors.charts.heatmap.high;
        } else {
            if (!tss || tss === 0) return '#1a1a1a';
            if (tss < 30) return 'rgba(0, 230, 200, 0.25)';
            if (tss < 60) return 'rgba(0, 230, 200, 0.55)';
            if (tss < 100) return '#00E6C8';
            return '#34C759';
        }
    };

    const legendColors = isIOS ? [
        iosTheme.theme.colors.charts.heatmap.low,
        'rgba(168, 216, 234, 0.4)',
        iosTheme.theme.colors.charts.heatmap.medium,
        iosTheme.theme.colors.charts.heatmap.high
    ] : [
        '#1a1a1a',
        'rgba(0, 230, 200, 0.25)',
        '#00E6C8',
        '#34C759'
    ];

    return (
        <div>
            <div className="flex flex-wrap gap-1">
                {data.map((day, idx) => (
                    <div
                        key={idx}
                        className="w-3 h-3 rounded-sm cursor-pointer hover:border relative group"
                        style={{
                            backgroundColor: getColor(day.tss),
                            borderColor: isIOS ? 'rgba(168, 216, 234, 0.8)' : 'white',
                            boxShadow: isIOS ? '0 1px 3px rgba(31, 38, 135, 0.1)' : 'none'
                        }}
                    >
                        <div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs p-2 rounded z-10 whitespace-nowrap"
                            style={{
                                backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : '#111827',
                                border: isIOS ? `1px solid ${iosTheme.theme.colors.glass.border}` : '1px solid #374151',
                                color: isIOS ? iosTheme.theme.colors.text.primary : 'white',
                                backdropFilter: isIOS ? 'blur(12px)' : 'none',
                                borderRadius: isIOS ? '8px' : '4px'
                            }}
                        >
                            {day.date_label}: TSS {day.tss}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="flex items-center gap-2 mt-2 text-xs"
                style={{ color: isIOS ? iosTheme.theme.colors.text.secondary : '#9ca3af' }}
            >
                <span>Less</span>
                {legendColors.map((color, idx) => (
                    <div
                        key={idx}
                        className="w-3 h-3 rounded-sm"
                        style={{
                            backgroundColor: color,
                            boxShadow: isIOS ? '0 1px 3px rgba(31, 38, 135, 0.1)' : 'none'
                        }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
