import { AlertCircle, Download } from 'lucide-react';

const TauriStatus = () => {
  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;

  if (isTauri) return null; // Don't show anything if we're in Tauri

  return (
    <div className="fixed top-4 right-4 z-[100000] max-w-sm">
      <div className="bg-amber-900/90 backdrop-blur-md border border-amber-500/50 rounded-lg p-4 text-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <div className="font-semibold text-sm">Demo Mode</div>
            <div className="text-xs leading-relaxed">
              You're viewing the web demo version. The project launcher simulates 
              system commands and opens URLs in new tabs.
            </div>
            <div className="text-xs text-amber-300">
              Full system integration requires desktop app setup.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TauriStatus;
