'use client';

import { useState } from 'react';
import { sendNotification } from '@/app/admin/actions';
import { Bell, Send, Users, CheckSquare, Square, X } from 'lucide-react';

export default function NotificationSender({ allUsers }: { allUsers: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(allUsers.map(u => u.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSend = async () => {
        if (!message.trim() || selectedUsers.length === 0) return;
        setIsSending(true);
        try {
            await sendNotification(selectedUsers, message);
            setIsOpen(false);
            setMessage('');
            setSelectedUsers([]);
            setSelectAll(false);
            alert("Notifications sent successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to send.");
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-slate-800 transition active:scale-95 flex items-center gap-2"
            >
                <Bell size={24} />
                <span className="font-bold hidden md:inline">Notify Users</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Send size={20} className="text-blue-600" />
                        Send Notification
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-500 transition shadow-sm border border-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-32 p-4 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition resize-none text-slate-700 font-medium"
                            placeholder="Type your announcement here..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-slate-700">Recipients ({selectedUsers.length})</label>
                            <button
                                onClick={handleSelectAll}
                                className="text-xs font-bold flex items-center gap-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
                            >
                                {selectAll ? <CheckSquare size={14} /> : <Square size={14} />}
                                Select All
                            </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {allUsers.filter(u => u.role !== 'admin').map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${selectedUsers.includes(user.id)
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-blue-100 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${selectedUsers.includes(user.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'
                                        }`}>
                                        {selectedUsers.includes(user.id) && <Users size={12} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending || !message || selectedUsers.length === 0}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send size={18} />
                        {isSending ? 'Sending...' : 'Send Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
