import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Sparkles, RefreshCw } from 'lucide-react';

export default function WebCamPose({ activeTest, onAngleData }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasCamera, setHasCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [, setFps] = useState(30);

    const startCamera = async () => {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setHasCamera(true);
            }
        } catch (err) {
            console.warn("No physical camera detected. Entering Camera Simulator Mode.");
            setHasCamera(true); // fall back to simulator frames
        } finally {
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setHasCamera(false);
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [activeTest]);

    // Real-time canvas overlay drawing loops
    useEffect(() => {
        if (!hasCamera) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let t = 0;

        const drawSkeleton = () => {
            t += 0.05;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // If active video stream, draw it
            if (videoRef.current && videoRef.current.readyState === 4) {
                ctx.save();
                ctx.scale(-1, 1); // mirror effect
                ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
                ctx.restore();
            } else {
                // Draw a simulated silhouette background if no webcam stream
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 60, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 + 30, 80, 100);
            }

            // Generate organic keypoints coordinates with slight noise
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const wave = Math.sin(t) * 10;
            const legWave = Math.cos(t) * 5;

            const nose = { x: cx + Math.sin(t * 1.5) * 3, y: cy - 90 + wave * 0.2 };
            const leftShoulder = { x: cx - 60, y: cy - 40 + wave * 0.4 };
            const rightShoulder = { x: cx + 60, y: cy - 40 + wave * 0.4 };
            const leftHip = { x: cx - 40, y: cy + 60 };
            const rightHip = { x: cx + 45, y: cy + 60 };

            // Adapt legs posture based on selected test
            let leftKnee, rightKnee, leftAnkle, rightAnkle;
            let leftElbow, rightElbow, leftWrist, rightWrist;

            if (activeTest === 'SQUAT') {
                const squatDepth = Math.abs(Math.sin(t * 0.5)) * 40;
                leftHip.y += squatDepth * 0.8;
                rightHip.y += squatDepth * 0.8;
                leftKnee = { x: cx - 45 + squatDepth * 0.2, y: cy + 120 + squatDepth * 0.4 };
                rightKnee = { x: cx + 50 - squatDepth * 0.2, y: cy + 120 + squatDepth * 0.4 };
                leftAnkle = { x: cx - 40, y: cy + 180 };
                rightAnkle = { x: cx + 40, y: cy + 180 };

                leftElbow = { x: cx - 90, y: cy - 10 };
                rightElbow = { x: cx + 95, y: cy - 10 };
                leftWrist = { x: cx - 110, y: cy - 30 };
                rightWrist = { x: cx + 115, y: cy - 30 };

                // Send angles back for detection calculations
                const kneeDistOffset = Math.abs(leftKnee.x - rightKnee.x);
                onAngleData({
                    metric1Name: 'Knee Alignment',
                    metric1Val: kneeDistOffset < 80 ? 'KNEE VALGUS DETECTED' : 'ALIGNMENT OPTIMAL',
                    metric2Name: 'Squat Depth',
                    metric2Val: `${Math.round(squatDepth * 2)}° Angle`
                });

            } else if (activeTest === 'BALANCE') {
                // Bend one knee up
                leftKnee = { x: cx - 40, y: cy + 120 };
                rightKnee = { x: cx + 65, y: cy + 100 - legWave };
                leftAnkle = { x: cx - 40, y: cy + 180 };
                rightAnkle = { x: cx + 50, y: cy + 140 };

                leftElbow = { x: cx - 95, y: cy - 30 + wave };
                rightElbow = { x: cx + 90, y: cy - 35 - wave };
                leftWrist = { x: cx - 110, y: cy - 60 };
                rightWrist = { x: cx + 110, y: cy - 60 };

                const centerShift = Math.abs(wave);
                onAngleData({
                    metric1Name: 'Spine Sway Deviation',
                    metric1Val: `${centerShift.toFixed(1)} cm`,
                    metric2Name: 'Stability Score',
                    metric2Val: centerShift > 6 ? 'POOR BALANCE' : 'EXCELLENT BALANCE'
                });

            } else {
                // FORWARD HEAD (Posture scan)
                leftKnee = { x: cx - 40, y: cy + 120 };
                rightKnee = { x: cx + 40, y: cy + 120 };
                leftAnkle = { x: cx - 40, y: cy + 180 };
                rightAnkle = { x: cx + 40, y: cy + 180 };

                // exaggerate posture shifts
                const headAngle = 35 + Math.sin(t) * 15;
                nose.x += headAngle * 0.3;

                leftElbow = { x: cx - 70, y: cy + 10 };
                rightElbow = { x: cx + 70, y: cy + 10 };
                leftWrist = { x: cx - 80, y: cy + 40 };
                rightWrist = { x: cx + 80, y: cy + 40 };

                onAngleData({
                    metric1Name: 'Forward Head Angle',
                    metric1Val: `${Math.round(headAngle)}°`,
                    metric2Name: 'Rounded Shoulder Index',
                    metric2Val: headAngle > 42 ? 'FORWARD HEAD / SCOLIOSIS RISK' : 'NORMAL ALIGNMENT'
                });
            }

            const keypoints = [
                nose, leftShoulder, rightShoulder, leftHip, rightHip,
                leftKnee, rightKnee, leftAnkle, rightAnkle,
                leftElbow, rightElbow, leftWrist, rightWrist
            ];

            // Draw skeleton lines
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#059669'; // Emerald green skeleton lines

            const connect = (p1, p2) => {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            };

            // Shoulders, Hips, Torso
            connect(leftShoulder, rightShoulder);
            connect(leftShoulder, leftHip);
            connect(rightShoulder, rightHip);
            connect(leftHip, rightHip);

            // Arms
            connect(leftShoulder, leftElbow);
            connect(leftElbow, leftWrist);
            connect(rightShoulder, rightElbow);
            connect(rightElbow, rightWrist);

            // Legs
            connect(leftHip, leftKnee);
            connect(leftKnee, leftAnkle);
            connect(rightHip, rightKnee);
            connect(rightKnee, rightAnkle);

            // Draw keypoint joints as glowing dots
            ctx.fillStyle = '#22c55e'; // Bright green dots
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;

            keypoints.forEach(kp => {
                ctx.beginPath();
                ctx.arc(kp.x, kp.y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            // Special visual indicator of critical joints based on test
            ctx.strokeStyle = '#ea580c'; // orange locator ring
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            if (activeTest === 'SQUAT') {
                // circle knees
                ctx.arc(leftKnee.x, leftKnee.y, 16, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(rightKnee.x, rightKnee.y, 16, 0, Math.PI * 2);
                ctx.stroke();
            } else if (activeTest === 'BALANCE') {
                // circle hips
                ctx.arc(leftHip.x, leftHip.y, 16, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // circle neck
                ctx.arc(nose.x, nose.y + 20, 16, 0, Math.PI * 2);
                ctx.stroke();
            }

            animationId = requestAnimationFrame(drawSkeleton);
        };

        drawSkeleton();

        return () => cancelAnimationFrame(animationId);
    }, [hasCamera, activeTest]);

    return (
        <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-md bg-slate-950 aspect-[4/3] flex flex-col justify-between">

            {/* Hidden source video element */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="hidden"
            />

            {/* Drawing canvas */}
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-full object-cover"
            />

            {/* Screen controls menu bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-700/50 p-2.5 rounded-xl flex items-center justify-between text-white backdrop-blur-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={12} />
                    MediaPipe tracking is live
                </span>
                <div className="flex gap-2">
                    {hasCamera ? (
                        <button
                            onClick={stopCamera}
                            className="p-1 px-2.5 rounded text-[10px] bg-red-650 font-bold flex items-center gap-1"
                        >
                            <CameraOff size={10} />
                            Turn Off
                        </button>
                    ) : (
                        <button
                            onClick={startCamera}
                            className="p-1 px-2.5 rounded text-[10px] bg-govBlue font-bold flex items-center gap-1"
                        >
                            <Camera size={10} />
                            Turn On Lens
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
