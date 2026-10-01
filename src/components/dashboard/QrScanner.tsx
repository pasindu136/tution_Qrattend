'use client'

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Loader2 } from 'lucide-react';

interface QrScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState('');
    const [isStarting, setIsStarting] = useState(true);

    const onScanRef = useRef(onScan);
    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    useEffect(() => {
        let isMounted = true;
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        // Configuration
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        // Start scanning
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                // Play a beep sound on successful scan
                const audio = new Audio('/beep.mp3');
                audio.play().catch(e => console.log('Audio play blocked:', e));
                
                onScanRef.current(decodedText);
                
                // Add a small delay to avoid rapid duplicate scans
                if (scannerRef.current) {
                    scannerRef.current.pause();
                    setTimeout(() => {
                        if (isMounted && scannerRef.current?.getState() === 3 /* PAUSED */) {
                            scannerRef.current.resume();
                        }
                    }, 1500);
                }
            },
            (err) => {
                // Ignore regular scan errors (not finding QR)
            }
        ).then(() => {
            if (!isMounted) {
                // If the component unmounted before start finished, stop it immediately
                html5QrCode.stop().catch(console.error).finally(() => html5QrCode.clear());
            } else {
                setIsStarting(false);
            }
        }).catch((err) => {
            if (isMounted) {
                setIsStarting(false);
                console.error("Camera start error:", err);
                setError("Could not access camera. Please ensure you have granted camera permissions to this site.");
            }
        });

        return () => {
            isMounted = false;
            if (scannerRef.current) {
                try {
                    // Only attempt to stop if it is currently scanning or paused
                    const state = scannerRef.current.getState();
                    if (state === 2 /* SCANNING */ || state === 3 /* PAUSED */) {
                        scannerRef.current.stop().catch(e => console.error("Stop error:", e)).finally(() => {
                            try { scannerRef.current?.clear(); } catch(e) {}
                        });
                    } else {
                        try { scannerRef.current.clear(); } catch(e) {}
                    }
                } catch (e) {
                    console.error("Cleanup error:", e);
                }
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
                >
                    <X size={20} />
                </button>
                
                <div className="p-6 text-center border-b border-slate-100 relative">
                    <h3 className="text-xl font-bold text-slate-900">Scan Student QR</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Position the code inside the box
                    </p>
                </div>
                
                <div className="relative bg-slate-900 aspect-square w-full flex items-center justify-center overflow-hidden">
                    {isStarting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 z-10">
                            <Loader2 size={32} className="animate-spin mb-3 text-blue-500" />
                            <p className="text-sm font-medium">Starting camera...</p>
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-slate-900 z-10">
                            <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
                        </div>
                    )}
                    <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full border-none outline-none"></div>
                </div>
            </div>
        </div>
    );
}
