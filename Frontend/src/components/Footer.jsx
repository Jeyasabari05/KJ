import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ShieldCheck, PhoneCall, Landmark, Mail } from 'lucide-react';

export default function Footer() {
    const { t } = useContext(AppContext);

    return (
        <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">

                    {/* Col 1: Government Authority */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Landmark size={20} className="text-emerald-400" />
                            <h3 className="font-extrabold text-white tracking-wide text-md">
                                {t('govermentTamilNadu')}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Department of Health and Family Welfare Department, Government of Tamil Nadu. Real-time AI joint screening and telemedicine deployment at the village grassroots.
                        </p>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {t('startupTN')}
                        </span>
                    </div>

                    {/* Col 2: Emergency Assistance Helpline Numbers */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-white text-md flex items-center gap-1.5">
                            <PhoneCall size={16} className="text-emerald-400" />
                            {t('emergencyHelplines')}
                        </h3>
                        <ul className="text-xs text-slate-400 flex flex-col gap-2">
                            <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span>{t('healthGeneralHelpline')}</span>
                                <span className="font-bold text-white">104</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span>{t('ambulanceDispatch108')}</span>
                                <span className="font-bold text-white">108</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>{t('maternalChildHealth')}</span>
                                <span className="font-bold text-white">102</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Disclaimer & Official Shield */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-white text-md flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            {t('officialVerification')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                            {t('disclaimerText')}
                        </p>
                    </div>

                </div>

                {/* Bottom Credits Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <p>© {new Date().getFullYear()} {t('nhm')} - Tamil Nadu. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="hover:text-white transition-colors cursor-pointer">{t('privacyPolicy')}</span>
                        <span className="hover:text-white transition-colors cursor-pointer">{t('termsOfUse')}</span>
                        <span className="hover:text-white transition-colors cursor-pointer">{t('accessibilityStatement')}</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
