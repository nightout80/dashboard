import React, { createContext, useContext, useState } from 'react';

const StyleContext = createContext();

export const useStyle = () => {
    const context = useContext(StyleContext);
    if (!context) {
        throw new Error('useStyle must be used within a StyleProvider');
    }
    return context;
};

export const StyleProvider = ({ children }) => {
    const [currentStyle, setCurrentStyle] = useState('default'); // 'default' or 'ios'

    const toggleStyle = () => {
        setCurrentStyle(prev => prev === 'default' ? 'ios' : 'default');
    };

    const isIOS = currentStyle === 'ios';

    return (
        <StyleContext.Provider value={{ currentStyle, toggleStyle, isIOS }}>
            {children}
        </StyleContext.Provider>
    );
};
