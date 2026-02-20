import React from 'react';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const RecoveryGauge = ({ value }) => {
    const { isIOS } = useStyle();

    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    let color;
    if (isIOS) {
        if (value >= 66) color = iosTheme.theme.colors.charts.recovery.high;
        else if (value >= 33) color = iosTheme.theme.colors.charts.recovery.medium;
        else color = iosTheme.theme.colors.charts.recovery.low;
    } else {
        if (value >= 66) color = designTokens.theme.colors.brand.recoveryGreen;
        else if (value >= 33) color = designTokens.theme.colors.brand.recoveryYellow;
        else color = designTokens.theme.colors.brand.whoopRed;
    }

    return (
        <div className="relative flex items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90 origin-center"
                style={{
                    filter: isIOS ? 'drop-shadow(0 4px 8px rgba(31, 38, 135, 0.15))' : 'none'
                }}
            >
                <circle
                    stroke={isIOS ? 'rgba(255, 255, 255, 0.4)' : designTokens.theme.colors.bg.secondary}
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="opacity-50"
                />
                <circle
                    stroke={color}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute text-center">
                <div
                    className="text-3xl font-bold"
                    style={{
                        color: color,
                        fontFamily: isIOS ? iosTheme.theme.typography.fontFamily : 'inherit'
                    }}
                >
                    {value}%
                </div>
            </div>
        </div>
    );
};

export default RecoveryGauge;
