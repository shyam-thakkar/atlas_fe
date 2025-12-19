import React from 'react';

// Helpers for Date Selection
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => (CURRENT_YEAR + 1 - i).toString());

interface DateSelectorProps {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    isEndDate?: boolean;
}

export function DateSelector({ label, value, onChange, isEndDate }: DateSelectorProps) {
    const isPresent = isEndDate && (value === 'Present' || !value);

    // Parse existing value
    let selectedMonth = '';
    let selectedYear = '';

    if (value && value !== 'Present') {
        // Try parsing ISO YYYY-MM-DD
        const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        
        if (isoMatch) {
            selectedYear = isoMatch[1];
            const mIndex = parseInt(isoMatch[2], 10) - 1;
            if (MONTHS[mIndex]) selectedMonth = MONTHS[mIndex];
        } else {
            // Fallback to "Month Year" format
            const parts = value.split(' ');
            if (parts.length >= 2) {
                if (MONTHS.includes(parts[0])) {
                    selectedMonth = parts[0];
                    selectedYear = parts[1];
                } else if (MONTHS.some(m => m.startsWith(parts[0]))) {
                    const match = MONTHS.find(m => m.startsWith(parts[0]));
                    if (match) selectedMonth = match;
                    selectedYear = parts[1];
                }
            } else if (parts.length === 1 && YEARS.includes(parts[0])) {
                selectedYear = parts[0];
            }
        }
    }

    const updateDate = (m: string, y: string) => {
        if (m && y) {
            const mIndex = MONTHS.indexOf(m);
            if (mIndex !== -1) {
                const monthStr = (mIndex + 1).toString().padStart(2, '0');
                onChange(`${y}-${monthStr}-01`);
            }
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const m = e.target.value;
        updateDate(m, selectedYear || YEARS[0]);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const y = e.target.value;
        updateDate(selectedMonth || MONTHS[0], y);
    };

    const togglePresent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onChange('Present');
        } else {
            onChange(`${MONTHS[0]} ${CURRENT_YEAR}`);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium block">{label}</label>

            {isEndDate && (
                <div className="flex items-center gap-2 mb-1">
                    <input
                        type="checkbox"
                        id={`chk-${label}-${Math.random()}`}
                        checked={isPresent || false}
                        onChange={togglePresent}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                    />
                    <label htmlFor={`chk-${label}`} className="text-xs text-gray-700 select-none cursor-pointer">I currently work here</label>
                </div>
            )}

            {(!isEndDate || !isPresent) && (
                <div className="flex gap-2">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-1/2 text-sm px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white font-normal"
                    >
                        <option value="" disabled>Month</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-1/2 text-sm px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white font-normal"
                    >
                        <option value="" disabled>Year</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            )}
            {isEndDate && isPresent && (
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
                    Present
                </div>
            )}
        </div>
    );
}
