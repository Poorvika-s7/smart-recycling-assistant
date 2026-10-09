import { Leaf, Recycle, Sparkles, Globe, BarChart3, Users, Target, TrendingUp, Lightbulb, Heart } from 'lucide-react';
import { IMAGES } from '@/lib/images';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero with image */}
      <div className="relative overflow-hidden rounded-3xl mb-10 h-56 sm:h-64">
        <img
          src={IMAGES.plasticBottles}
          alt="Sorting plastic bottles for recycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-teal-800/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-3 border border-white/20">
            <Leaf className="w-4 h-4" />
            About Our Project
          </div>
          <h1 className="text-3xl font-bold text-white">Smart Recycling Assistant</h1>
          <p className="mt-2 text-emerald-50/90 max-w-2xl">
            An AI-powered tool that helps people identify waste, understand recyclability, and dispose
            of items responsibly — built for the SINAR Hackathon.
          </p>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">The Problem</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Most people want to recycle correctly but don't know how. Recycling rules vary by material
            and location, contamination ruins good recyclables, and millions of tons of reusable waste
            end up in landfills every year simply because people are unsure.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">Our Solution</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            An AI assistant that identifies waste items, provides clear recyclability guidance,
            step-by-step disposal instructions, creative reuse ideas, and tracks environmental impact
            — all in one easy-to-use application.
          </p>
        </div>
      </div>

      {/* Key Innovations */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Three Key Innovations</h2>
        <div className="space-y-4">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered Waste Analysis',
              desc: 'Uses Large Language Model (LLM) technology to understand waste items contextually — not just keyword matching. Handles ambiguous items, provides nuanced guidance, and answers follow-up questions in a chatbot. Falls back to a built-in knowledge base when AI is unavailable.',
            },
            {
              icon: Recycle,
              title: 'Reuse & Upcycling Suggestions',
              desc: 'Goes beyond simple "recyclable or not" answers. For every item, suggests creative second-life uses that encourage circular economy thinking and reduce waste at the source.',
            },
            {
              icon: BarChart3,
              title: 'Transparent Impact Tracking',
              desc: 'Shows estimated CO₂ savings and waste diverted from landfill with clear, stated assumptions. No greenwashing — we are honest about the limitations of our estimates and never invent recycling regulations or facility data.',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Frontend', value: 'React + TypeScript + Tailwind CSS' },
            { label: 'Backend', value: 'Supabase Edge Functions (Deno)' },
            { label: 'Database', value: 'Supabase (PostgreSQL)' },
            { label: 'AI Model', value: 'OpenAI GPT-4o-mini (LLM)' },
            { label: 'Image Analysis', value: 'GPT-4o vision (when API key configured)' },
            { label: 'Fallback Mode', value: 'Built-in rule-based recycling knowledge base' },
          ].map((tech) => (
            <div key={tech.label} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
              <span className="text-sm text-gray-500">{tech.label}</span>
              <span className="text-sm font-medium text-gray-900 text-right">{tech.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Architecture Overview</h2>
        <div className="flex flex-col items-center gap-2 py-4">
          {[
            { label: 'User', icon: Users, color: 'bg-gray-100 text-gray-700' },
            { label: 'Frontend (React)', icon: Globe, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Edge Function (Backend)', icon: Recycle, color: 'bg-blue-100 text-blue-700' },
            { label: 'AI / LLM API', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
            { label: 'Database (Supabase)', icon: BarChart3, color: 'bg-teal-100 text-teal-700' },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex flex-col items-center">
              <div className={`px-4 py-2.5 rounded-xl ${node.color} font-medium text-sm flex items-center gap-2`}>
                <node.icon className="w-4 h-4" />
                {node.label}
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-6 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          The user interacts with the React frontend, which calls an edge function. The edge function
          calls the AI API, saves results to the database, and returns structured analysis to the frontend.
        </p>
      </div>

      {/* Sustainability Impact */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6" />
          <h2 className="font-bold text-lg">Sustainability Impact</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: '30%', label: 'of household waste is compostable organic material' },
            { stat: '75%', label: 'of all waste is recyclable, but only 30% actually gets recycled' },
            { stat: '2 billion', label: 'tons of waste generated globally each year' },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{item.stat}</div>
              <div className="text-sm text-emerald-50 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-emerald-50 text-sm mt-4">
          Our tool empowers individuals to close this gap — one item at a time.
        </p>
      </div>

      {/* Future Improvements */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-gray-900">Future Improvements</h2>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            'Integrate real-time local recycling rules by connecting to municipal waste management APIs',
            'Add barcode scanning for packaged products to identify materials automatically',
            'Gamification with badges, streaks, and community leaderboards',
            'Nearby recycling facility finder using geolocation',
            'Multi-language support for broader accessibility',
            'Community features where users share upcycling projects and tips',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('scanner')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-all"
        >
          <Recycle className="w-5 h-5" />
          Start Recycling
        </button>
      </div>
    </div>
  );
}
