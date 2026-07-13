import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Activity, ShieldCheck, Heart, UserPlus, FileHeart, Calendar, MapPin, Smile, Award, Landmark } from 'lucide-react';

export default function LandingPage() {
    const { t, speakText, voiceGuidance } = useContext(AppContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        villages: 120,
        screened: 8400,
        assessments: 5900,
        successRate: 88.5
    });

    useEffect(() => {
        if (voiceGuidance) speakText(t('welcome'));

        const interval = setInterval(() => {
            setStats(prev => ({
                villages: Math.min(prev.villages + 1, 380),
                screened: Math.min(prev.screened + 24, 18206),
                assessments: Math.min(prev.assessments + 18, 12870),
                successRate: parseFloat(Math.min(prev.successRate + 0.1, 94.2).toFixed(1))
            }));
        }, 40);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-12">

            {/* ── Hero Section ─────────────────────────────────────────── */}
            <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border border-blue-100 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">

                {/* Background waves */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,100 C150,200 350,0 500,100 C650,200 850,50 1000,150 L1000,300 L0,300 Z" fill="#003399" />
                    </svg>
                </div>

                {/* Text Area */}
                <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-govGreen dark:text-emerald-400 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm border border-emerald-200 dark:border-emerald-700">
                        <Activity size={16} />
                        <span>Digital India Initiative | ABDM Integrated Route</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-govBlue dark:text-blue-400 tracking-tight leading-tight">
                        {t('heroTitle')}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                        {t('heroSubtitle')}
                    </p>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                        <Link
                            to="/register"
                            className="gov-btn bg-govBlue text-white hover:bg-govBlue-dark shadow-md text-lg focus:ring-4 focus:ring-blue-200"
                        >
                            <UserPlus size={20} />
                            <span>{t('register')}</span>
                        </Link>

                        <Link
                            to="/assessment"
                            className="gov-btn bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500 text-govGreen dark:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-600 text-lg shadow-sm"
                        >
                            <FileHeart size={20} />
                            <span>{t('assessment')}</span>
                        </Link>

                        <Link
                            to="/login"
                            className="px-5 py-3 font-bold text-gray-600 dark:text-gray-400 hover:text-govBlue dark:hover:text-blue-400 hover:underline transition-all text-sm rounded-lg"
                        >
                            Staff Portal Login →
                        </Link>
                    </div>
                </div>

                {/* Kiosk Visual */}
                <div className="w-full max-w-[380px] lg:max-w-[420px] aspect-[4/5] bg-slate-900 rounded-2xl p-6 shadow-2xl border-4 border-slate-700 flex flex-col relative animate-pulse justify-between text-white">
                    <div className="flex justify-between items-center bg-govBlue p-3 rounded-xl border border-blue-700">
                        <div className="flex items-center gap-1.5">
                            <Landmark size={18} className="text-emerald-400" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">TN-PHC KIOSK #01</span>
                        </div>
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                    </div>

                    <div className="my-4 flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
                            <Heart size={36} className="text-emerald-400 animate-pulse" />
                            <div className="absolute inset-0 border-t-4 border-blue-400 rounded-full animate-spin" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase font-extrabold text-blue-400 tracking-wider">Place Feet On Platform</p>
                            <h3 className="text-sm font-bold text-slate-300">Webcam Camera Grid Activated</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded">MediaPipe Pose v2</span>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded">1080p Lens OK</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                        <div className="bg-slate-800 p-2 rounded">Finger Scanner</div>
                        <div className="bg-slate-800 p-2 rounded">ECG Sensor</div>
                        <div className="bg-slate-800 p-2 rounded">QR Code Reader</div>
                    </div>
                </div>
            </section>

            {/* ── Partner Logos Banner ──────────────────────────────────── */}
            <section className="bg-white dark:bg-slate-800/60 border-y border-gray-100 dark:border-slate-700 py-6 px-4 rounded-2xl">
                <h4 className="text-center text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-4">
                    Integrated Government Ecosystem &amp; Partners
                </h4>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
                    {['Ayushman Bharat ABDM', t('nhm'), t('startupTN'), 'e-Sevai Portal Digital'].map((name) => (
                        <span
                            key={name}
                            className="font-extrabold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-4 py-1.5 rounded text-sm text-center"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats Counter Grid ────────────────────────────────────── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    {
                        label: t('villagesCovered'),
                        val: stats.villages,
                        suffix: '+',
                        desc: 'Remote & Tribal Panchayats',
                        light: 'border-blue-200 bg-indigo-50/60 text-govBlue',
                        dark: 'dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                        descDark: 'dark:text-blue-300/60'
                    },
                    {
                        label: t('patientsScreened'),
                        val: stats.screened.toLocaleString(),
                        suffix: '',
                        desc: 'Total registrations',
                        light: 'border-emerald-200 bg-emerald-50/60 text-govGreen',
                        dark: 'dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
                        descDark: 'dark:text-emerald-300/60'
                    },
                    {
                        label: t('aiAssessments'),
                        val: stats.assessments.toLocaleString(),
                        suffix: '',
                        desc: 'Automated postures executed',
                        light: 'border-orange-200 bg-amber-50/60 text-amber-700',
                        dark: 'dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
                        descDark: 'dark:text-orange-300/60'
                    },
                    {
                        label: t('recoverySuccessRate'),
                        val: stats.successRate,
                        suffix: '%',
                        desc: 'Documented patient recovery',
                        light: 'border-teal-200 bg-teal-50/60 text-teal-800',
                        dark: 'dark:border-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
                        descDark: 'dark:text-teal-300/60'
                    }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className={`border rounded-2xl p-6 text-center select-none shadow-sm transition-transform hover:scale-[1.02] ${item.light} ${item.dark}`}
                    >
                        <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                            {item.val}{item.suffix}
                        </span>
                        <span className="block font-bold mt-1 text-sm">{item.label}</span>
                        <span className={`block text-[10px] text-gray-500 mt-0.5 ${item.descDark}`}>{item.desc}</span>
                    </div>
                ))}
            </section>

            {/* ── Vision & Novelty Cards ────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Core Vision */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xl font-extrabold text-govBlue dark:text-blue-400 flex items-center gap-2">
                            <Landmark size={22} className="text-teal-600 dark:text-teal-400" />
                            {t('visionRuralImpact')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Providing modern, accessibility-first rehabilitation to rural areas where physical physiotherapists cannot logistically visit daily. Through AI joint angle skeleton tracing and local Anganwadi/ANM healthcare workers, we empower villagers to obtain high-quality physiotherapy closer to home.
                        </p>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2 pl-2">
                            {[
                                'No internet dependency: support for localized offline buffering',
                                'ABHA ID integration for structured health registries',
                                'Accessible interface tailored for senior citizens'
                            ].map((point, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-govBlue dark:bg-blue-400 rounded-full shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6 border-t border-gray-100 dark:border-slate-700 pt-4 flex gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                        <span>{t('sdg3')}</span>
                        <span>•</span>
                        <span>{t('sdg10')}</span>
                    </div>
                </div>

                {/* Novelty & Technology */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xl font-extrabold text-govBlue dark:text-blue-400 flex items-center gap-2">
                            <Award size={22} className="text-teal-600 dark:text-teal-400" />
                            {t('noveltyTechnology')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Equipped with a computer vision camera and dynamic exercise tracking. Instant gait, joints, stability, and fall-risk estimations generate interactive rehabilitation dashboards for doctors back at the town hospitals.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {[
                                { title: 'MediaPipe Pose Tracker', desc: 'Realtime skeleton joint angle mapping' },
                                { title: 'ABHA Connectivity', desc: 'Universal Digital Health ID profile lookup' }
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-slate-600"
                                >
                                    <span className="block font-bold text-xs text-govBlue dark:text-blue-400">{card.title}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{card.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-100 dark:border-slate-700 pt-4 flex items-center gap-1.5 text-xs font-bold text-govGreen dark:text-emerald-400">
                        <Smile size={16} />
                        <span>Over 98% Patient Satisfaction Score</span>
                    </div>
                </div>

            </section>

        </div>
    );
}
