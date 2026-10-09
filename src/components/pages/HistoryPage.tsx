import { useEffect, useState, useCallback } from 'react';
import { History, Trash2, Recycle, Calendar, MapPin, Sparkles, Info, ArrowRight, Search } from 'lucide-react';
import { supabase, type Scan } from '@/lib/supabase';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about';

interface Props {
  onNavigate: (page: Page) => void;
}

const recyclabilityConfig = {
  recyclable: { label: 'Recyclable', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'non-recyclable': { label: 'Not Recyclable', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'depends-on-local-rules': { label: 'Depends on Local Rules', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export default function HistoryPage({ onNavigate }: Props) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchScans = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoading(false);
      return;
    }

    setScans((data ?? []) as Scan[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('scans').delete().eq('id', id);
    if (!error) {
      setScans((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const categories = ['all', ...Array.from(new Set(scans.map((s) => s.category)))];

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || scan.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Recycle className="w-5 h-5 animate-spin" />
          Loading your recycling history...
        </div>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No recycling history yet</h1>
        <p className="text-gray-600 mb-6">
          Your analyzed items will appear here so you can track your recycling journey over time.
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
          <History className="w-4 h-4" />
          Recycling History
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Scan History</h1>
        <p className="mt-2 text-gray-600">
          {scans.length} item{scans.length !== 1 ? 's' : ''} analyzed. Click any item to see full details.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items or categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm text-gray-900"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm text-gray-900 bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Scan list */}
      <div className="space-y-3">
        {filteredScans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No items match your search.</p>
          </div>
        ) : (
          filteredScans.map((scan) => {
            const isExpanded = expandedId === scan.id;
            const config = recyclabilityConfig[scan.recyclability] || recyclabilityConfig['depends-on-local-rules'];

            return (
              <div
                key={scan.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{scan.item_name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs text-gray-500">{scan.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border`}>
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                        {scan.location && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {scan.location}
                          </span>
                        )}
                        {scan.analysis_mode === 'ai' ? (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Knowledge Base
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(scan.id);
                      }}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {scan.estimated_co2_saved_kg > 0 && !isExpanded && (
                    <p className="text-xs text-blue-600 mt-2">
                      {Number(scan.estimated_co2_saved_kg).toFixed(2)} kg CO₂ saved
                    </p>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3 animate-slide-up">
                    {scan.disposal_instructions && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Disposal Instructions</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{scan.disposal_instructions}</p>
                      </div>
                    )}
                    {scan.reuse_ideas && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reuse Ideas</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{scan.reuse_ideas}</p>
                      </div>
                    )}
                    {scan.environmental_advice && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Environmental Advice</p>
                        <p className="text-sm text-gray-700">{scan.environmental_advice}</p>
                      </div>
                    )}
                    {scan.image_filename && (
                      <p className="text-xs text-gray-400">Photo: {scan.image_filename}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
