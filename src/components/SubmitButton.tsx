'use client';

import { useFormStatus } from 'react-dom';
import { Loader2, LogIn, ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
    text: string;
    loadingText: string;
    icon?: React.ElementType;
    className?: string;
}

export default function SubmitButton({ text, loadingText, icon: Icon, className }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {pending ? (
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
