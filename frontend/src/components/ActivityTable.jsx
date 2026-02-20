import React from 'react';
import designTokens from '../../../design_tokens.json';

const ActivityTable = ({ activities }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm" style={{ color: designTokens.theme.colors.text.secondary }}>
                <thead>
                    <tr className="border-b" style={{ borderColor: designTokens.theme.colors.bg.secondary }}>
                        <th className="py-2 px-4 whitespace-nowrap">Date</th>
                        <th className="py-2 px-4 whitespace-nowrap">Type</th>
                        <th className="py-2 px-4 whitespace-nowrap">Duration</th>
                        <th className="py-2 px-4 whitespace-nowrap">TSS</th>
                        <th className="py-2 px-4 whitespace-nowrap">Dist (km)</th>
                        <th className="py-2 px-4 whitespace-nowrap">Elev (m)</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((act, index) => (
                        <tr key={index} className="border-b last:border-0 hover:opacity-80 transition-opacity" style={{ borderColor: designTokens.theme.colors.bg.secondary }}>
                            <td className="py-3 px-4 whitespace-nowrap font-medium" style={{ color: designTokens.theme.colors.text.primary }}>{act.date}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{act.type}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{act.duration}</td>
                            <td className="py-3 px-4 whitespace-nowrap font-bold" style={{ color: designTokens.theme.colors.brand.strainBlue }}>{act.tss}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{act.distance}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{act.elevation}</td>
                        </tr>
                    ))}
                    {activities.length === 0 && (
                        <tr>
                            <td colSpan="6" className="py-4 text-center">No activities in the last 7 days.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityTable;
