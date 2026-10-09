import { useState, useCallback, useEffect } from 'react';
import { MapPin, RefreshCw, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { detectLocation, type LocationStatus, type ResolvedLocation } from '@/lib/geolocation';

interface Props {
  onLocationDetected: (location: ResolvedLocation) => void;
  onManualLocation: (location: string) => void;
  initialLocation?: string;
  compact?: boolean;
}

export default function LocationBar({ onLocationDetected, onManualLocation, initialLocation, compact }: Props) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualInput, setManualInput] = useState(initialLocation || '');

  const handleDetect = useCallback(async () => {
    setStatus('detecting');
    setError(null);
    try {
      const loc = await detectLocation();
      setResolvedLocation(loc);
      setStatus('found');
      onLocationDetected(loc);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('denied')) {
        setStatus('denied');
      } else {
        setStatus('error');
      }
      setError(msg);
    }
  }, [onLocationDetected]);

  useEffect(() => {
    return () => {
      setStatus('idle');
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onManualLocation(manualInput.trim());
      setShowManual(false);
      setStatus('found');
      setResolvedLocation({ coords: { latitude: 0, longitude: 0 }, displayName: manualInput.trim(), area: manualInput.trim() });
    }
  };

  const statusConfig = {
    idle: { icon: MapPin, text: 'Detect location for better results', color: 'text-gray-500', bg: 'bg-gray-50' },
    detecting: { icon: Loader2, text: 'Detecting your location...', color: 'text-blue-600', bg: 'bg-blue-50' },
    found: { icon: Check, text: resolvedLocation?.displayName || 'Location found', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    denied: { icon: X, text: 'Location permission denied', color: 'text-amber-600', bg: 'bg-amber-50' },
    unavailable: { icon: AlertCircle, text: 'Location unavailable', color: 'text-red-600', bg: 'bg-red-50' },
    error: { icon: AlertCircle, text: error || 'Location error', color: 'text-red-600', bg: 'bg-red-50' },
  };

  const cfg = statusConfig[status];

  return (
    <div className={`rounded-xl border border-gray-200 ${cfg.bg} ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <cfg.icon className={`w-5 h-5 ${cfg.color} flex-shrink-0 ${status === 'detecting' ? 'animate-spin' : ''}`} />
          <span className={`text-sm ${cfg.color} truncate`}>{cfg.text}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {(status === 'found' || status === 'denied' || status === 'error') && (
            <button
              onClick={handleDetect}
              className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
              title="Refresh location"
            >
              <RefreshCw className={`w-4 h-4 ${cfg.color}`} />
            </button>
          )}
          {(status === 'denied' || status === 'error' || status === 'unavailable') && !showManual && (
            <button
              onClick={() => setShowManual(true)}
              className="text-xs px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Enter manually
            </button>
          )}
          {status === 'idle' && (
            <button
              onClick={handleDetect}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              Detect
            </button>
          )}
        </div>
      </div>

      {showManual && (
        <div className="mt-3 flex gap-2 animate-slide-up">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            placeholder="e.g. Bengaluru, Mumbai, New Delhi..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-900"
            autoFocus
          />
          <button
            onClick={handleManualSubmit}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Set
          </button>
        </div>
      )}

      {status === 'found' && resolvedLocation && (
        <p className="text-xs text-gray-400 mt-1.5">
          Location is used only to suggest nearby facilities and is not stored permanently.
        </p>
      )}
    </div>
  );
}
