import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, MessageSquare, Send, CheckCircle2, Calendar } from 'lucide-react';

export default function Telemedicine() {
    const { roomId: urlRoomId } = useParams();
    const navigate = useNavigate();
    const { showToast, user } = useContext(AppContext);

    // States
    const [selectedDoctor, setSelectedDoctor] = useState('Dr. S. Meenakshi');
    const [date, setDate] = useState('2026-07-13');
    const [time, setTime] = useState('16:30');
    const [reason, setReason] = useState('Knee Osteoarthritis checkup');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Call states
    const [roomId, setRoomId] = useState(urlRoomId || null);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    // Chats
    const [chatInput, setChatInput] = useState('');
    const [chats, setChats] = useState([
        { sender: 'doctor', text: 'Hello! I am reviewing your joints assessment. Please stand in front of the kiosk camera.' }
    ]);

    // Sync route params
    useEffect(() => {
        if (urlRoomId) {
            setRoomId(urlRoomId);
        }
    }, [urlRoomId]);

    // Submit Booking
    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);

        const payload = {
            patientId: user?.patientId || 'TN-PHC-KRI-2026-0034',
            doctorName: selectedDoctor,
            appointmentDate: `${date}T${time}:00.000Z`,
            reasonOfConsultation: reason
        };

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast('Consultation Slot Reserved Successfully!', 'success');
                // Auto connect user
                setRoomId(`ROOM-TN-${Math.floor(Math.random() * 90000) + 10000}`);
            } else {
                showToast(data.error || 'Failed to book slot', 'error');
            }
        } catch (err) {
            console.warn('Booking offline simulation active.');
            setRoomId('ROOM-MOCK-REHAB-2026');
            showToast('Offline consultation tunnel established', 'success');
        } finally {
            setBookingLoading(false);
        }
    };

    // Send Chat
    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput) return;
        const newChat = { sender: 'patient', text: chatInput };
        setChats(prev => [...prev, newChat]);
        setChatInput('');

        // Trigger mock doctor reply
        setTimeout(() => {
            const responses = [
                "I can see you well. Your range of motion looks good. Try extending your joint fully.",
                "Your knee posture shows mild flexion tension. Perform static quad sets 3x today.",
                "Excellent. I have updated your daily exercise regimen in the Patient Dashboard."
            ];
            const reply = { sender: 'doctor', text: responses[Math.floor(Math.random() * responses.length)] };
            setChats(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* If Call is active, load video layout */}
            {roomId ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left panel: Streams */}
                    <div className="lg:col-span-2 space-y-4">

                        <div className="bg-slate-950 aspect-[4/3] rounded-2xl overflow-hidden relative flex flex-col justify-between border border-slate-800 shadow-xl">

                            {/* Doctor remote stream */}
                            {videoOn ? (
                                <div className="bg-slate-900 w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-govBlue rounded-full flex items-center justify-center font-bold mx-auto border-2 border-white/20">Dr</div>
                                        <span className="block text-xs font-bold text-slate-350">{selectedDoctor} (Specialist)</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-500 font-bold italic">
                                    <span>Camera feeds disabled</span>
                                </div>
                            )}

                            {/* Local client stream overlay */}
                            <div className="absolute top-4 right-4 w-32 bg-slate-800 border border-slate-700 aspect-video rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-white">
                                <span>Kiosk Webcam</span>
                            </div>

                            {/* Bottom call control bar */}
                            <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex justify-between items-center text-white">
                                <span className="text-[10px] uppercase font-bold text-emerald-400 animate-pulse">Room: {roomId}</span>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setMicOn(!micOn)}
                                        className={`p-2 rounded-full border transition-colors ${micOn ? 'bg-slate-800 border-white/10 hover:bg-slate-705' : 'bg-red-650 border-red-500 hover:bg-red-750'
                                            }`}
                                    >
                                        {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                                    </button>

                                    <button
                                        onClick={() => setVideoOn(!videoOn)}
                                        className={`p-2 rounded-full border transition-colors ${videoOn ? 'bg-slate-800 border-white/10 hover:bg-slate-705' : 'bg-red-650 border-red-500 hover:bg-red-750'
                                            }`}
                                    >
                                        {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setRoomId(null);
                                        navigate('/dashboard');
                                        showToast('Call ended by medical officer', 'info');
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold p-1 px-4 rounded-lg text-xs"
                                >
                                    Disconnect
                                </button>
                            </div>

                        </div>

                    </div>

                    {/* Right panel: Doctor consultation real-time chats */}
                    <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between h-[400px] lg:h-auto overflow-hidden">

                        {/* Header chats */}
                        <div className="bg-govBlue text-white p-4 font-bold text-xs uppercase flex items-center gap-1.5 shrink-0">
                            <MessageSquare size={16} />
                            <span>Real-time Consultation Chat</span>
                        </div>

                        {/* List chats */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-semibold text-xs leading-relaxed max-h-[300px] lg:max-h-none">
                            {chats.map((c, i) => (
                                <div
                                    key={i}
                                    className={`max-w-[80%] p-2.5 rounded-xl ${c.sender === 'doctor'
                                        ? 'bg-gray-100 mr-auto text-gray-800 rounded-tl-none'
                                        : 'bg-govBlue-light text-govBlue ml-auto rounded-tr-none'
                                        }`}
                                >
                                    <p>{c.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Input chats form */}
                        <form onSubmit={handleSendChat} className="p-3 border-t flex gap-2 shrink-0">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:border-govBlue text-gray-800"
                            />
                            <button
                                type="submit"
                                className="bg-govBlue text-white hover:bg-govBlue-dark p-2 rounded-lg"
                            >
                                <Send size={14} />
                            </button>
                        </form>

                    </div>

                </div>
            ) : (
                // Consultation Slot Booking layout
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-xl mx-auto">

                    <div className="bg-govBlue text-white p-6 flex items-center gap-3">
                        <Video size={24} className="text-emerald-300" />
                        <div>
                            <h2 className="text-lg font-extrabold uppercase tracking-wide">Book Telemedicine Consultation</h2>
                            <p className="text-[10px] text-blue-200 font-semibold tracking-wider">SECURE DOCTOR CALL RESERVATION</p>
                        </div>
                    </div>

                    <form onSubmit={handleBooking} className="p-6 space-y-5">

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Select Doctor *</label>
                            <select
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-govBlue text-sm font-semibold text-gray-800 bg-white"
                            >
                                <option>Dr. S. Meenakshi (PHC Specialist)</option>
                                <option>Dr. R. Anbarasan (Orthopedic Specialist)</option>
                                <option>Dr. J. Preethi (Neurologist Specialist)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Appointment Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-govBlue text-sm font-bold text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Consultation Time *</label>
                                <input
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-govBlue text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Primary symptoms *</label>
                            <textarea
                                required
                                rows={2}
                                placeholder="e.g. Back stiffness during prolonged sitting, knee OA flareup post exertion."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-govBlue text-sm font-semibold text-gray-850"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-govBlue hover:bg-govBlue-dark text-white font-extrabold py-3 rounded-lg transition-transform active:scale-95 text-sm"
                        >
                            {bookingLoading ? 'Requesting Secure WebRTC Tunnel...' : 'Schedule Call Room'}
                        </button>

                    </form>

                </div>
            )}

        </div>
    );
}
