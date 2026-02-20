import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import designTokens from '../../../design_tokens.json';

const EnduranceChart = ({ data }) => {
    // data: [{name: 'Well Trained', value: 10}, ...]

    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'
    ];

    // Map specific categories to specific colors if we knew them
    // E.g. "Elite" -> Gold, "Untrained" -> Gray

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 rounded border text-xs" style={{
                    backgroundColor: designTokens.theme.colors.bg.card,
                    borderColor: designTokens.theme.colors.bg.secondary,
                    color: designTokens.theme.colors.text.primary
                }}>
                    <p>{`${payload[0].name} : ${payload[0].value} days`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '12px', color: '#ccc' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EnduranceChart;
