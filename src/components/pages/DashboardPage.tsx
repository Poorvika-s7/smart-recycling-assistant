import { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, Leaf, Recycle, Package, ArrowRight, Calendar } from 'lucide-react';
import { supabase, type Scan } from '@/lib/supabase';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about';

interface Props {
  onNavigate: (page: Page) => void;
}

interface DashboardStats {
  totalScans: number;
  totalCo2: number;
  totalDiverted: number;
  aiScans: number;
  fallbackScans: number;
  categoryBreakdown: Record<string, number>;
  recyclableCount: number;
  nonRecyclableCount: number;
  dependsCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Plastic: '#10b981',
  Paper: '#3b82f6',
  Cardboard: '#f59e0b',
  Glass: '#06b6d4',
  Metal: '#6366f1',
  'Electronic Waste': '#ef4444',
  'Organic Waste': '#84cc16',
  Textile: '#ec4899',
  'Hazardous Waste': '#7c2d12',
  Unknown: '#9ca3af',
};

export default function DashboardPage({ onNavigate }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoading(false);
        return;
      }

      const scans = (data ?? []) as Scan[];

      const categoryBreakdown: Record<string, number> = {};
      let totalCo2 = 0;
      let totalDiverted = 0;
      let aiScans = 0;
      let fallbackScans = 0;
      let recyclableCount = 0;
      let nonRecyclableCount = 0;
      let dependsCount = 0;

      for (const scan of scans) {
        categoryBreakdown[scan.category] = (categoryBreakdown[scan.category] || 0) + 1;
        totalCo2 += Number(scan.estimated_co2_saved_kg);
        totalDiverted += Number(scan.estimated_waste_diverted_kg);
        if (scan.analysis_mode === 'ai') aiScans++;
        else fallbackScans++;
        if (scan.recyclability === 'recyclable') recyclableCount++;
        else if (scan.recyclability === 'non-recyclable') nonRecyclableCount++;
        else dependsCount++;
      }

      setStats({
        totalScans: scans.length,
        totalCo2,
        totalDiverted,
        aiScans,
        fallbackScans,
        categoryBreakdown,
        recyclableCount,
        nonRecyclableCount,
        dependsCount,
      });
      setRecentScans(scans.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Recycle className="w-5 h-5 animate-spin" />
          Loading your impact data...
        </div>
      </div>
    );
  }

  if (!stats || stats.totalScans === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Eco Dashboard is empty</h1>
        <p className="text-gray-600 mb-6">
          Start scanning waste items to see your environmental impact here.
        </p>
        <button
          onClick={() => onNavigate('scanner')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-all"
        >
          Scan your first item
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...Object.values(stats.categoryBreakdown));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
          <BarChart3 className="w-4 h-4" />
          Eco Dashboard
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Environmental Impact</h1>
        <p className="mt-2 text-gray-600">
          Track your recycling activity and see the difference you're making.
        </p>
      </div>

      {/* Main stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Items Analyzed</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalScans}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">CO₂ Saved</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalCo2.toFixed(2)} <span className="text-lg text-gray-400">kg</span></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-sm text-gray-500">Waste Diverted</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalDiverted.toFixed(2)} <span className="text-lg text-gray-400">kg</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recyclability breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Recyclability Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Recyclable', count: stats.recyclableCount, color: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Depends on local rules', count: stats.dependsCount, color: 'bg-amber-500', text: 'text-amber-600' },
              { label: 'Not recyclable', count: stats.nonRecyclableCount, color: 'bg-red-500', text: 'text-red-600' },
            ].map((item) => {
              const pct = stats.totalScans > 0 ? (item.count / stats.totalScans) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-semibold ${item.text}`}>{item.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analysis mode breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Analysis Method</h2>
          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-blue-600">{stats.aiScans}</span>
              </div>
              <span className="text-sm text-gray-600">AI Analysis</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-gray-500">{stats.fallbackScans}</span>
              </div>
              <span className="text-sm text-gray-600">Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Waste Categories</h2>
        <div className="space-y-2.5">
          {Object.entries(stats.categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => {
              const pct = (count / maxCategoryCount) * 100;
              const color = CATEGORY_COLORS[category] || '#9ca3af';
              return (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32 flex-shrink-0 truncate">{category}</span>
                  <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center justify-end px-2"
                      style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
                    >
                      <span className="text-xs text-white font-semibold">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent scans */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {recentScans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[scan.category] || '#9ca3af' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{scan.item_name}</p>
                <p className="text-xs text-gray-500">{scan.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(scan.created_at).toLocaleDateString()}
                </p>
                {scan.estimated_co2_saved_kg > 0 && (
                  <p className="text-xs text-blue-600 font-medium">
                    {Number(scan.estimated_co2_saved_kg).toFixed(2)} kg CO₂
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-6 px-4">
        Environmental estimates are based on general assumptions about typical item weights and
        standard recycling efficiency rates. They are approximate and for educational purposes.
      </p>
    </div>
  );
}
