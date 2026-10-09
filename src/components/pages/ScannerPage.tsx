import { useState, useRef, useCallback } from 'react';
import {
  ScanLine,
  Upload,
  ImageIcon,
  Loader2,
  MapPin,
  X,
  AlertCircle,
  Sparkles,
  Recycle,
  Lightbulb,
  Leaf,
  Info,
} from 'lucide-react';
import {
  analyzeWasteItem,
  fileToBase64,
  validateImageFile,
} from '@/lib/api';
import { supabase, type AnalysisResult, type NewScanInput } from '@/lib/supabase';
import { IMAGES } from '@/lib/images';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about';

interface Props {
  onNavigate: (page: Page) => void;
}

const QUICK_ITEMS = [
  'Plastic bottle',
  'Cardboard box',
  'Glass jar',
  'Old phone',
  'Aluminum can',
  'Food scraps',
  'Newspaper',
  'Old t-shirt',
];

export default function ScannerPage({ onNavigate }: Props) {
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageFilename, setImageFilename] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setImageFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setImageBase64(undefined);
    setImageFilename(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleAnalyze = async () => {
    if (!itemName.trim()) {
      setError('Please enter the name of your waste item.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const analysis = await analyzeWasteItem(itemName, location || undefined, imageBase64);

      const newScan: NewScanInput = {
        item_name: analysis.item_name,
        category: analysis.category,
        recyclability: analysis.recyclability,
        disposal_instructions: analysis.disposal_instructions,
        reuse_ideas: analysis.reuse_ideas,
        environmental_advice: analysis.environmental_advice,
        estimated_co2_saved_kg: analysis.estimated_co2_saved_kg,
        estimated_waste_diverted_kg: analysis.estimated_waste_diverted_kg,
        analysis_mode: analysis.source,
        image_filename: imageFilename,
        location: location || null,
      };

      const { error: insertError } = await supabase.from('scans').insert(newScan);
      if (insertError) {
        console.error('Failed to save scan:', insertError);
      } else {
        setSaved(true);
      }

      setResult(analysis);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItemName('');
    setLocation('');
    handleRemoveImage();
    setResult(null);
    setError(null);
    setSaved(false);
  };

  const recyclabilityConfig = {
    recyclable: { label: 'Recyclable', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'non-recyclable': { label: 'Not Recyclable', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'depends-on-local-rules': { label: 'Depends on Local Rules', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="relative overflow-hidden rounded-2xl h-32 sm:h-40 mb-4">
          <img
            src={IMAGES.sortingRecyclables}
            alt="Sorting recyclable materials"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 to-teal-800/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-2 border border-white/20">
              <ScanLine className="w-4 h-4" />
              Waste Scanner
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Analyze Your Waste Item</h1>
          </div>
        </div>
        <p className="text-gray-600">
          Type the item name or upload a photo to get recycling guidance.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {/* Quick items */}
        <div className="mb-5">
          <p className="text-sm text-gray-500 mb-2">Quick examples:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setItemName(item)}
                className="px-3 py-1.5 rounded-full bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-sm text-gray-600 border border-gray-200 hover:border-emerald-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Item name
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
            placeholder="e.g. plastic bottle, old laptop, glass jar..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-900"
            disabled={loading}
          />
        </div>

        {/* Location input */}
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Mumbai, Malaysia, New York..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-900"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">
            Recycling rules vary by region. We'll note this without inventing local regulations.
          </p>
        </div>

        {/* Image upload */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Photo (optional)
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Uploaded item"
                className="max-h-48 rounded-xl border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all"
            >
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Click to upload a photo</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP, or GIF (max 10MB)</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !itemName.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Item
              </>
            )}
          </button>
          {(result || error) && (
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-slide-up space-y-4">
          {/* Saved indicator */}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-100">
              <Leaf className="w-4 h-4" />
              Saved to your recycling history.
            </div>
          )}

          {/* Main result card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{result.item_name}</h2>
                <p className="text-gray-500 text-sm mt-0.5">Category: {result.category}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl border ${recyclabilityConfig[result.recyclability].bg} ${recyclabilityConfig[result.recyclability].text} ${recyclabilityConfig[result.recyclability].border}`}>
                <span className="font-semibold">{recyclabilityConfig[result.recyclability].label}</span>
              </div>
            </div>

            {/* Source indicator */}
            <div className="flex items-center gap-2 mb-5">
              {result.source === 'ai' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  <Sparkles className="w-3 h-3" />
                  AI Analysis
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                  <Info className="w-3 h-3" />
                  Built-in Knowledge Base
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                result.confidence === 'high'
                  ? 'bg-emerald-50 text-emerald-600'
                  : result.confidence === 'medium'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-gray-50 text-gray-500'
              }`}>
                {result.confidence} confidence
              </span>
            </div>

            {/* Impact stats */}
            {(result.estimated_co2_saved_kg > 0 || result.estimated_waste_diverted_kg > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {result.estimated_co2_saved_kg > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.estimated_co2_saved_kg.toFixed(2)} kg
                    </div>
                    <div className="text-xs text-blue-500 mt-0.5">Estimated CO₂ saved</div>
                  </div>
                )}
                {result.estimated_waste_diverted_kg > 0 && (
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <div className="text-2xl font-bold text-teal-600">
                      {result.estimated_waste_diverted_kg.toFixed(2)} kg
                    </div>
                    <div className="text-xs text-teal-500 mt-0.5">Waste diverted from landfill</div>
                  </div>
                )}
              </div>
            )}

            {/* Disposal instructions */}
            <div className="mb-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                <Recycle className="w-5 h-5 text-emerald-600" />
                Disposal Instructions
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {result.disposal_instructions}
              </div>
            </div>

            {/* Reuse ideas */}
            <div className="mb-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Reuse & Upcycling Ideas
              </h3>
              <div className="bg-amber-50/50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {result.reuse_ideas}
              </div>
            </div>

            {/* Environmental advice */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Environmental Advice
              </h3>
              <div className="bg-emerald-50/50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {result.environmental_advice}
              </div>
            </div>
          </div>

          {/* Next actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:border-emerald-300 hover:text-emerald-700 transition-all"
            >
              Ask a follow-up question
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:border-emerald-300 hover:text-emerald-700 transition-all"
            >
              View your impact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
