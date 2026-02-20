import React from 'react';
import { useStyle } from '../context/StyleContext';

const StyleToggle = () => {
    const { isIOS, toggleStyle } = useStyle();

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{
                color: isIOS ? '#5a6c7d' : '#9ca3af',
                transition: 'color 0.3s ease'
            }}>
                {isIOS ? 'iOS' : 'Default'}
            </span>
            <button
                onClick={toggleStyle}
                className="relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    backgroundColor: isIOS ? '#a8d8ea' : '#374151',
                    boxShadow: isIOS ? '0 4px 12px rgba(168, 216, 234, 0.4)' : 'none',
                    focusRingColor: isIOS ? '#a8d8ea' : '#3b82f6'
                }}
                aria-label="Toggle style"
            >
                <span
                    className="inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out"
                    style={{
                        backgroundColor: '#ffffff',
                        transform: isIOS ? 'translateX(30px)' : 'translateX(4px)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    {/* Icon inside toggle */}
                    <div className="flex items-center justify-center h-full">
                        {isIOS ? (
                            // iOS icon (sparkles)
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#a8d8ea" />
                                <path d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5L19 3Z" fill="#c5b9e6" />
                            </svg>
                        ) : (
                            // Default icon (moon/dark)
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#374151" />
                            </svg>
                        )}
                    </div>
                </span>
            </button>
        </div>
    );
};

export default StyleToggle;
