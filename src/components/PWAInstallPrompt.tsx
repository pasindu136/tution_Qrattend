'use client';

import { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(isStandaloneMode);
        if (isStandaloneMode) return;

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        // Capture event for Android/Chrome
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Show iOS prompt after a delay if not installed
        if (ios) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible || isStandalone) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col gap-3 relative overflow-hidden">

                {/* Close Button */}
                <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition">
                    <X size={16} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-xl">
                        🎓
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Install TuitionMate</h3>
                        <p className="text-xs text-slate-300">Add to Home Screen for the best experience.</p>
                    </div>
                </div>

                {isIOS ? (
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-300">
                        <p className="flex items-center gap-2 mb-1">
                            1. Tap the <Share size={14} className="text-blue-400" /> Share button.
                        </p>
                        <p className="flex items-center gap-2">
                            2. Select <span className="font-bold text-white">Add to Home Screen</span>.
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleInstallClick}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> Install Application
                    </button>
                )}
            </div>
        </div>
    );
}
