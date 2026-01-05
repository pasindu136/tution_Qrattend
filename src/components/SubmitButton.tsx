'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SubmitButtonProps {
    text: string;
    loadingText: string;
    icon?: React.ElementType;
    className?: string;
}

export default function SubmitButton({ text, loadingText, icon: Icon, className }: SubmitButtonProps) {
    const { pending } = useFormStatus();
    const [clicked, setClicked] = useState(false);

    // Sync clicked state: reset if pending becomes false (completed/error)
    useEffect(() => {
        if (!pending) {
            setClicked(false);
        }
    }, [pending]);

    // Visual Loading State: Either pending (server) or clicked (client-immediate)
    const isLoading = pending || clicked;

    return (
        <button
            type="submit"
            onClick={() => setClicked(true)}
            disabled={pending} // Only disable via pending to ensure submit event triggers
            className={`w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${className} ${isLoading ? 'opacity-80 pointer-events-none' : ''}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    {loadingText}
                </>
            ) : (
                <>
                    {text} {Icon && <Icon size={20} />}
                </>
            )}
        </button>
    );
}
