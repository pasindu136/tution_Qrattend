'use client';

import { useState, useEffect } from 'react';
import { sendNotification, deleteNotification, getSentNotifications, sendEmail } from '@/app/admin/actions';
import { Bell, Send, Users, CheckSquare, Square, X, History, Trash2, Clock, CheckCircle2, Mail } from 'lucide-react';

export default function NotificationSender({ allUsers }: { allUsers: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    // Check Mobile for UI adjustments if needed, though modal is responsive
    const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

    // Send State
    const [message, setMessage] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [channel, setChannel] = useState<'app' | 'email'>('app');

    // History State
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Load History when tab changes (Only for App Notifications currently)
    useEffect(() => {
        if (isOpen && activeTab === 'history') {
            loadHistory();
        }
    }, [isOpen, activeTab]);

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        const data = await getSentNotifications();
        setHistory(data);
        setIsLoadingHistory(false);
    };

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
        if (channel === 'email' && !emailSubject.trim()) {
            alert("Please add a subject line for the email.");
            return;
        }

        setIsSending(true);
        try {
            if (channel === 'email') {
                // Get emails of selected users
                const emails = allUsers
                    .filter(u => selectedUsers.includes(u.id))
                    .map(u => u.email)
                    .filter(e => e); // ensure valid

                await sendEmail(emails, emailSubject, message);
                alert(`Emails sent successfully to ${emails.length} users!`);
            } else {
                await sendNotification(selectedUsers, message);
                alert("App notifications sent successfully!");
                setActiveTab('history'); // Switch to history to see it
            }

            setMessage('');
            setEmailSubject('');
            setSelectedUsers([]);
            setSelectAll(false);

        } catch (e) {
            console.error(e);
            alert("Failed to send.");
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;

        // Optimistic update
        setHistory(prev => prev.filter(n => n.id !== id));

        try {
            await deleteNotification(id);
        } catch (e) {
            console.error(e);
            alert("Failed to delete.");
            loadHistory(); // Revert on failure
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
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header with Tabs */}
                <div className="p-0 bg-slate-50 border-b border-slate-100">
                    <div className="flex justify-between items-center p-6 pb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <Send size={20} className="text-blue-600" />
                            Notify Users
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-500 transition shadow-sm border border-slate-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex px-6 space-x-6">
                        <button
                            onClick={() => setActiveTab('send')}
                            className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'send' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Send New
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            History (App)
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">

                    {activeTab === 'send' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                            {/* Channel Selection */}
                            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setChannel('app')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${channel === 'app' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Bell size={16} /> App Notification
                                </button>
                                <button
                                    onClick={() => setChannel('email')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${channel === 'email' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Mail size={16} /> Email Broadcast
                                </button>
                            </div>

                            {channel === 'email' && (
                                <div className="mb-4 animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject Line</label>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition text-slate-700 font-medium"
                                        placeholder="e.g., Important Account Update"
                                    />
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">{channel === 'email' ? 'Email Body' : 'Message'}</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={`w-full h-32 p-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 transition resize-none text-slate-700 font-medium ${channel === 'email' ? 'focus:border-purple-500 focus:ring-purple-500/10' : 'focus:border-blue-500 focus:ring-blue-500/10'}`}
                                    placeholder={channel === 'email' ? "Write your email content here..." : "Type your in-app announcement here..."}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold text-slate-700">Recipients ({selectedUsers.length})</label>
                                    <button
                                        onClick={handleSelectAll}
                                        className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${channel === 'email' ? 'bg-purple-50 text-purple-600 hover:text-purple-800' : 'bg-blue-50 text-blue-600 hover:text-blue-800'}`}
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
                                                ? (channel === 'email' ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-blue-50 border-blue-200 shadow-sm')
                                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${selectedUsers.includes(user.id)
                                                    ? (channel === 'email' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-blue-500 border-blue-500 text-white')
                                                    : 'border-slate-300 bg-white'
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
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <History size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>No message history found.</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 group hover:border-blue-100 transition">
                                        <div className="shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                                            <Users size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                                                    To: {item.recipient_name}
                                                </p>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                    {item.is_read ? <CheckCircle2 size={12} className="text-green-500" /> : <Clock size={12} />}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 leading-snug">
                                                {item.message}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            title="Delete Notification"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>

                {/* Footer only for Send Tab */}
                {activeTab === 'send' && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message || selectedUsers.length === 0 || (channel === 'email' && !emailSubject)}
                            className={`px-6 py-3 text-white font-bold rounded-xl transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${channel === 'email' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'}`}
                        >
                            <Send size={18} />
                            {isSending ? 'Sending...' : (channel === 'email' ? 'Send Email' : 'Send Notification')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
