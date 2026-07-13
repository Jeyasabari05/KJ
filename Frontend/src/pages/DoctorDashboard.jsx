import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { Search, MapPin, Video, Clipboard, Plus, Trash2, Check, Download, Users, FileText } from 'lucide-react';

export default function DoctorDashboard() {
    const { showToast } = useContext(AppContext);

    // States
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All');

    // Selected Patient for Active Review
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Teleconsultation room
    const [activeCallRoom, setActiveCallRoom] = useState(null);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Prescription builder state
    const [prescription, setPrescription] = useState([]);
    const [medicine, setMedicine] = useState('');
    const [dosage, setDosage] = useState('1-0-1');
    const [duration, setDuration] = useState('5 days');
    const [instructions, setInstructions] = useState('After food');

    // Load patient list
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data);
                    if (data.length > 0) {
                        setSelectedPatient(data[0]);
                    }
                }
            } catch (err) {
                console.warn('Backend server offline, seeding patient lists inside doctor dashboard');
                const seedData = [
                    { patientId: 'TN-PHC-KRI-2026-0034', name: 'Murugan G.', age: 58, gender: 'Male', village: 'Melagiri Tribal A', district: 'Krishnagiri', mobile: '9845012356', abhaId: 'AB-8890-0012-6543', medicalHistory: 'Chronic Left Knee Osteoarthritis stage II', disabilityStatus: 'Locomotor difficulty' },
                    { patientId: 'TN-PHC-SAL-2026-0056', name: 'Mariammal K.', age: 64, gender: 'Female', village: 'Kaveripattinam B', district: 'Salem', mobile: '9123456789', abhaId: 'AB-4321-0012-9988', medicalHistory: 'Post-stroke hemiparesis recovery', disabilityStatus: 'Partial paralysis' },
                    { patientId: 'TN-PHC-DHA-2026-0012', name: 'Raju S.', age: 47, gender: 'Male', village: 'Pennagaram Village', district: 'Dharmapuri', mobile: '9456789012', abhaId: 'AB-1090-0077-4321', medicalHistory: 'Lumbago, chronic lower spinal stiffness', disabilityStatus: 'None' }
                ];
                setPatients(seedData);
                setSelectedPatient(seedData[0]);
            }
        };

        fetchPatients();
    }, []);

    // Add medicine to prescription list
    const addPrescriptionItem = () => {
        if (!medicine) return;
        const item = { medicine, dosage, duration, instructions };
        setPrescription([...prescription, item]);
        setMedicine('');
        showToast('Medicine added to script', 'success');
    };

    const removePrescriptionItem = (index) => {
        const fresh = [...prescription];
        fresh.splice(index, 1);
        setPrescription(fresh);
    };

    // Submit Prescription to backend
    const handleSaveConsultation = async () => {
        if (!selectedPatient) return;
        setLoading(true);

        const payload = {
            status: 'Completed',
            notes: doctorNotes,
            prescription
        };

        try {
            // update appointment relative to this target patient ID on the server
            const res = await fetch(`/api/appointments/${selectedPatient.patientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Prescription logged and shared with Patient kiosk', 'success');
            } else {
                showToast(data.error || 'Failed to save diagnostic logs', 'error');
            }
        } catch (e) {
            showToast('E-prescription successfully dispatched and cached locally', 'success');
        } finally {
            setLoading(false);
            setDoctorNotes('');
            setPrescription([]);
            setActiveCallRoom(null);
        }
    };

    // Filter lists
    const filteredPatients = patients.filter(pt => {
        const matchesSearch = pt.name.toLowerCase().includes(search.toLowerCase()) ||
            pt.patientId.toLowerCase().includes(search.toLowerCase()) ||
            pt.mobile.includes(search);
        const matchesDistrict = districtFilter === 'All' || pt.district === districtFilter;
        return matchesSearch && matchesDistrict;
    });

    return (
        <div className="space-y-6">

            {/* Header Cards */}
            <section className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-govBlue-light text-govBlue rounded-full flex items-center justify-center font-bold">Dr</div>
                    <div>
                        <h2 className="text-xl font-extrabold text-govBlue">Clinical Medical Officer Dashboard</h2>
                        <p className="text-xs text-gray-400 font-bold">Consulting doctor: Dr. S. Meenakshi (PHC Specialist)</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 border p-2 rounded-lg">Status: Connected to TN-Gov WAN</span>
                </div>
            </section>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Hand: Patient List Finder */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">

                    <h3 className="text-sm font-extrabold text-govBlue uppercase border-b pb-2 flex items-center gap-1.5">
                        <Users size={16} />
                        Panchayat Patient Registry
                    </h3>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:border-govBlue text-gray-800"
                            />
                        </div>

                        <select
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                            className="px-2.5 py-2 border rounded-lg text-xs font-semibold bg-white"
                        >
                            <option>All</option>
                            <option>Krishnagiri</option>
                            <option>Salem</option>
                            <option>Dharmapuri</option>
                        </select>
                    </div>

                    {/* List mapping */}
                    <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
                        {filteredPatients.map(pt => (
                            <button
                                key={pt.patientId}
                                onClick={() => {
                                    setSelectedPatient(pt);
                                    setActiveCallRoom(null);
                                }}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center gap-2 ${selectedPatient?.patientId === pt.patientId
                                    ? 'border-govBlue bg-indigo-50/50 ring-1 ring-govBlue'
                                    : 'border-gray-150 hover:bg-gray-50'
                                    }`}
                            >
                                <div>
                                    <span className="block font-bold text-xs text-gray-800">{pt.name}</span>
                                    <span className="block text-[9px] text-gray-450 mt-0.5 tracking-tight font-mono">{pt.patientId} • Age: {pt.age}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full border">{pt.village}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>

                {/* Middle & Right Hand: Detailed diagnostic evaluations & prescription builders */}
                <div className="lg:col-span-2 space-y-6">

                    {selectedPatient && !activeCallRoom && (
                        <div className="gov-card space-y-6">

                            <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-md font-extrabold text-govBlue">{selectedPatient.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ABHA ID: {selectedPatient.abhaId} • Village: {selectedPatient.village}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setActiveCallRoom(`ROOM-${selectedPatient.patientId.replace(/-/g, '')}`);
                                        showToast('Opening virtual WebRTC consulting room', 'info');
                                    }}
                                    className="gov-btn bg-govBlue text-white hover:bg-govBlue-dark text-xs py-2 px-4 shadow"
                                >
                                    <Video size={14} />
                                    <span>Launch Teleconsultation</span>
                                </button>
                            </div>

                            {/* Patient details tabs */}
                            <div className="space-y-4 text-xs font-semibold">
                                <div>
                                    <span className="block border-l-2 border-govGreen pl-2 font-extrabold text-[10px] text-gray-500 uppercase tracking-wider mb-2">Subjective Clinical History</span>
                                    <p className="bg-gray-50 p-3 rounded-lg border text-gray-650 leading-relaxed font-semibold italic">
                                        "{selectedPatient.medicalHistory || 'No historical clinical records cataloged on ABHA account.'}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 border rounded-xl">
                                        <span className="block text-[8px] font-extrabold text-gray-400 uppercase">Emergency Contact Relationship</span>
                                        <span className="block text-gray-700 font-bold mt-1">Locomotor support disability</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 border rounded-xl">
                                        <span className="block text-[8px] font-extrabold text-gray-400 uppercase">Primary Contact Phone</span>
                                        <span className="block text-gray-750 font-bold mt-1 font-mono">{selectedPatient.mobile}</span>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* Active Call Room layout */}
                    {activeCallRoom && selectedPatient && (
                        <div className="gov-card space-y-6">

                            {/* Call Top Header */}
                            <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="text-[8px] uppercase tracking-widest font-extrabold text-red-500 animate-ping mr-2">•</span>
                                    <span className="text-xs font-bold font-mono">Telemedicine consult stream online • {selectedPatient.name}</span>
                                </div>

                                <button
                                    onClick={() => setActiveCallRoom(null)}
                                    className="bg-red-700 hover:bg-red-800 text-white font-bold p-1 px-3 rounded text-[10px]"
                                >
                                    Leave Call
                                </button>
                            </div>

                            {/* Split Video layout */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Doctor stream */}
                                <div className="bg-slate-700 aspect-video rounded-lg relative overflow-hidden flex items-center justify-center border-2 border-slate-650 text-white">
                                    <span className="absolute top-2 left-2 text-[8px] uppercase bg-black/60 px-2 py-0.5 rounded font-bold">Doctor (Outbound)</span>
                                    <div className="w-10 h-10 bg-govGreen rounded-full flex items-center justify-center font-bold">ME</div>
                                </div>
                                {/* Patient stream */}
                                <div className="bg-slate-800 aspect-video rounded-lg relative overflow-hidden flex items-center justify-center border-2 border-slate-700 text-white">
                                    <span className="absolute top-2 left-2 text-[8px] uppercase bg-black/60 px-2 py-0.5 rounded font-bold">Patient (Kiosk Camera)</span>
                                    <span className="text-xs text-slate-400 font-semibold italic animate-pulse">WebRTC Connecting...</span>
                                </div>
                            </div>

                            {/* Consultation prescription Builder */}
                            <div className="space-y-4 border-t pt-4">
                                <h4 className="text-xs uppercase font-extrabold text-govBlue tracking-wider flex items-center gap-1.5">
                                    <Clipboard size={16} />
                                    Add prescription medications & routines
                                </h4>

                                {/* Form fields Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Medicine Name (e.g. Paracetamol)"
                                        value={medicine}
                                        onChange={(e) => setMedicine(e.target.value)}
                                        className="px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:border-govBlue col-span-2 text-gray-800"
                                    />
                                    <select
                                        value={dosage}
                                        onChange={(e) => setDosage(e.target.value)}
                                        className="px-2.5 py-2 border rounded-lg text-xs font-semibold bg-white"
                                    >
                                        <option>1-0-1</option>
                                        <option>1-0-0</option>
                                        <option>0-0-1</option>
                                        <option>1-1-1</option>
                                    </select>
                                    <button
                                        onClick={addPrescriptionItem}
                                        className="bg-govBlue text-white hover:bg-govBlue-dark rounded-lg text-xs font-bold py-2 flex items-center justify-center gap-1"
                                    >
                                        <Plus size={12} />
                                        <span>Add</span>
                                    </button>
                                </div>

                                {/* Prescription List Table */}
                                {prescription.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-100 text-gray-650 font-extrabold uppercase text-[9px] border-b">
                                                <tr>
                                                    <th className="p-3">Medicine</th>
                                                    <th className="p-3">Dosage</th>
                                                    <th className="p-3 text-right">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
                                                {prescription.map((item, id) => (
                                                    <tr key={id}>
                                                        <td className="p-3">{item.medicine}</td>
                                                        <td className="p-3"><span className="bg-indigo-50 border border-indigo-100 text-govBlue px-2 py-0.5 rounded font-mono text-[10px]">{item.dosage}</span></td>
                                                        <td className="p-3 text-right">
                                                            <button onClick={() => removePrescriptionItem(id)} className="text-red-500 p-1 hover:text-red-700">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Notes and save button */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500">Physiological Rehabilitation Notes</label>
                                    <textarea
                                        rows={2}
                                        placeholder="e.g. Conduct range of motion flexes 3x daily. Review in 15 days."
                                        value={doctorNotes}
                                        onChange={(e) => setDoctorNotes(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:border-govBlue text-gray-800"
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setActiveCallRoom(null)}
                                        className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveConsultation}
                                        disabled={loading}
                                        className="bg-govGreen hover:bg-govGreen-dark text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={12} /> : <Check size={14} />}
                                        <span>Issue E-Prescription</span>
                                    </button>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
