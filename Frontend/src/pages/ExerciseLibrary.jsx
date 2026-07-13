import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { Play, Pause, RotateCcw, Volume2, Award, ClipboardCheck } from 'lucide-react';

export default function ExerciseLibrary() {
    const { speakText, voiceGuidance, showToast } = useContext(AppContext);

    // Exercise Categories
    const categories = ['Neck Pain', 'Back Pain', 'Knee OA', 'Stroke Rehab', 'Elderly Balance'];
    const [activeCategory, setActiveCategory] = useState('Knee OA');

    // Exercises DB
    const exercises = {
        'Neck Pain': [
            { id: 'n1', name: 'Chin Tucks Spinal Glide', duration: 15, sets: '3 sets x 10 reps', desc: 'Slightly retract head backwards while keeping chin tucked. Excellent for forward head postures.' },
            { id: 'n2', name: 'Isometric Neck Extension', duration: 20, sets: '3 sets x 8 reps', desc: 'Hold hands behind head, push backward against hand resistance holding alignment.' }
        ],
        'Back Pain': [
            { id: 'b1', name: 'Pelvic Tilting Bridges', duration: 30, sets: '3 sets x 12 reps', desc: 'Lie flat, flex knees, and elevate hips slightly holding lower core stability.' },
            { id: 'b2', name: 'Cat-Cow Spinal Flexes', duration: 25, sets: '3 sets x 10 reps', desc: 'Tabletop position, flex spine upward (cat) then sink downward (cow).' }
        ],
        'Knee OA': [
            { id: 'k1', name: 'Quadriceps Static Set', duration: 10, sets: '3 sets x 12 reps', desc: 'Press knee back down flat against a rolled towel under the knee joint, hold quadriceps tight.' },
            { id: 'k2', name: 'Seated Knee Extensions', duration: 15, sets: '3 sets x 10 reps', desc: 'Sit high, extend target leg completely straight, hold 3 seconds and slowly descend.' }
        ],
        'Stroke Rehab': [
            { id: 's1', name: 'Paretic Hand Grasp Releases', duration: 20, sets: '3 sets x 15 reps', desc: 'Open paretic fingers manually or actively, grasp soft ball and release slowly.' },
            { id: 's2', name: 'Ankle Dorsiflexion Glides', duration: 15, sets: '3 sets x 12 reps', desc: 'Slide foot backward and forward flexing ankle joint upward to resolve foot drop.' }
        ],
        'Elderly Balance': [
            { id: 'e1', name: 'Single Leg Stance Support', duration: 30, sets: '3 sets x 5 reps', desc: 'Stand near chair/wall. Elevate one foot, holding balance while support is close.' },
            { id: 'e2', name: 'Tandem Heel-Toe Walking', duration: 40, sets: '2 sets x 10 paces', desc: 'Walk slowly in a straight line placing heel directly in touch with opposite toe.' }
        ]
    };

    const activeCategoryList = exercises[activeCategory] || [];
    const [selectedEx, setSelectedEx] = useState(activeCategoryList[0]);

    // Stopwatch timer states
    const [timeLeft, setTimeLeft] = useState(selectedEx.duration);
    const [timerRunning, setTimerRunning] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);

    // Sync timer when exercise changes
    useEffect(() => {
        setTimeLeft(selectedEx.duration);
        setTimerRunning(false);
        setSessionCompleted(false);
    }, [selectedEx]);

    // Timer Tick Loop
    useEffect(() => {
        let timer;
        if (timerRunning && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);

                // Voice assistance pacing
                if (voiceGuidance && timeLeft === Math.floor(selectedEx.duration / 2)) {
                    speakText('Halfway done, maintain posture.');
                }
                if (voiceGuidance && timeLeft <= 4 && timeLeft > 1) {
                    speakText(String(timeLeft - 1));
                }
            }, 1000);
        } else if (timeLeft === 0 && timerRunning) {
            setTimerRunning(false);
            setSessionCompleted(true);
            if (voiceGuidance) {
                speakText('Exercise completed successfully. Well done.');
            }
            showToast(`Completed: ${selectedEx.name}`, 'success');
        }

        return () => clearTimeout(timer);
    }, [timerRunning, timeLeft]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Col 1: Categories and exercise selectors */}
            <div className="lg:col-span-1 space-y-6">

                {/* Categories select card */}
                <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-govBlue dark:text-blue-400 uppercase border-b dark:border-slate-700 pb-2">Therapeutic categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActiveCategory(c);
                                    setSelectedEx(exercises[c][0]);
                                }}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${activeCategory === c
                                        ? 'bg-govBlue text-white border-govBlue shadow-sm'
                                        : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-650 border-gray-200 dark:border-slate-600'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Drill selection list */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-3">
                    <h3 className="text-sm font-extrabold text-govBlue dark:text-blue-400 uppercase border-b dark:border-slate-700 pb-2">Select exercise</h3>
                    <div className="flex flex-col gap-2">
                        {activeCategoryList.map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => setSelectedEx(ex)}
                                className={`text-left p-3 rounded-lg border transition-all ${selectedEx.id === ex.id
                                        ? 'border-govGreen dark:border-emerald-500 bg-teal-50/50 dark:bg-emerald-950/20 text-govGreen dark:text-emerald-400 shadow-sm'
                                        : 'border-gray-150 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="block font-bold text-xs">{ex.name}</span>
                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{ex.sets}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Col 2 & 3: Selected exercise detail page & timer */}
            <div className="lg:col-span-2 space-y-6">

                {selectedEx && (
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">

                        {/* Header info */}
                        <div className="border-b dark:border-slate-700 pb-3 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-extrabold text-govBlue dark:text-blue-400">{selectedEx.name}</h2>
                                <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider bg-gray-105 dark:bg-slate-700 p-1 px-2.5 rounded-full border dark:border-slate-600 mt-1 inline-block">
                                    {selectedEx.sets}
                                </span>
                            </div>
                        </div>

                        {/* Description card */}
                        <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-900/40 p-4 border dark:border-slate-700 rounded-xl font-semibold">
                            {selectedEx.desc}
                        </p>

                        {/* Timer stopwatch widget */}
                        <div className="border border-gray-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-6 max-w-sm mx-auto shadow-inner bg-gray-50/50 dark:bg-slate-900/40">

                            {/* Dial visual */}
                            <div className="w-36 h-36 rounded-full border-4 border-govBlue dark:border-blue-500 flex flex-col items-center justify-center mx-auto bg-white dark:bg-slate-800 shadow relative">
                                <span className="text-4xl font-extrabold font-mono text-gray-800 dark:text-gray-100">{timeLeft}</span>
                                <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">SECONDS</span>
                            </div>

                            {/* Status alerts */}
                            {sessionCompleted ? (
                                <div className="flex items-center justify-center gap-1.5 text-xs text-govGreen dark:text-emerald-400 font-bold font-mono">
                                    <Award size={18} />
                                    <span>SESSION COMPLETED SUCCESSFULLY</span>
                                </div>
                            ) : (
                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold">CLICK START AND HOLD ALIGNMENT</span>
                            )}

                            {/* controls buttons */}
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setTimerRunning(!timerRunning)}
                                    className={`gov-btn p-3 px-6 text-white text-xs font-bold shadow ${timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-govBlue hover:bg-govBlue-dark'
                                        }`}
                                >
                                    {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                                    <span>{timerRunning ? 'Pause' : 'Start'}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setTimeLeft(selectedEx.duration);
                                        setTimerRunning(false);
                                        setSessionCompleted(false);
                                    }}
                                    className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-650 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-650 p-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                    <RotateCcw size={14} />
                                    <span>Reset</span>
                                </button>
                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}
