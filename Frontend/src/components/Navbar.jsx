import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
    Home, UserPlus, ClipboardList, Dumbbell, PhoneCall,
    Siren, LayoutDashboard, LogIn, LogOut, User,
    Landmark, X, Sun, Moon, ChevronRight, Menu
} from 'lucide-react';

export default function Navbar() {
    const { user, logoutUser, t, speakText, voiceGuidance, theme, setTheme } = useContext(AppContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
        setMobileOpen(false);
    };

    const speak = (txt) => { if (voiceGuidance) speakText(txt); };

    const dashPath =
        !user ? '/login'
            : user.role === 'admin' ? '/admin'
                : user.role === 'doctor' ? '/doctor'
                    : '/dashboard';

    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/register', icon: UserPlus, label: 'Register Patient' },
        { to: '/assessment', icon: ClipboardList, label: 'AI Health Assessment' },
        { to: '/exercises', icon: Dumbbell, label: 'Exercise Library' },
        { to: '/telemedicine/room-1', icon: PhoneCall, label: 'Telemedicine' },
        { to: '/emergency', icon: Siren, label: 'Emergency SOS', danger: true },
    ];

    const isActive = (path) => location.pathname === path;

    // Shared row renderer
    const NavRow = ({ item, onClick }) => {
        const active = isActive(item.to);
        const Icon = item.icon;
        return (
            <Link
                to={item.to}
                onClick={() => { onClick?.(); speak(item.label); }}
                title={item.label}
                className={`
                    group relative flex items-center gap-3 w-full px-3 py-3 rounded-xl
                    transition-all duration-150 select-none overflow-hidden
                    ${active
                        ? item.danger
                            ? 'bg-red-600 text-white'
                            : 'bg-govBlue text-white'
                        : item.danger
                            ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue dark:hover:text-blue-300'
                    }
                `}
            >
                {/* Active accent line */}
                {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/60" />
                )}

                <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`}
                />

                {/* Label — hidden on desktop collapsed, visible when expanded/mobile */}
                <span className="text-sm font-semibold whitespace-nowrap leading-none sidebar-label">
                    {item.label}
                </span>
            </Link>
        );
    };

    return (
        <>
            {/* ── DESKTOP MINI SIDEBAR ─────────────────────────────────── */}
            <aside className="sidebar hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300">

                {/* Brand */}
                <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100 dark:border-slate-700 shrink-0 overflow-hidden min-h-[72px]">
                    <div className="w-10 h-10 shrink-0 bg-govBlue flex items-center justify-center rounded-full text-white font-extrabold border-2 border-white shadow">
                        <span className="text-[9px] text-center leading-none">TN<br />GOV</span>
                    </div>
                    <div className="sidebar-label overflow-hidden">
                        <p className="font-extrabold text-sm text-govBlue dark:text-blue-400 whitespace-nowrap">PhysioCare AI</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">PHC Kiosk · NHM</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => (
                        <NavRow key={item.to} item={item} />
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="px-2 pb-4 space-y-1 border-t border-gray-100 dark:border-slate-700 pt-3 shrink-0 overflow-hidden">

                    {/* Theme toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue dark:hover:text-blue-300 transition-all duration-150 group"
                    >
                        {theme === 'dark'
                            ? <Sun size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                            : <Moon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                        }
                        <span className="text-sm font-semibold whitespace-nowrap sidebar-label">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>

                    {/* User / Login */}
                    {user ? (
                        <>
                            <Link
                                to={dashPath}
                                title="My Dashboard"
                                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-150 group overflow-hidden
                                    ${isActive(dashPath)
                                        ? 'bg-govBlue text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue dark:hover:text-blue-300'
                                    }`}
                            >
                                <LayoutDashboard size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-semibold whitespace-nowrap sidebar-label truncate">
                                    {user.name.split(' ')[0]}'s Board
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                title="Logout"
                                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-150 group"
                            >
                                <LogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-semibold whitespace-nowrap sidebar-label">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            title="Login"
                            className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-150 group overflow-hidden
                                ${isActive('/login')
                                    ? 'bg-govBlue text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue dark:hover:text-blue-300'
                                }`}
                        >
                            <LogIn size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold whitespace-nowrap sidebar-label">Login / Sign In</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* ── MOBILE TOPBAR + OVERLAY DRAWER ───────────────────────── */}
            {/* Mobile top bar (burger + brand) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between px-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-govBlue flex items-center justify-center rounded-full text-white font-extrabold text-[9px] leading-none">
                        TN<br />GOV
                    </div>
                    <span className="font-extrabold text-sm text-govBlue dark:text-blue-400">PhysioCare AI</span>
                </div>
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </header>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile slide-in drawer */}
            <div className={`
                lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-white dark:bg-slate-900
                border-r border-gray-200 dark:border-slate-700 shadow-2xl flex flex-col
                transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-govBlue flex items-center justify-center rounded-full text-white font-extrabold">
                            <span className="text-[9px] text-center leading-none">TN<br />GOV</span>
                        </div>
                        <div>
                            <p className="font-extrabold text-sm text-govBlue dark:text-blue-400">PhysioCare AI</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">PHC Kiosk · NHM</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mobile nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.to);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => { setMobileOpen(false); speak(item.label); }}
                                className={`
                                    relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl
                                    transition-all duration-150 select-none
                                    ${active
                                        ? item.danger
                                            ? 'bg-red-600 text-white'
                                            : 'bg-govBlue text-white'
                                        : item.danger
                                            ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue dark:hover:text-blue-300'
                                    }
                                `}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-white/60" />
                                )}
                                <Icon size={20} className="shrink-0" />
                                <span className="text-sm font-semibold">{item.label}</span>
                                {active && <ChevronRight size={15} className="ml-auto opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile bottom */}
                <div className="px-3 pb-5 pt-3 border-t border-gray-100 dark:border-slate-700 space-y-1">
                    {user ? (
                        <>
                            <Link
                                to={dashPath}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-150
                                    ${isActive(dashPath) ? 'bg-govBlue text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue'}`}
                            >
                                <LayoutDashboard size={20} />
                                <span className="text-sm font-semibold">{user.name.split(' ')[0]}'s Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
                            >
                                <LogOut size={20} />
                                <span className="text-sm font-semibold">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-150
                                ${isActive('/login') ? 'bg-govBlue text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-govBlue'}`}
                        >
                            <LogIn size={20} />
                            <span className="text-sm font-semibold">Login / Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
