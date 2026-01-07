'use client';

import { useState, useRef } from 'react';
import { restoreDatabase, clearDatabase } from '@/app/admin/actions';
import { UploadCloud, FileJson, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

export default function RestoreManager() {
    const [isRestoring, setIsRestoring] = useState(false);
    const [fileError, setFileError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setFileError('');
        setSuccessMessage('');

        // Basic validation
        if (!file.name.endsWith('.json')) {
            setFileError("Please upload a valid .json backup file.");
            return;
        }

        // Confirm
        if (!confirm("⚠️ CRITICAL WARNING: This will WIPE current database data (students, classes, payments) and replace it with the backup. This cannot be undone. Are you sure?")) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsRestoring(true);

        try {
            const textContent = await file.text();

            // Validate JSON structure locally before sending
            try {
                const json = JSON.parse(textContent);
                if (!json.data || !json.timestamp) {
                    throw new Error("Invalid backup file format");
                }
            } catch (err) {
                throw new Error("File is not a valid JSON or corrupted.");
            }

            const result = await restoreDatabase(textContent);
            setSuccessMessage(result.message);
            alert("Database Restored Successfully!");
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            setFileError(error.message || "Failed to restore database.");
        } finally {
            setIsRestoring(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UploadCloud size={20} className="text-blue-600" />
                        Restore Database
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Upload a previously generated backup file (`.json`) to restore the system.
                    </p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-amber-800">
                    <p className="font-bold">Warning: Data Overwrite</p>
                    <p>Restoring will delete all current classes, students, and payments. It will assume the backup is the source of truth. User accounts (logins) are NOT deleted, but their profile details will be updated from the backup.</p>
                </div>
            </div>

            {fileError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-4">
                    ❌ {fileError}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMessage}
                </div>
            )}

            <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="backup-upload"
                    disabled={isRestoring}
                />

                <label
                    htmlFor="backup-upload"
                    className={`flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition ${isRestoring ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {isRestoring ? <Loader2 size={18} className="animate-spin" /> : <FileJson size={18} />}
                    {isRestoring ? "Restoring..." : "Select Backup File"}
                </label>

                <p className="text-xs text-slate-400 font-medium">
                    Accepted format: .json
                </p>
            </div>

            {/* Danger Zone: Clear DB for Testing */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Danger Zone</p>
                <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100">
                    <div>
                        <h4 className="text-sm font-bold text-red-900">Clear Database</h4>
                        <p className="text-xs text-red-700 mt-1">Permanently delete all students, classes, and payments for testing restore.</p>
                    </div>
                    <button
                        onClick={async () => {
                            if (confirm("🚨 ARE YOU SURE? This will delete ALL DATA (except logins). Use this only if you have a backup!")) {
                                try {
                                    setIsRestoring(true); // Reuse loader state or make new one
                                    await clearDatabase();
                                    alert("✅ Database Cleared.");
                                    window.location.reload();
                                } catch (e: any) {
                                    alert("❌ Failed: " + e.message);
                                } finally {
                                    setIsRestoring(false);
                                }
                            }
                        }}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                        Clear Data
                    </button>
                </div>
            </div>
        </div>
    );
}
