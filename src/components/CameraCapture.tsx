import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onCapture: (imageBase64: string, previewUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<'starting' | 'ready' | 'captured' | 'error'>('starting');
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setStatus('starting');
    setError('');
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('error');
      setError('Camera is not supported by this device or browser. You can still upload a photo or describe the item by text.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setStatus('ready');
        };
      }
    } catch (err) {
      const msg = (err as Error).message || '';
      setStatus('error');
      if (msg.includes('Permission') || msg.includes('NotAllowed') || msg.includes('denied')) {
        setError('Camera permission was denied. Please allow camera access or use the upload option instead.');
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        setError('No camera was found on this device. You can upload a photo or describe the item instead.');
      } else if (msg.includes('NotReadable') || msg.includes('TrackStart')) {
        setError('The camera is already in use by another application. Close it and try again.');
      } else {
        setError('Could not access the camera. You can upload a photo or describe the item instead.');
      }
    }
  }, [stopStream]);

  useEffect(() => {
    startCamera(facingMode);
    return () => stopStream();
  }, [startCamera, stopStream, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewUrl(dataUrl);
    setCapturedBase64(dataUrl.split(',')[1]);
    setStatus('captured');
    stopStream();
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setCapturedBase64(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedBase64 && previewUrl) {
      onCapture(capturedBase64, previewUrl);
      stopStream();
    }
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Scan with Camera</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative bg-black aspect-video">
          {status === 'error' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-white/90 text-sm max-w-md">{error}</p>
            </div>
          ) : status === 'captured' && previewUrl ? (
            <img src={previewUrl} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {status === 'starting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {status === 'ready' && (
                <div className="absolute inset-4 border-2 border-white/40 rounded-xl pointer-events-none" />
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 flex items-center justify-center gap-3">
          {status === 'error' ? (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          ) : status === 'captured' ? (
            <>
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Use Photo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSwitchCamera}
                disabled={status === 'starting'}
                className="px-3 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="Switch camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCapture}
                disabled={status !== 'ready'}
                className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
