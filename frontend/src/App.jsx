import React, { useEffect, useState } from 'react'
import designTokens from '../../design_tokens.json'
import iosTheme from '../../ios_theme.json'
import { useStyle } from './context/StyleContext'
import RecoveryGauge from './components/RecoveryGauge'
import ActivityTable from './components/ActivityTable'
import TSSChart from './components/TSSChart'
import WorkRestChart from './components/WorkRestChart'
import SleepConsistencyChart from './components/SleepConsistencyChart'
import ActivityHeatmap from './components/ActivityHeatmap'
import EnduranceGauge from './components/EnduranceGauge'
import HRVTrendChart from './components/HRVTrendChart'
import StyleToggle from './components/StyleToggle'
import DistanceSpiderChart from './components/DistanceSpiderChart'
import DailyDistanceSpiderChart from './components/DailyDistanceSpiderChart'

// Simple Error Boundary
// ... (ErrorBoundary code remains same) ...
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen p-8 text-white bg-red-900 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-black p-4 rounded text-red-200 font-mono text-sm max-w-2xl overflow-auto">
                        {this.state.error && this.state.error.toString()}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function InnerApp({ data, onRefresh, isRefreshing }) {
    const { vitals, strain, plan, recommendation, recent_activities, tss_chart_data, history, endurance, hrv_history, weekly_distance_comparison, daily_distance_comparison } = data
    const { isIOS } = useStyle();

    // Prepare Chart Data
    // ... (chartData logic remains same) ...
    const chartData = tss_chart_data ? tss_chart_data.map(d => {
        try {
            if (d.date && d.date.includes('.')) {
                return {
                    date: d.date.split('.')[0] + '.' + d.date.split('.')[1],
                    tss: d.tss
                };
            }
            return { date: d.date || '?', tss: d.tss || 0 };
        } catch (e) {
            console.error("Error formatting chart data", d, e);
            return { date: '?', tss: 0 };
        }
    }) : [];

    return (
        <div
            className={isIOS ? 'ios-bg min-h-screen p-8 overflow-hidden' : 'min-h-screen p-8 text-white overflow-hidden'}
            style={{
                backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.primary,
                color: isIOS ? iosTheme.theme.colors.text.primary : 'white'
            }}
        >
            <header className="mb-8 flex justify-between items-center">
                {/* ... Header content ... */}
                <div>
                    <h1
                        className="text-3xl font-bold"
                        style={{
                            color: isIOS ? iosTheme.theme.colors.text.primary : designTokens.theme.colors.text.primary,
                            fontFamily: isIOS ? iosTheme.theme.typography.fontFamily : 'inherit'
                        }}
                    >
                        Whoop-Style Dashboard
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p style={{ color: isIOS ? iosTheme.theme.colors.text.secondary : designTokens.theme.colors.text.secondary }}>
                            {data.date ? new Date(data.date).toLocaleDateString() : 'Date error'}
                        </p>
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-700 transition"
                            style={{
                                backgroundColor: isIOS ? iosTheme.theme.colors.glass.background : designTokens.theme.colors.bg.secondary,
                                color: isIOS ? iosTheme.theme.colors.text.primary : designTokens.theme.colors.text.primary,
                                opacity: isRefreshing ? 0.7 : 1,
                                backdropFilter: isIOS ? 'blur(12px)' : 'none',
                                border: isIOS ? `1px solid ${iosTheme.theme.colors.glass.border}` : 'none'
                            }}
                        >
                            {isRefreshing ? (
                                <>
                                    <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                                    Updating...
                                </>
                            ) : (
                                'Refresh Data'
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <StyleToggle />
                </div>
            </header>

            {/* Top Row: Cards */}
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* ... Recovery, Strain, Plan Cards ... */}
                {/* Recovery Card */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 md:col-span-2 flex items-center justify-between' : 'p-6 rounded-xl col-span-1 md:col-span-2 flex items-center justify-between'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <div className="flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-4">Recovery</h2>
                        <div className="grid grid-cols-3 gap-6 text-sm text-gray-400">
                            <div>
                                <div className="mb-1">HRV</div>
                                <div className="text-white font-bold text-lg">{vitals?.hrv?.value || '-'} ms</div>
                                <div className="text-xs flex flex-col mt-1">
                                    <span className={vitals?.hrv?.change >= 0 ? "text-green-500" : "text-red-500"}>
                                        {vitals?.hrv?.change > 0 ? '▲' : vitals?.hrv?.change < 0 ? '▼' : ''} {Math.abs(vitals?.hrv?.change || 0)}%
                                    </span>
                                    <span className="text-white text-sm mt-1">Ø {vitals?.hrv?.avg_7d}</span>
                                </div>
                            </div>
                            <div>
                                <div className="mb-1">RHR</div>
                                <div className="text-white font-bold text-lg">{vitals?.rhr?.value || '-'} bpm</div>
                                <div className="text-xs flex flex-col mt-1">
                                    <span className={vitals?.rhr?.change <= 0 ? "text-green-500" : "text-red-500"}>
                                        {vitals?.rhr?.change > 0 ? '▲' : vitals?.rhr?.change < 0 ? '▼' : ''} {Math.abs(vitals?.rhr?.change || 0)}%
                                    </span>
                                    <span className="text-white text-sm mt-1">Ø {vitals?.rhr?.avg_7d}</span>
                                </div>
                            </div>
                            <div>
                                <div className="mb-1">Sleep Score</div>
                                <div className="text-white font-bold text-lg">{vitals?.sleep_score?.value || '-'}%</div>
                                <div className="text-xs flex flex-col mt-1">
                                    <span className={vitals?.sleep_score?.change >= 0 ? "text-green-500" : "text-red-500"}>
                                        {vitals?.sleep_score?.change > 0 ? '▲' : vitals?.sleep_score?.change < 0 ? '▼' : ''} {Math.abs(vitals?.sleep_score?.change || 0)}%
                                    </span>
                                    <span className="text-white text-sm mt-1">Ø {vitals?.sleep_score?.avg_7d}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <RecoveryGauge value={vitals?.recovery_score || 0} />
                    </div>
                </div>

                {/* Strain Card */}
                <div
                    className={isIOS ? 'glass-card p-6 relative overflow-hidden' : 'p-6 rounded-xl relative overflow-hidden'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h2 className="text-xl font-bold mb-2">Training Stress Score</h2>
                    <div className="text-5xl font-bold mb-1" style={{ color: designTokens.theme.colors.brand.strainBlue }}>
                        {strain?.today || 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        7d Load: {strain?.load_7d || 0}
                    </div>
                    <div className="absolute -bottom-4 -right-4 opacity-10 text-9xl font-bold" style={{ color: designTokens.theme.colors.brand.strainBlue }}>
                        {Math.round(strain?.today || 0)}
                    </div>
                </div>

                {/* Plan Card */}
                <div
                    className={isIOS ? 'glass-card p-6' : 'p-6 rounded-xl'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h2 className="text-xl font-bold mb-2">Today's Plan</h2>
                    <div className="text-lg font-bold">
                        {plan ? `${plan['Session'] || 'Unknown'}` : 'Rest Day'}
                    </div>
                    <p className="text-sm mt-4 text-gray-300 italic">
                        "{recommendation?.text || ''}"
                    </p>
                </div>
            </main>

            {/* Second Row: Detailed Data */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div
                    className={isIOS ? 'glass-card p-6' : 'p-6 rounded-xl'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>Last 21 Days</h3>
                    <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
                        <ActivityTable activities={recent_activities || []} />
                    </div>
                </div>
                <div
                    className={isIOS ? 'glass-card p-6' : 'p-6 rounded-xl'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>TSS Trend (7d)</h3>
                    <div className="w-full h-full min-h-[300px]">
                        <TSSChart data={chartData} />
                    </div>
                </div>
            </section>

            {/* Third Row: Advanced Visualizations (New!) */}
            <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: designTokens.theme.colors.text.primary }}>Performance Analytics</h2>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Spider Chart: Planned vs Actual Distance */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 lg:col-span-1' : 'p-6 rounded-xl col-span-1 lg:col-span-1'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-1" style={{ color: designTokens.theme.colors.text.secondary }}>Geplant vs. Gelaufen</h3>
                    <p className="text-xs mb-4" style={{ color: designTokens.theme.colors.text.muted }}>Wöchentliche Distanz (km)</p>
                    <DistanceSpiderChart data={weekly_distance_comparison || []} />
                </div>
                {/* Daily Spider Chart: Today's Plan vs Actual */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 lg:col-span-1' : 'p-6 rounded-xl col-span-1 lg:col-span-1'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-1" style={{ color: designTokens.theme.colors.text.secondary }}>Tagesplan vs. Gelaufen</h3>
                    <p className="text-xs mb-4" style={{ color: designTokens.theme.colors.text.muted }}>Letzte 7 Tage (km)</p>
                    <DailyDistanceSpiderChart data={daily_distance_comparison || []} />
                </div>
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 lg:col-span-2' : 'p-6 rounded-xl col-span-1 lg:col-span-2'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>Work / Rest Ratio (90 Days)</h3>
                    {history && history.length > 0 ? (
                        <WorkRestChart data={history} />
                    ) : (
                        <div className="text-gray-500">Not enough history data.</div>
                    )}
                </div>
                {/* Sleep */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1' : 'p-6 rounded-xl col-span-1'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>Sleep Consistency</h3>
                    {history && history.length > 0 ? (
                        <SleepConsistencyChart data={history} />
                    ) : (
                        <div className="text-gray-500">Not enough sleep data.</div>
                    )}
                </div>
                {/* Heatmap */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 lg:col-span-3' : 'p-6 rounded-xl col-span-1 lg:col-span-3'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>Activity Heatmap (TSS)</h3>
                    {history && history.length > 0 ? (
                        <ActivityHeatmap data={history} />
                    ) : (
                        <div className="text-gray-500">Not enough data.</div>
                    )}
                </div>
            </section>

            {/* Fourth Row: Training Status & Endurance (New!) */}
            <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: designTokens.theme.colors.text.primary }}>Training Status & Endurance</h2>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* HRV Trend */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1 lg:col-span-2' : 'p-6 rounded-xl col-span-1 lg:col-span-2'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>HRV Trend (90d vs Baseline)</h3>
                    {hrv_history && hrv_history.length > 0 ? (
                        <HRVTrendChart data={hrv_history} />
                    ) : (
                        <div className="text-gray-500">Not enough HRV data.</div>
                    )}
                </div>

                {/* Endurance Distribution */}
                <div
                    className={isIOS ? 'glass-card p-6 col-span-1' : 'p-6 rounded-xl col-span-1'}
                    style={{ backgroundColor: isIOS ? 'transparent' : designTokens.theme.colors.bg.card }}
                >
                    <h3 className="text-lg font-bold mb-4" style={{ color: designTokens.theme.colors.text.secondary }}>Endurance Score</h3>
                    {endurance && endurance.score ? (
                        <EnduranceGauge data={endurance} />
                    ) : (
                        <div className="text-gray-500">Not enough Endurance data.</div>
                    )}
                </div>

            </section>

        </div>
    )
}

function App() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchData = async () => {
        try {
            if (!data) setLoading(true); // Only show full loading on first load
            const res = await fetch('/dashboard');
            const json = await res.json();
            console.log("Dashboard Data:", json);
            setData(json);
        } catch (err) {
            console.error("Fetch Error:", err);
            // Optionally set data.error if strict
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8 text-white flex items-center justify-center" style={{ backgroundColor: designTokens.theme.colors.bg.primary }}>
                Loading Dashboard Data...
            </div>
        )
    }

    if (!data || data.error) {
        return (
            <div className="min-h-screen p-8 text-white flex flex-col items-center justify-center" style={{ backgroundColor: designTokens.theme.colors.bg.primary }}>
                <p className="mb-4">{data?.error ? `Error: ${data.error}` : 'Unknown Error'}</p>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <InnerApp
                data={data}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
        </ErrorBoundary>
    )
}

export default App


