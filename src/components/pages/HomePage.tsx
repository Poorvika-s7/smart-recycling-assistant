import {
  Leaf,
  ScanLine,
  MessageCircle,
  BarChart3,
  Recycle,
  Sparkles,
  Globe,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Zap,
  MapPin,
  Camera,
  Navigation,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { IMAGES } from '@/lib/images';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about' | 'facilities';

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
      {/* Hero Section with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.recyclingBins}
            alt="Recycling bins for paper, plastic, metal, and glass"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-teal-900/75" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Waste Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance animate-slide-up">
              Recycle smarter,<br className="hidden sm:block" /> not harder.
            </h1>
            <p className="mt-6 text-lg text-emerald-50/90 max-w-xl animate-slide-up">
              Snap a photo or type the name of any waste item. Our AI assistant tells you if it's
              recyclable, how to dispose of it properly, and creative ways to give it a second life.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up">
              <button
                onClick={() => onNavigate('scanner')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <ScanLine className="w-5 h-5" />
                Scan Waste
              </button>
              <button
                onClick={() => onNavigate('facilities')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Find Disposal Centres
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Ask AI Assistant
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-emerald-50/80">
              {['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic', 'Batteries', 'Textile'].map((cat) => (
                <span key={cat} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Floating stats */}
          {stats.count > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl animate-slide-up">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white">{stats.count}</div>
                <div className="text-sm text-emerald-50/70 mt-1">Items Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white">{stats.co2.toFixed(2)} kg</div>
                <div className="text-sm text-emerald-50/70 mt-1">CO₂ Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white">{stats.diverted.toFixed(2)} kg</div>
                <div className="text-sm text-emerald-50/70 mt-1">Waste Diverted</div>
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
              title: '1. Scan, upload, or describe',
              desc: 'Use your camera to scan waste, upload a photo, or type what you want to dispose of. Supports plastic, paper, glass, metal, electronics, batteries, and more.',
              color: 'emerald',
              image: IMAGES.sortingHands,
            },
            {
              icon: Recycle,
              title: '2. Identify & get guidance',
              desc: 'Get the waste category, recyclability status, step-by-step disposal instructions, safety precautions, and reuse ideas instantly.',
              color: 'blue',
              image: IMAGES.glassBottles,
            },
            {
              icon: MapPin,
              title: '3. Find nearby facilities',
              desc: 'Detect your location and find nearby disposal centres that accept your type of waste. Get directions in one tap.',
              color: 'teal',
              image: IMAGES.holdingPlant,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div
                  className={`absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${
                    feature.color === 'emerald'
                      ? 'bg-emerald-500 text-white'
                      : feature.color === 'blue'
                      ? 'bg-blue-500 text-white'
                      : 'bg-teal-500 text-white'
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
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

      {/* Impact Stats Banner with image */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={IMAGES.seedlings}
            alt="Hands holding green seedlings"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-teal-800/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 sm:px-12 max-w-xl">
              <Zap className="w-10 h-10 text-emerald-300 mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Every item you recycle makes a measurable difference.
              </h2>
              <p className="text-emerald-50/90 mb-6">
                About 75% of waste is recyclable, but only 30% actually gets recycled. Our tool
                helps close that gap — one scan at a time.
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-semibold hover:shadow-xl transition-all"
              >
                View your impact
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
