import React from 'react';

interface CustomDatePickerProps {
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder = '',
    className = '',
    required = false
}) => {
    return (
        <div className="relative">
            <input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value || null)}
                placeholder={placeholder}
                className={`${className} datepicker pr-10`}
                required={required}
            />
            <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.parentElement?.querySelector('input[type="date"]') as HTMLInputElement;
                    if (input) {
                        input.focus();
                        input.showPicker();
                    }
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </button>
        </div>
    );
};

export default CustomDatePicker;