import { Leaf, ScanLine, MessageCircle, BarChart3, Recycle, Sparkles, Globe, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type Scan } from '@/lib/supabase';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: Props) {
  const [stats, setStats] = useState({ count: 0, co2: 0, diverted: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('scans').select('estimated_co2_saved_kg, estimated_waste_diverted_kg');
      if (data) {
        const count = data.length;
        const co2 = data.reduce((sum, r) => sum + Number(r.estimated_co2_saved_kg), 0);
        const diverted = data.reduce((sum, r) => sum + Number(r.estimated_waste_diverted_kg), 0);
        setStats({ count, co2, diverted });
      }
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Waste Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight text-balance animate-slide-up">
              Recycle smarter, not harder.
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
              Snap a photo or type the name of any waste item. Our AI assistant tells you if it's
              recyclable, how to dispose of it properly, and creative ways to give it a second life.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
              <button
                onClick={() => onNavigate('scanner')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <ScanLine className="w-5 h-5" />
                Start Recycling
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 font-semibold border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Ask AI Assistant
              </button>
            </div>
          </div>

          {/* Floating stats */}
          {stats.count > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.count}</div>
                <div className="text-sm text-gray-500 mt-1">Items Analyzed</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.co2.toFixed(2)} kg</div>
                <div className="text-sm text-gray-500 mt-1">CO₂ Saved</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 text-center">
                <div className="text-3xl font-bold text-teal-600">{stats.diverted.toFixed(2)} kg</div>
                <div className="text-sm text-gray-500 mt-1">Waste Diverted</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Three simple steps from waste item to responsible disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ScanLine,
              title: '1. Identify your item',
              desc: 'Type the name of your waste item or upload a photo. The scanner accepts plastic, paper, glass, metal, electronics, and more.',
              color: 'emerald',
            },
            {
              icon: Recycle,
              title: '2. Get instant analysis',
              desc: 'Our AI engine identifies the waste category, tells you if it is recyclable, and provides step-by-step disposal instructions.',
              color: 'blue',
            },
            {
              icon: TrendingDown,
              title: '3. Track your impact',
              desc: 'Every scan is saved to your history. Watch your CO₂ savings and waste diverted from landfill grow over time.',
              color: 'teal',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  feature.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : feature.color === 'blue'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-teal-50 text-teal-600'
                }`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">More than a recycling website</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              What makes our Smart Recycling Assistant different from a basic recycling lookup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Analysis',
                desc: 'Uses LLM technology to understand item context, not just keyword matching. Handles ambiguous and complex items.',
              },
              {
                icon: Recycle,
                title: 'Reuse & Upcycling Ideas',
                desc: 'Goes beyond disposal — suggests creative second-life uses for every item, encouraging circular economy thinking.',
              },
              {
                icon: Globe,
                title: 'Location-Aware Guidance',
                desc: 'Acknowledges that recycling rules vary by region without inventing local regulations. Honest about uncertainty.',
              },
              {
                icon: BarChart3,
                title: 'Transparent Impact Tracking',
                desc: 'Shows estimated CO₂ savings and waste diverted with clear assumptions — no greenwashing or invented numbers.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-5 rounded-xl bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <Leaf className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready to make a difference?</h2>
            <p className="text-emerald-50 max-w-lg mx-auto mb-6">
              Start scanning your waste items and learn how to recycle responsibly. Every action counts.
            </p>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <ScanLine className="w-5 h-5" />
              Scan Your First Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
