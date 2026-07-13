import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AlertOctagon, Phone, MapPin, Truck, ChevronRight, User } from 'lucide-react';

export default function EmergencySOS() {
    const { showToast, t } = useContext(AppContext);
    const [sosTriggered, setSosTriggered] = useState(false);
    const [eta, setEta] = useState(12);

    const handleSosTrigger = () => {
        setSosTriggered(true);
        showToast('🚨 EMERGENCY SOS ACTIVATED! Local PHC and 108 Ambulance notified.', 'error');
        // Start countdown simulation
        const interval = setInterval(() => {
            setEta(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 1;
                }
                return prev - 1;
            });
        }, 15000);
    };

    return (
        <div className="max-w-2xl mx-auto my-6 space-y-6 px-4">

            {/* SOS Trigger Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 text-center space-y-6">

                <div className="border-b pb-4">
                    <h2 className="text-2xl font-extrabold text-red-600 flex justify-center items-center gap-2">
                        <AlertOctagon size={28} className="animate-pulse text-red-650" />
                        {t('emergencySOSHub')}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold mt-1 tracking-wider">{t('dispatchText')}</p>
                </div>

                {/* SOS Button */}
                {!sosTriggered ? (
                    <button
                        onClick={handleSosTrigger}
                        className="w-48 h-48 sm:w-56 sm:h-56 bg-red-600 hover:bg-red-700 text-white rounded-full flex flex-col items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-105 active:scale-95 border-8 border-red-200 focus:outline-none focus:ring-4 focus:ring-red-400"
                    >
                        <span className="text-4xl font-extrabold tracking-wider">SOS</span>
                        <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest mt-2">
                            Trigger Alert
                        </span>
                    </button>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-left">
                        <div className="flex items-center gap-3">
                            <Truck className="text-red-600 animate-bounce" size={32} />
                            <div>
                                <h4 className="font-extrabold text-sm text-red-700">{t('ambulanceDispatched')}</h4>
                                <p className="text-xs text-red-600">{t('ambulanceRunning')}</p>
                            </div>
                        </div>

                        {/* ETA Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-red-700">
                                <span>{t('estimatedArrival')}</span>
                                <span className="font-mono">{eta} {t('minutes')}</span>
                            </div>
                            <div className="w-full bg-red-200 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${(12 - eta + 1) * 8.3}%` }}></div>
                            </div>
                        </div>

                        <div className="text-[10px] text-gray-500 font-semibold leading-relaxed border-t pt-3">
                            <span>
                                Emergency contact coordinates dispatched: Melagiri Tribal PHC Hub. ANM health worker Selvi is responding.
                            </span>
                        </div>
                    </div>
                )}

            </div>

            {/* Grid: Nearest PHCs & Hospitals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Nearest PHC */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[140px] space-y-3">
                    <div>
                        <h3 className="text-xs uppercase font-extrabold text-govBlue tracking-wider flex items-center gap-1">
                            <MapPin size={16} />
                            {t('nearestPHC')}
                        </h3>

                        <div className="border-b pb-2 mt-2">
                            <span className="block font-bold text-gray-800">Melagiri Primary Health Centre</span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">Distance: 0.8 km • Dr. S. Meenakshi</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1">
                        <a href="tel:04343104" className="flex items-center gap-1 text-govGreen font-bold hover:underline">
                            <Phone size={12} />
                            {t('callPHCDirectly')}
                        </a>
                        <span className="text-emerald-650 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250">
                            {t('online')}
                        </span>
                    </div>
                </div>

                {/* Nearest Hospital */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[140px] space-y-3">
                    <div>
                        <h3 className="text-xs uppercase font-extrabold text-govBlue tracking-wider flex items-center gap-1">
                            <MapPin size={16} />
                            {t('secondReferralHospital')}
                        </h3>

                        <div className="border-b pb-2 mt-2">
                            <span className="block font-bold text-gray-800">Krishnagiri District Head Hospital</span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">Distance: 14.5 km • 24/7 Trauma centre</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1">
                        <a href="tel:04343202" className="flex items-center gap-1 text-govGreen font-bold hover:underline">
                            <Phone size={12} />
                            {t('callEmergencyDesk')}
                        </a>
                        <span className="text-emerald-650 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250">
                            {t('online')}
                        </span>
                    </div>
                </div>

            </div>

        </div>
    );
}
