import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

//Create Context Object
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//Custom Hook for consuming the theme safely
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if(!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}