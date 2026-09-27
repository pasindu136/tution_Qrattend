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

    useEffect(() => {
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
                
                onScan(decodedText);
                
                // Add a small delay to avoid rapid duplicate scans
                if (scannerRef.current) {
                    scannerRef.current.pause();
                    setTimeout(() => {
                        if (scannerRef.current?.getState() === 3 /* PAUSED */) {
                            scannerRef.current.resume();
                        }
                    }, 1500);
                }
            },
            (err) => {
                // Ignore regular scan errors (not finding QR)
            }
        ).then(() => {
            setIsStarting(false);
        }).catch((err) => {
            setIsStarting(false);
            console.error("Camera start error:", err);
            setError("Could not access camera. Please ensure you have granted camera permissions to this site.");
        });

        return () => {
            if (scannerRef.current) {
                // Ignore errors during clear as component might be unmounting
                scannerRef.current.stop().catch(e => console.error(e)).finally(() => {
                    scannerRef.current?.clear();
                });
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:text-white/80 p-3 bg-black/40 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            >
                <X size={24} />
            </button>
            
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                <div className="p-6 text-center border-b border-slate-100">
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
