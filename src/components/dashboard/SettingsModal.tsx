'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, User, Bell, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

import { updateProfileName } from "@/app/dashboard/actions"
import { useRouter } from "next/navigation"

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [smsEnabled, setSmsEnabled] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (isOpen && user) {
            setFullName(user.full_name || "")
            // For now, load SMS setting from localStorage as requested
            // In the future this will be loaded from DB
            const savedSms = localStorage.getItem('setting_sms_enabled')
            setSmsEnabled(savedSms === 'true')
        }
    }, [isOpen, user])

    async function handleSave() {
        setIsSaving(true)
        
        // Update name in DB if changed
        if (fullName.trim() !== user.full_name) {
            const result = await updateProfileName(user.id, fullName.trim())
            if (!result.error) {
                router.refresh()
            }
        }
        
        // Save local setting
        localStorage.setItem('setting_sms_enabled', smsEnabled ? 'true' : 'false')
        
        setIsSaving(false)
        setShowSuccess(true)
        
        setTimeout(() => {
            setShowSuccess(false)
            onClose()
        }, 1000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">App Settings</h2>
                                <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            
                            {/* Profile Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <User size={16} /> Profile Details
                                </h3>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium"
                                    />
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-100 mb-8" />

                            {/* App Preferences */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Bell size={16} /> Notifications
                                </h3>
                                
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-slate-900">SMS Notifications</h4>
                                        <p className="text-sm text-slate-500 mt-1">Automatically send an SMS to parents when attendance is marked.</p>
                                    </div>
                                    <button 
                                        onClick={() => setSmsEnabled(!smsEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${smsEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                                    >
                                        <span 
                                            className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow transition-transform duration-300 ease-in-out ${smsEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                                        />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving || showSuccess}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                                    showSuccess 
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]'
                                }`}
                            >
                                {isSaving ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : showSuccess ? (
                                    "Settings Saved!"
                                ) : (
                                    <><Save size={20} /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
