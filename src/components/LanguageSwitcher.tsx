'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={`flex bg-slate-100 p-1 rounded-lg ${className}`}>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'en'
                        ? 'bg-white shadow-sm text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                English
            </button>
            <button
                onClick={() => setLanguage('si')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'si'
                        ? 'bg-white shadow-sm text-blue-700'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                සිංහල
            </button>
        </div>
    );
}
