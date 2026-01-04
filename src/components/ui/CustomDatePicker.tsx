
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, addDays, subDays, parseISO, isValid } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-day-picker/dist/style.css'

interface CustomDatePickerProps {
    date: string; // YYYY-MM-DD
    onChange: (newDate: string) => void;
}

export default function CustomDatePicker({ date, onChange }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Parse date safely
    const parsedDate = parseISO(date)
    const currentDate = isValid(parsedDate) ? parsedDate : new Date()

    // Handle clicks outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handlePrevDay = () => {
        const newDate = subDays(currentDate, 1)
        onChange(format(newDate, 'yyyy-MM-dd'))
    }

    const handleNextDay = () => {
        const newDate = addDays(currentDate, 1)
        onChange(format(newDate, 'yyyy-MM-dd'))
    }

    const handleDaySelect = (day: Date | undefined) => {
        if (day) {
            onChange(format(day, 'yyyy-MM-dd'))
            setIsOpen(false)
        }
    }

    // Custom CSS to override default react-day-picker styles for a "premium" look
    const css = `
        .rdp {
            --rdp-cell-size: 40px;
            --rdp-accent-color: #2563eb;
            --rdp-background-color: #eff6ff;
            margin: 0;
        }
        .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
            background-color: var(--rdp-accent-color);
            color: white;
            font-weight: bold;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
            background-color: #f1f5f9;
            color: #1e293b;
            font-weight: bold;
        }
        .rdp-month {
            background: white;
        }
        .rdp-caption { 
            padding-bottom: 10px;
            color: #0f172a;
        }
        .rdp-nav_button {
            color: #64748b;
        }
        .rdp-head_cell {
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
        }
    `

    return (
        <div className="relative font-sans" ref={containerRef}>
            <style>{css}</style>

            <div className="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm w-full">

                {/* Prev Button */}
                <button
                    onClick={handlePrevDay}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Main Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-1 flex items-center justify-center gap-2 px-1 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                    <CalendarIcon size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-bold text-sm md:text-base">
                        {format(currentDate, 'EEEE, MMM dd, yyyy')}
                    </span>
                </button>

                {/* Next Button */}
                <button
                    onClick={handleNextDay}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Popup Calendar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
                    >
                        <DayPicker
                            mode="single"
                            selected={currentDate}
                            onSelect={handleDaySelect}
                            showOutsideDays
                            fixedWeeks
                        />
                        <div className="mt-2 pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                            <button
                                onClick={() => {
                                    onChange(format(new Date(), 'yyyy-MM-dd'))
                                    setIsOpen(false)
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline"
                            >
                                Jump to Today
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
