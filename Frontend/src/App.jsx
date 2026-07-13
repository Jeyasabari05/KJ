import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollingBanner from './components/ScrollingBanner';

// Pages Import (stubbing pages structure)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import HealthAssessment from './pages/HealthAssessment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TelemedicinePort from './pages/Telemedicine';
import ExerciseLibrary from './pages/ExerciseLibrary';
import EmergencySOS from './pages/Emergency';

// Creating Global Kiosk State Context
export const AppContext = createContext();

export default function App() {
    const lang = 'en'; // Fixed to English only
    const [theme, setTheme] = useState(localStorage.getItem('kiosk_theme') || 'light');
    const [highContrast, setHighContrast] = useState(localStorage.getItem('kiosk_contrast') === 'true');
    const [largeText, setLargeText] = useState(localStorage.getItem('kiosk_large_text') === 'true');
    const [voiceGuidance, setVoiceGuidance] = useState(localStorage.getItem('kiosk_voice') === 'true');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('kiosk_user')) || null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem('kiosk_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('kiosk_contrast', highContrast);
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        localStorage.setItem('kiosk_large_text', largeText);
    }, [largeText]);

    useEffect(() => {
        localStorage.setItem('kiosk_voice', voiceGuidance);
        if (voiceGuidance) {
            speakText('Voice assistant activated');
        }
    }, [voiceGuidance]);

    // Voice player helper
    const speakText = (text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const synthText = new SpeechSynthesisUtterance(text);
        synthText.lang = 'en-IN';
        synthText.rate = 0.85;
        window.speechSynthesis.speak(synthText);
    };

    // Toast alert trigger
    const showToast = (message, type = 'success') => {
        setNotification({ text: message, type });
        if (voiceGuidance) speakText(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem('kiosk_user', JSON.stringify(userData));
        localStorage.setItem('kiosk_token', userData.token);
        showToast(`Successfully logged in as ${userData.name}`, 'success');
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('kiosk_user');
        localStorage.removeItem('kiosk_token');
        showToast('Logged out successfully', 'info');
    };

    // Translate helper — always returns English
    const t = (key) => {
        return translations['en'][key] || key;
    };

    return (
        <AppContext.Provider value={{
            lang,
            theme,
            setTheme,
            highContrast,
            setHighContrast,
            largeText,
            setLargeText,
            voiceGuidance,
            setVoiceGuidance,
            user,
            loginUser,
            logoutUser,
            t,
            speakText,
            showToast,
            notification
        }}>
            <Router>
                <div className={`min-h-screen flex flex-col ${largeText ? 'text-xl' : 'text-base'} bg-gray-50 dark:bg-slate-900 text-gray-900 transition-colors duration-300 lg:pl-[70px]`}>

                    <Navbar />

                    {/* Scrolling Notification Ticker */}
                    <ScrollingBanner />

                    {/* Toast Notification Alert Overlay */}
                    {notification && (
                        <div className={`fixed top-24 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border animate-bounce ${notification.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            <span className="font-semibold">{notification.text}</span>
                        </div>
                    )}

                    {/* Main Routing Container */}
                    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-28 lg:pt-16">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/assessment" element={<HealthAssessment />} />
                            <Route path="/dashboard" element={<PatientDashboard />} />
                            <Route path="/doctor" element={user && user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
                            <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                            <Route path="/telemedicine/:roomId" element={<TelemedicinePort />} />
                            <Route path="/exercises" element={<ExerciseLibrary />} />
                            <Route path="/emergency" element={<EmergencySOS />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </AppContext.Provider>
    );
}
