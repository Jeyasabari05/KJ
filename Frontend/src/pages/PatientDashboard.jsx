import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { User, Activity, Calendar, ShieldCheck, Heart, AlertCircle, PlaySquare, Bell } from 'lucide-react';

export default function PatientDashboard() {
    const { user, showToast, t } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    // Patient profile details
    const [profile, setProfile] = useState({
        patientId: 'TN-PHC-KRI-2026-0034',
        name: 'Murugan G.',
        age: 58,
        gender: 'Male',
        village: 'Melagiri Tribal A',
        district: 'Krishnagiri',
        abhaId: 'AB-8890-0012-6543',
        mobile: '9845012356',
        medicalHistory: 'Chronic Left Knee Osteoarthritis stage II, localized stiffness.',
        disabilityStatus: 'Locomotor difficulty'
    });

    // Health Metrics
    const [metrics, setMetrics] = useState({
        overallHealth: 74,
        painIndex: 4,
        bmi: 23.4,
        mobility: 72,
        balance: 80,
        flexibility: 68
    });

    // Recharts Progress Data
    const progressData = [
        { week: 'Week 1', pain: 7, mobility: 55, flexibility: 50 },
        { week: 'Week 2', pain: 6, mobility: 60, flexibility: 58 },
        { week: 'Week 3', pain: 5, mobility: 65, flexibility: 62 },
        { week: 'Week 4', pain: 4, mobility: 72, flexibility: 68 }
    ];

    // Fetch true patient details from server if logged in
    useEffect(() => {
        const fetchPatientData = async () => {
            if (user && user.patientId) {
                try {
                    const res = await fetch(`/api/patients/${user.patientId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setProfile(data);

                        // Fetch assessments to calibrate true metrics
                        const astRes = await fetch(`/api/assessments/${data.patientId}`);
                        if (astRes.ok) {
                            const asts = await astRes.json();
                            if (asts.length > 0) {
                                const latest = asts[0];
                                setMetrics({
                                    overallHealth: latest.healthScore,
                                    painIndex: latest.painScore,
                                    bmi: latest.bmi,
                                    mobility: latest.mobility,
                                    balance: latest.balance,
                                    flexibility: latest.flexibility
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Dashboard loaded using mocked state.');
                }
            }
            setLoading(false);
        };

        fetchPatientData();
    }, [user]);

    if (loading) {
        return <div className="text-center py-20 font-bold">{t('loading')}</div>;
    }

    return (
        <div className="space-y-6">

            {/* Welcome Banner */}
            <section className="bg-govBlue text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
                <div>
                    <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Citizen Digital Portal</span>
                    <h2 className="text-2xl font-extrabold mt-2">Welcome Back, {profile.name}!</h2>
                    <p className="text-xs text-blue-200 mt-1">ID: <span className="font-mono">{profile.patientId}</span> • Panchayat PHC: Melagiri</p>
                </div>
                <Link
                    to="/assessment"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 px-5 rounded-lg border border-emerald-400 text-sm active:scale-95 transition-transform"
                >
                    Start New Health Scan
                </Link>
            </section>

            {/* Grid: Health Metrics */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Overall Health Index', val: `${metrics.overallHealth}%`, desc: metrics.overallHealth > 70 ? 'Optimal recovery' : 'Attention needed', color: 'border-emerald-200 text-emerald-800' },
                    { label: 'Pain Intensity', val: `${metrics.painIndex}/10`, desc: 'Osteoarthritis Knee', color: 'border-orange-200 text-govOrange' },
                    { label: 'Joint Mobility', val: `${metrics.mobility}%`, desc: 'Range of Motion', color: 'border-blue-205 text-govBlue' },
                    { label: 'Flexibility Score', val: `${metrics.flexibility}%`, desc: 'Limb Extension', color: 'border-teal-200 text-teal-800' }
                ].map((m, idx) => (
                    <div key={idx} className={`bg-white border rounded-xl p-5 shadow-sm text-center ${m.color}`}>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold">{m.label}</span>
                        <span className="block text-3xl font-extrabold mt-1 font-mono">{m.val}</span>
                        <span className="block text-[10px] text-gray-400 font-semibold mt-1">{m.desc}</span>
                    </div>
                ))}
            </section>

            {/* Grid: Charts & Daily exercises */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Progress Chart */}
                <div className="lg:col-span-2 gov-card space-y-4">
                    <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                        <Activity size={16} />
                        Rehab joints recovery trends
                    </h3>

                    <div className="h-64 sm:h-72 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" fontStyle="bold" stroke="#6b7280" />
                                <YAxis domain={[0, 100]} fontStyle="bold" stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="mobility" name="Joint Mobility (%)" stroke="#003399" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="flexibility" name="Flexibility (%)" stroke="#0f766e" strokeWidth={3} />
                                <Line type="monotone" dataKey="pain" name="Pain Score (*10)" stroke="#ea580c" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Daily Prescribed Exercises */}
                <div className="gov-card flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                            <PlaySquare size={16} className="text-govGreen" />
                            Prescribed Exercise Regimen
                        </h3>

                        <div className="space-y-3">
                            {[
                                { name: 'Knee Extension Flexes', time: '10 mins', sets: '3 sets x 12 reps', focus: 'Knee OA strength' },
                                { name: 'Straight Leg Raises', time: '8 mins', sets: '3 sets x 10 reps', focus: 'Quadriceps lift' },
                                { name: 'Wall Slide Holds', time: '5 mins', sets: '5 holds', focus: 'Patellar tracking' }
                            ].map((ex, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between gap-2 hover:border-govBlue transition-colors group">
                                    <div>
                                        <span className="block font-bold text-xs text-gray-800">{ex.name}</span>
                                        <span className="block text-[10px] text-gray-400 font-semibold">{ex.sets} • {ex.focus}</span>
                                    </div>
                                    <Link
                                        to="/exercises"
                                        className="bg-govBlue group-hover:bg-govBlue-dark hover:scale-105 transition-transform text-white font-bold p-1 px-3 rounded text-[10px]"
                                    >
                                        Start
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        to="/exercises"
                        className="w-full text-center text-xs font-bold text-govGreen hover:underline pt-4 border-t border-gray-100 flex items-center justify-center gap-1"
                    >
                        Open Full Exercise Library →
                    </Link>
                </div>

            </section>

            {/* Section: Medical Appointments and reminders */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Appointments */}
                <div className="gov-card space-y-4">
                    <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                        <Calendar size={16} />
                        Upcoming Telemedicine Consultations
                    </h3>

                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="bg-emerald-600 text-white font-bold text-[8px] uppercase px-2 py-0.5 rounded-full">Confirmed Room</span>
                            <h4 className="font-extrabold text-xs text-govGreen mt-1 px-0.5">Dr. R. Anbarasan (Orthopedic Specialist)</h4>
                            <p className="text-[10px] text-emerald-800 font-semibold px-0.5 mt-0.5">Today • 4:30 PM (Vellore Main Town)</p>
                        </div>
                        <Link
                            to="/telemedicine/ROOM-TNPHCKRI2026-987"
                            className="gov-btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-4 shadow-sm"
                        >
                            Join Video
                        </Link>
                    </div>
                </div>

                {/* Medication Alerts */}
                <div className="gov-card space-y-4">
                    <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                        <Bell size={16} />
                        Elderly Medication Reminders
                    </h3>

                    <div className="space-y-2">
                        {[
                            { name: 'Calcium Supplement (500mg)', schedule: 'After Food (Morning - Night)', dose: '1-0-1' },
                            { name: 'Glucosamine Joint Support', schedule: 'Before Food (Morning)', dose: '1-0-0' }
                        ].map((med, idx) => (
                            <div key={idx} className="bg-gray-50 border p-3 rounded-lg flex items-center justify-between gap-4 text-xs font-semibold text-gray-700">
                                <div>
                                    <span className="block font-bold text-gray-800">{med.name}</span>
                                    <span className="block text-[9px] text-gray-400 mt-0.5">{med.schedule}</span>
                                </div>
                                <span className="bg-govBlue-light border border-indigo-100 text-govBlue px-2.5 py-1 rounded-md font-mono text-[10px] font-extrabold">{med.dose}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

        </div>
    );
}
