import React from 'react';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const EnduranceGauge = ({ data }) => {
    const { isIOS } = useStyle();

    // data: { score: 6452, classification: "Well Trained", classification_num: 4 }

    // Garmin Endurance Categories (Official)
    const categories = isIOS ? [
        { label: 'Recreational', min: 0, max: 5000, color: iosTheme.theme.colors.charts.endurance.recreational },
        { label: 'Intermediate', min: 5000, max: 5700, color: iosTheme.theme.colors.charts.endurance.intermediate },
        { label: 'Trained', min: 5700, max: 6400, color: iosTheme.theme.colors.charts.endurance.trained },
        { label: 'Well Trained', min: 6400, max: 7000, color: iosTheme.theme.colors.charts.endurance.wellTrained },
        { label: 'Expert', min: 7000, max: 7700, color: iosTheme.theme.colors.charts.endurance.expert },
        { label: 'Superior', min: 7700, max: 8400, color: iosTheme.theme.colors.charts.endurance.superior },
        { label: 'Elite', min: 8400, max: 10000, color: iosTheme.theme.colors.charts.endurance.elite }
    ] : [
        { label: 'Recreational', min: 0, max: 5000, color: '#ef4444' },      // Red
        { label: 'Intermediate', min: 5000, max: 5700, color: '#f97316' },   // Orange
        { label: 'Trained', min: 5700, max: 6400, color: '#eab308' },        // Yellow
        { label: 'Well Trained', min: 6400, max: 7000, color: '#84cc16' },   // Lime
        { label: 'Expert', min: 7000, max: 7700, color: '#22c55e' },         // Green
        { label: 'Superior', min: 7700, max: 8400, color: '#3b82f6' },       // Blue
        { label: 'Elite', min: 8400, max: 10000, color: '#a855f7' }          // Purple
    ];

    const score = data?.score || 0;
    const maxScore = 10000;

    // Calculate position percentage
    const percentage = Math.min((score / maxScore) * 100, 100);

    return (
        <div className="w-full">
            {/* Current Score Display */}
            <div className="mb-4 text-center">
                <div
                    className="text-4xl font-bold"
                    style={{
                        color: isIOS ? iosTheme.theme.colors.text.primary : designTokens.theme.colors.text.primary,
                        fontFamily: isIOS ? iosTheme.theme.typography.fontFamily : 'inherit'
                    }}
                >
                    {score.toLocaleString()}
                </div>
                <div
                    className="text-sm mt-1"
                    style={{ color: isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary }}
                >
                    {data?.classification || 'Unknown'}
                </div>
            </div>

            {/* Gauge Bar */}
            <div
                className="relative w-full h-12 overflow-hidden"
                style={{
                    backgroundColor: isIOS ? 'rgba(255, 255, 255, 0.3)' : designTokens.theme.colors.bg.secondary,
                    borderRadius: isIOS ? '16px' : '9999px',
                    backdropFilter: isIOS ? 'blur(8px)' : 'none',
                    border: isIOS ? '1px solid rgba(255, 255, 255, 0.5)' : 'none',
                    boxShadow: isIOS ? '0 4px 16px rgba(31, 38, 135, 0.1)' : 'none'
                }}
            >
                {/* Category Segments */}
                <div className="absolute inset-0 flex">
                    {categories.map((cat, idx) => {
                        const segmentWidth = ((cat.max - cat.min) / maxScore) * 100;
                        return (
                            <div
                                key={idx}
                                className="h-full flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-80"
                                style={{
                                    width: `${segmentWidth}%`,
                                    backgroundColor: cat.color,
                                    color: isIOS ? '#2c3e50' : 'white',
                                    textShadow: isIOS ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
                                    opacity: isIOS ? 0.85 : 1
                                }}
                            >
                                {segmentWidth > 10 && cat.label}
                            </div>
                        );
                    })}
                </div>

                {/* Indicator Needle */}
                <div
                    className="absolute top-0 bottom-0 transition-all duration-500"
                    style={{
                        left: `${percentage}%`,
                        transform: 'translateX(-50%)',
                        width: isIOS ? '3px' : '4px',
                        backgroundColor: isIOS ? '#2c3e50' : 'white',
                        boxShadow: isIOS ? '0 0 12px rgba(44, 62, 80, 0.6)' : '0 0 10px rgba(255,255,255,0.8)',
                        borderRadius: isIOS ? '2px' : '0'
                    }}
                >
                    {/* Arrow/Triangle at top */}
                    <div
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: isIOS ? '8px solid #2c3e50' : '8px solid white',
                            filter: isIOS ? 'drop-shadow(0 2px 4px rgba(44, 62, 80, 0.3))' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* Category Labels Below */}
            <div
                className="flex justify-between mt-2 text-xs"
                style={{ color: isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary }}
            >
                <span>0</span>
                <span>{(maxScore / 2).toLocaleString()}</span>
                <span>{maxScore.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default EnduranceGauge;
