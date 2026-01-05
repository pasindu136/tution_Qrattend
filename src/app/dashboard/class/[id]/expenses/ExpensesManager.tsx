
'use client'

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar, DollarSign, Tag, X, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { addExpense, deleteExpense } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import ClassNav from "@/components/dashboard/ClassNav";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string;
    created_at: string;
};

// Extracted Form Component to prevent re-render focus loss
function ExpenseForm({
    onSubmit,
    description,
    setDescription,
    amount,
    setAmount,
    date,
    setDate,
    isMobile,
    onCancel,
    isSubmitting
}: {
    onSubmit: (e: React.FormEvent) => void;
    description: string;
    setDescription: (s: string) => void;
    amount: string;
    setAmount: (s: string) => void;
    date: string;
    setDate: (s: string) => void;
    isMobile: boolean;
    onCancel: () => void;
    isSubmitting: boolean;
}) {
    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Description</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        required
                        placeholder="e.g. Hall Fee - Nugegoda"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition font-medium text-slate-800"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Amount (LKR)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition font-medium text-slate-800"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Date</label>
                <div className="relative">
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition font-medium text-slate-800"
                    />
                </div>
            </div>

            <div className="flex gap-2 w-full">
                {!isMobile && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {isSubmitting ? 'Saving' : 'Save'}
                </button>
            </div>
        </form>
    );
}

export default function ExpensesManager({
    classId,
    initialExpenses,
    ownerId,
    currentUserId
}: {
    classId: string,
    initialExpenses: Expense[],
    ownerId?: string,
    currentUserId?: string
}) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, expenseId: string | null }>({ isOpen: false, expenseId: null });

    // Admin View Check
    const isAdminView = ownerId && currentUserId && ownerId !== currentUserId;

    // Check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !date) return;

        // Admin Confirmation
        if (isAdminView) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are adding an expense to ANOTHER user's class.\nAre you sure you want to proceed?");
            if (!confirmed) return;
        }

        setIsSubmitting(true);
        // Call Server Action
        const result = await addExpense(classId, description, parseFloat(amount), new Date(date));

        if (result.success) {
            window.location.reload();
        } else {
            alert('Failed to add expense');
        }
        setIsSubmitting(false);
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        setDeleteConfirmation({ isOpen: true, expenseId: id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.expenseId) return;

        // Admin Confirmation
        if (isAdminView) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are DELETING an expense from ANOTHER user's class.\nThis action is irreversible.\nAre you absolutely sure?");
            if (!confirmed) {
                setDeleteConfirmation({ isOpen: false, expenseId: null });
                return;
            }
        }

        const result = await deleteExpense(classId, deleteConfirmation.expenseId);
        if (result.success) {
            window.location.reload();
        } else {
            alert('Failed to delete');
        }
        setDeleteConfirmation({ isOpen: false, expenseId: null });
    };

    // Calculate Totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="min-h-screen pb-20">
            {/* Admin Banner */}
            {isAdminView && (
                <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center mb-6 sticky top-0 z-40">
                    <span className="flex items-center gap-2">
                        <span>⚠️</span>
                        You are viewing <span className="underline">another user's</span> expenses.
                    </span>
                    <Link href={`/admin/tutors/${ownerId}`} className="underline hover:text-amber-900">
                        Back to Tutor Dashboard
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={isAdminView ? `/admin/tutors/${ownerId}` : `/dashboard/class/${classId}`} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Class Expenses</h1>
                    <p className="text-slate-500">Manage hall fees and other expenses.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={classId} activeTab="expenses" />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Expenses (All Time)</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">LKR {totalExpenses.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl">
                        📉
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">This Month Expenses</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">LKR {thisMonthExpenses.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                        📅
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </div>

            {/* DESKTOP FORM (Inline) */}
            <AnimatePresence>
                {isAdding && !isMobile && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm overflow-hidden"
                    >
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Add New Expense</h3>
                        <ExpenseForm
                            onSubmit={handleSubmit}
                            description={description}
                            setDescription={setDescription}
                            amount={amount}
                            setAmount={setAmount}
                            date={date}
                            setDate={setDate}
                            isMobile={isMobile}
                            onCancel={() => setIsAdding(false)}
                            isSubmitting={isSubmitting}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE FORM (Bottom Sheet) */}
            <AnimatePresence>
                {isAdding && isMobile && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        {/* Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white p-6 z-[70] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-slate-900">Add Expense</h3>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="pb-8">
                                <ExpenseForm
                                    onSubmit={handleSubmit}
                                    description={description}
                                    setDescription={setDescription}
                                    amount={amount}
                                    setAmount={setAmount}
                                    date={date}
                                    setDate={setDate}
                                    isMobile={isMobile}
                                    onCancel={() => setIsAdding(false)}
                                    isSubmitting={isSubmitting}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* List View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Desktop Table (> lg) */}
                <table className="w-full text-left hidden lg:table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount (LKR)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No expenses recorded yet.
                                </td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-600">
                                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {expense.description}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 text-right">
                                        {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Mobile List (< lg) */}
                <div className="lg:hidden">
                    {expenses.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-slate-100 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                                            🏷️
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{expense.description}</p>
                                            <p className="text-xs text-slate-500 font-medium">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">-{expense.amount.toLocaleString()}</p>
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="text-xs text-red-500 font-bold mt-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, expenseId: null })}
                onConfirm={confirmDelete}
                title="Delete Expense?"
                message="Are you sure you want to delete this expense record? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isDangerous={true}
            />

        </div>
    );
}
