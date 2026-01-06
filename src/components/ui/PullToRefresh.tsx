'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [startY, setStartY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const THRESHOLD = 120; // Pixels to pull to trigger refresh

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                setStartY(e.touches[0].clientY);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            const diff = y - startY;

            if (window.scrollY === 0 && diff > 0 && !refreshing) {
                // Prevent default standard scroll only if we are acting on it
                // We don't prevent default here to allow normal scroll if not pulling hard? 
                // actually standard PWA behavior might conflict. 
                // Let's just track distance.
                setPullDistance(diff < 0 ? 0 : diff);
            }
        };

        const handleTouchEnd = () => {
            if (pullDistance > THRESHOLD && !refreshing) {
                triggerRefresh();
            }
            setPullDistance(0);
        };

        // Attach listeners to window or body for global effect
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [startY, pullDistance, refreshing]);

    const triggerRefresh = async () => {
        setRefreshing(true);
        // Haptic feedback if available
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Reload page
        window.location.reload();

        // Note: wrapper will unmount on reload, so no need to setRefreshing(false) really.
    };

    return (
        <div ref={containerRef} className="min-h-screen relative">

            {/* Loading Indicator Overlay */}
            <div
                className="fixed top-0 left-0 w-full flex justify-center pointer-events-none z-50 transition-all duration-200 ease-out"
                style={{
                    transform: `translateY(${Math.min(pullDistance, 150) - 100}px)`,
                    opacity: pullDistance > 20 ? 1 : 0
                }}
            >
                <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 mt-safe-top">
                    <Loader2
                        className={`text-blue-600 ${refreshing || pullDistance > THRESHOLD ? 'animate-spin' : ''}`}
                        size={24}
                        style={{ transform: `rotate(${pullDistance * 2}deg)` }}
                    />
                </div>
            </div>

            {children}
        </div>
    );
}
