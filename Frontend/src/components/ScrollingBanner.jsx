import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Megaphone } from 'lucide-react';

const messages = [
    'HealthCare is a right, not a privilege.',
    'Through AI and Compassion, we bring care to every doorstep.',
    'PhysioCare AI Kiosk — Powered by StartupTN & NHM.',
    'Free physiotherapy screening available at your nearest PHC.',
    'Register today and receive your ABHA Digital Health Card.',
    'Emergency? Dial 108 — Ambulance reaches you within minutes.',
];

export default function ScrollingBanner() {
    const { theme } = useContext(AppContext);

    return (
        <div className="w-full h-12 overflow-hidden bg-govBlue dark:bg-indigo-950 border-b border-blue-700 dark:border-indigo-900/50 flex items-center justify-center shrink-0 select-none z-30 fixed top-14 lg:top-0 left-0 lg:left-[70px] right-0">
            {/* Scrolling track */}
            <div className="flex-1 overflow-hidden relative">
                <div className="ticker-track flex items-center gap-0 whitespace-nowrap">
                    {/* Duplicate for seamless loop */}
                    {[...messages, ...messages].map((msg, i) => (
                        <span key={i} className="inline-flex items-center text-xs font-semibold text-white dark:text-gray-200 px-8">
                            <span className="text-yellow-300 dark:text-yellow-400 mr-2 font-extrabold">◆</span>
                            {msg}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
