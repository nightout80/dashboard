import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ComposedChart,
    ErrorBar,
    Scatter,
} from 'recharts';
import designTokens from '../../../design_tokens.json';
import iosTheme from '../../../ios_theme.json';
import { useStyle } from '../context/StyleContext';

const BoxplotChart = () => {
    const { isIOS } = useStyle();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters & Selectors
    const [metric, setMetric] = useState('pace');
    const [segmentation, setSegmentation] = useState('week');
    const [runType, setRunType] = useState('all');
    const [sportType, setSportType] = useState('all');
    const [startDate, setStartDate] = useState('2026-01-01');
    const [endDate, setEndDate] = useState('');

    const [availableRunTypes, setAvailableRunTypes] = useState([]);
    const [availableSportTypes, setAvailableSportTypes] = useState([]);

    const fetchBoxplotData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                metric,
                segmentation,
                runType,
                sportType,
            });
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const res = await fetch(`/api/boxplot?${params.toString()}`);

            if (!res.ok) {
                const text = await res.text();
                const errorMsg = `Server returned ${res.status}: ${text.substring(0, 50)}...`;
                console.error(errorMsg);
                setError(errorMsg);
                setLoading(false);
                return;
            }

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Non-JSON response received:", text.substring(0, 100));
                setError(`Expected JSON, but got: ${text.substring(0, 50)}...`);
                setLoading(false);
                return;
            }

            const json = await res.json();

            if (json.error) {
                setError(json.error);
            } else {
                setData(json.data || []);
                setAvailableRunTypes(json.available_run_types || []);
                setAvailableSportTypes(json.available_sport_types || []);
                setError(null);
            }
        } catch (err) {
            setError(`Network Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoxplotData();
    }, [metric, segmentation, runType, sportType, startDate, endDate]);

    const formatPace = (seconds) => {
        if (!seconds) return '—';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatYAxis = (val) => {
        if (metric === 'pace') return formatPace(val);
        return val;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div
                    style={{
                        backgroundColor: isIOS
                            ? iosTheme.theme.colors.glass.background
                            : 'rgba(18, 24, 38, 0.95)',
                        border: `1px solid rgba(0, 230, 200, 0.3)`,
                        borderRadius: '10px',
                        padding: '12px',
                        backdropFilter: 'blur(12px)',
                        color: '#fff',
                        fontSize: '13px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                    }}
                >
                    <p style={{ fontWeight: 700, marginBottom: 8, color: '#a1a1a6' }}>{item.label}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <span>Max:</span> <span style={{ textAlign: 'right', fontWeight: 600 }}>{metric === 'pace' ? formatPace(item.max) : item.max.toFixed(1)}</span>
                        <span>Q3 (75%):</span> <span style={{ textAlign: 'right', fontWeight: 600 }}>{metric === 'pace' ? formatPace(item.q3) : item.q3.toFixed(1)}</span>
                        <span>Median:</span> <span style={{ textAlign: 'right', fontWeight: 700, color: '#00E6C8' }}>{metric === 'pace' ? formatPace(item.median) : item.median.toFixed(1)}</span>
                        <span>Q1 (25%):</span> <span style={{ textAlign: 'right', fontWeight: 600 }}>{metric === 'pace' ? formatPace(item.q1) : item.q1.toFixed(1)}</span>
                        <span>Min:</span> <span style={{ textAlign: 'right', fontWeight: 600 }}>{metric === 'pace' ? formatPace(item.min) : item.min.toFixed(1)}</span>
                        <span style={{ marginTop: 4, color: '#a1a1a6' }}>Count:</span> <span style={{ marginTop: 4, textAlign: 'right', color: '#a1a1a6' }}>{item.count}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Prepare data for Recharts implementation of boxplot
    // We use a stacked bar chart + error bars
    // BoxBase: Q1
    // BoxHeight: Q3 - Q1
    const preparedData = data.map(d => ({
        ...d,
        boxBase: d.q1,
        boxHeight: d.q3 - d.q1,
        iqr: d.q3 - d.q1,
        // For Recharts ErrorBar, we need the plus/minus from the data point
        upperWhisker: d.max - d.q3,
        lowerWhisker: d.q1 - d.min
    }));

    const primaryColor = '#00E6C8';
    const secondaryColor = 'rgba(0, 230, 200, 0.2)';
    const gridColor = isIOS ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Metric</label>
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    >
                        <option value="pace">Pace</option>
                        <option value="hr">Avg Heartrate</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Segmentation</label>
                    <select
                        value={segmentation}
                        onChange={(e) => setSegmentation(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    >
                        <option value="week">Week</option>
                        <option value="run_type">Run Type</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Run Type</label>
                    <select
                        value={runType}
                        onChange={(e) => setRunType(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    >
                        <option value="all">All Types</option>
                        {availableRunTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Sport</label>
                    <select
                        value={sportType}
                        onChange={(e) => setSportType(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    >
                        <option value="all">All Sports</option>
                        {availableSportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">From</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">To</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-800 text-white rounded p-2 text-sm border border-gray-700"
                        style={{ backgroundColor: isIOS ? 'rgba(255,255,255,0.1)' : 'rgb(31, 41, 55)' }}
                    />
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ width: '100%', height: 400, position: 'relative' }}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10 backdrop-blur-sm rounded-xl">
                        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold z-10">
                        Error: {error}
                    </div>
                )}
                {!loading && data.length === 0 && !error && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold z-10">
                        No data found for the selected filters.
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={preparedData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1a6', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1a6', fontSize: 11 }}
                            tickFormatter={formatYAxis}
                            reversed={metric === 'pace'} // Lower pace is better/faster
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                        {/* Whiskers (Lower) */}
                        <Scatter dataKey="q1">
                            <ErrorBar dataKey="lowerWhisker" direction="y" stroke={primaryColor} strokeWidth={2} width={10} />
                        </Scatter>

                        {/* Whiskers (Upper) */}
                        <Scatter dataKey="q3">
                            <ErrorBar dataKey="upperWhisker" direction="y" stroke={primaryColor} strokeWidth={2} width={10} />
                        </Scatter>

                        {/* IQR Box */}
                        {/* We use a Bar with custom shape or just Bar with start index?
                            Actually, we can use a stacked bar with the first one transparent.
                        */}
                        <Bar dataKey="boxBase" stackId="box" fill="transparent" />
                        <Bar dataKey="boxHeight" stackId="box" fill={secondaryColor} stroke={primaryColor} strokeWidth={1}>
                            {preparedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={secondaryColor} stroke={primaryColor} />
                            ))}
                        </Bar>

                        {/* Median Line - Scatter point at median */}
                        <Scatter dataKey="median" fill={primaryColor}>
                            {preparedData.map((entry, index) => (
                                <Cell key={`median-${index}`} fill={primaryColor} />
                            ))}
                        </Scatter>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BoxplotChart;
