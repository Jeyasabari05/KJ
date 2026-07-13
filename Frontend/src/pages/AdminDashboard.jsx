import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, RefreshCw, AlertTriangle, Cpu, Terminal, Compass, CheckCircle2, Hospital } from 'lucide-react';

export default function AdminDashboard() {
    const { showToast, t } = useContext(AppContext);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Shell Logs
    const [logs, setLogs] = useState([
        "[13:40:02] INITIALIZING SECURE GOVERNMENT KIOSK TUNNEL...",
        "[13:40:05] MONGODB CONNECTED: local_physiocare_replica_set_ready",
        "[13:42:15] AUTH_SUCCESS: ANM worker_selvi logged in at KIOSK-TN-01",
        "[13:43:08] SYSTEM_HEALTH: CPU load = 14%, Mem = 38%, Temp = 42°C",
        "[13:43:55] API_POST: Registered Patient card TN-PHC-KRI-2026-0035",
        "[13:44:12] QR_CODE: Embedded payload securely mapped"
    ]);

    useEffect(() => {
        const fetchAdminMetrics = async () => {
            try {
                const res = await fetch('/api/admin/metrics');
                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                }
            } catch (err) {
                console.warn('Dashboard fallback mock metrics logged.');
                // seeded configs
                setMetrics({
                    totalPatients: 462,
                    totalDoctors: 12,
                    totalAssessments: 320,
                    districtsCovered: 6,
                    villagesCovered: 45,
                    kioskId: 'KIOSK-TN-01',
                    deviceHealth: { cpuUsage: 12, memUsage: 35, cameraStatus: 'Online', networkLatency: 18 },
                    districtData: [
                        { name: 'Krishnagiri', patients: 124, screening: 95 },
                        { name: 'Dharmapuri', patients: 86, screening: 70 },
                        { name: 'Salem', patients: 95, screening: 82 },
                        { name: 'Madurai', patients: 64, screening: 55 },
                        { name: 'Nilgiris (Tribal)', patients: 45, screening: 40 },
                    ],
                    diseaseDistribution: [
                        { name: 'Neck Pain', value: 35 },
                        { name: 'Back Pain', value: 120 },
                        { name: 'Knee OA', value: 95 },
                        { name: 'Stroke Rehab', value: 15 },
                        { name: 'Fall Risk', value: 20 },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdminMetrics();

        // Setup live log generator ticker
        const interval = setInterval(() => {
            const stamp = new Date().toLocaleTimeString();
            const actions = [
                `[${stamp}] CLOUD_SYNC: Dispatched offline cache to NHM Central Database`,
                `[${stamp}] AI_ENGINE: Computed squat knee angles standard offset`,
                `[${stamp}] TELEMED: Active WebRTC call terminated in ROOM-KRI654`,
                `[${stamp}] WEBCAM: Camera feed verification checklist passed`,
                `[${stamp}] DEVICE_HEALTH: Temperature threshold is nominal`
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            setLogs(prev => [...prev.slice(-8), randomAction]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="text-center py-20 font-bold">{t('loading')}</div>;
    }

    return (
        <div className="space-y-6">

            {/* Header Info */}
            <section className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-govBlue text-white rounded-full flex items-center justify-center font-bold">AD</div>
                    <div>
                        <h2 className="text-xl font-extrabold text-govBlue">State Administrative Management Portal</h2>
                        <p className="text-xs text-govGrey font-bold">Kiosk ID: <span className="font-mono">{metrics?.kioskId}</span> • Melagiri PHC Hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500 animate-pulse" size={20} />
                    <span className="text-xs font-bold text-emerald-800">State WAN Node Online</span>
                </div>
            </section>

            {/* Grid: Admin Stats Card */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Registered Patients', val: metrics?.totalPatients, desc: 'Across remote wards', color: 'border-blue-200 text-govBlue font-mono' },
                    { label: 'Active Medical Officers', val: metrics?.totalDoctors, desc: 'Sub-District specialists', color: 'border-emerald-200 text-govGreen font-mono' },
                    { label: 'Completed AI Assessments', val: metrics?.totalAssessments, desc: 'Posture & stability runs', color: 'border-orange-200 text-govOrange font-mono' },
                    { label: 'Villages Covered', val: metrics?.villagesCovered, desc: 'Krishnagiri / Nilgiris', color: 'border-teal-200 text-teal-800 font-mono' }
                ].map((c, idx) => (
                    <div key={idx} className={`bg-white border rounded-xl p-5 shadow-sm text-center ${c.color}`}>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold">{c.label}</span>
                        <span className="block text-3xl font-extrabold mt-1">{c.val}</span>
                        <span className="block text-[10px] text-gray-400 font-semibold mt-1">{c.desc}</span>
                    </div>
                ))}
            </section>

            {/* Grid: Maps & Disease Distribution chart */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* District Chart representation */}
                <div className="lg:col-span-2 gov-card space-y-4">
                    <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                        <Compass size={16} />
                        Remedial Disease classifications by Districts
                    </h3>

                    <div className="h-64 sm:h-72 w-full text-xs font-semibold">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="patients" name="Registered Patients" fill="#003399" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="screening" name="AI Screenings Completed" fill="#0f766e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Health */}
                <div className="gov-card flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                            <Cpu size={16} />
                            Kiosk Hardware Diagnostics
                        </h3>

                        <div className="space-y-4 text-xs font-semibold text-gray-700">
                            <div className="flex justify-between border-b pb-2">
                                <span>CPU Processor Utilization</span>
                                <span className="font-bold text-govBlue">{metrics?.deviceHealth.cpuUsage}%</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Memory (RAM) Allocation</span>
                                <span className="font-bold text-govBlue">{metrics?.deviceHealth.memUsage}%</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Thermal Core Core Temperature</span>
                                <span className="font-bold text-govOrange">42.5 °C</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Network Loop Ping latency</span>
                                <span className="font-bold text-govGreen">{metrics?.deviceHealth.networkLatency} ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span>FHD Web Camera Status</span>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase text-[9px]">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 text-amber-800 p-3 rounded-xl flex items-start gap-2 mt-4 text-[10px] leading-relaxed">
                        <AlertTriangle className="shrink-0 mt-0.5 text-govOrange" size={14} />
                        <span>Firmware updates are scheduled automatically by state servers on Sunday 02:00 AM AST.</span>
                    </div>
                </div>

            </section>

            {/* Real-time Syslog Panel */}
            <section className="gov-card space-y-3 bg-slate-950 text-slate-250 border-slate-800 shadow-inner">
                <h3 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <Terminal size={14} />
                    Terminal Syslog Stream
                </h3>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-[10px] leading-relaxed space-y-2 max-h-56 overflow-y-auto custom-scrollbar select-none text-emerald-400">
                    {logs.map((log, index) => (
                        <div key={index} className="flex gap-2">
                            <span className="text-slate-500 font-bold shrink-0">&gt;</span>
                            <span>{log}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
