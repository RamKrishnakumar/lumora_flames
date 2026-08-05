import React, { useRef } from 'react';
import { Flame, Sun, Moon,  Menu, X } from 'lucide-react'; 
// lucide-react: Lightweight, crisp SVG icons matching Apple's SF Symbols style
import { useTheme } from '../../context'; 
// Custom hook: Consumes theme state (light/dark) from ThemeContext
import { cn } from '../../lib/utils'; 
// cn utility: Safely merges Tailwind CSS class names
import gsap from 'gsap'; 
// gsap: Core Animation Library
import { useGSAP } from '@gsap/react'; 
// @gsap/react: React wrapper hook that handles GSAP lifecycle & garbage collection automatically

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Refs to scope GSAP animations cleanly
  const containerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease:'power3.out', duration: 0.8 } });

    // Header container slide down
    tl.fromTo(
      containerRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    // Logo reveal
    .fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      '-=0.4'
    )
    // Staggered reveal for desktop navigation links
    .fromTo(
      '.nav-item',
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.4 },
      '-=0.3'
    );
  }, { scope: containerRef });

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Collections' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

    return (
        <header
            ref={containerRef}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-stone-50/80 dark:bg-stone-950/80 border-b border-stone-200/60 dark:border-stone-800/60 shadow-sm transition-colors duration-500"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    {/* Brand Logo */}
                    <div
                        ref={logoRef}
                        onClick={() => setActiveTab('home')}
                        className="flex items-center gap-2.5 cursor-pointer group"
                    >
                        <div className="p-2 rounded-full bg-amber-500/30 dark:bg-amber-400/10 group-hover:scale-110 transition-transform duration-300">
                            <Flame className="w-5 h-5 text-amber-800 dark:text-amber-400 fill-amber-500/20" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                            LUMORA <span className="font-semibold text-amber-700 dark:text-amber-400">FLAMES</span>
                        </span>
                    </div>

                    {/* Desktop Navigation Links (Visible on md screens and up) */}
                    <nav ref={navContainerRef} className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        'nav-item text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-1',
                                        isActive
                                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                                    )}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle & Mobile Menu Trigger */}
                    <div className="flex items-center gap-3">
                        {/* Dark / Light Toggle Button using Moon & Sun */}
                        <button
                            onClick={toggleTheme}
                            className="px-3.5 py-1.5 rounded-full bg-stone-200/60 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-amber-400 flex items-center gap-2 text-xs font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                            title="Toggle Light / Dark Glow Mode"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                    <span className="hidden sm:inline">Candle Mode</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="hidden sm:inline">Daylight</span>
                                </>
                            )}
                        </button>

                        {/* Mobile Hamburger Button (Only visible on small screens) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
                            aria-label="Toggle Navigation Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-b border-stone-200 dark:border-stone-800 px-6 py-6 space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={cn(
                                'block w-full text-left text-sm font-medium py-1 transition-colors',
                                activeTab === item.id ? 'text-amber-500 font-semibold' : 'text-stone-600 dark:text-stone-400'
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
  );
};