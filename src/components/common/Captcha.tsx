import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw } from 'lucide-react';

export interface CaptchaHandle {
    validate: (input: string) => boolean;
    refresh: () => void;
}

export const Captcha = forwardRef<CaptchaHandle>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [code, setCode] = useState('');

    const generateCode = () => {
        const chars = '0123456789';
        let newCode = '';
        for (let i = 0; i < 4; i++) {
            newCode += chars[Math.floor(Math.random() * chars.length)];
        }
        setCode(newCode);
        drawCaptcha(newCode);
    };

    const drawCaptcha = (captchaCode: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#1d4ed8'; // Primary Blue
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Add noise (lines)
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = '#cbd5e1';
            ctx.stroke();
        }

        // Add noise (dots)
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fillStyle = '#94a3b8';
            ctx.fill();
        }

        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(captchaCode.split('').join(' '), canvas.width / 2, canvas.height / 2);
    };

    useImperativeHandle(ref, () => ({
        validate: (input: string) => input === code,
        refresh: generateCode
    }));

    useEffect(() => {
        generateCode();
    }, []);

    return (
        <div className="flex items-center gap-2">
            <canvas
                ref={canvasRef}
                width={120}
                height={40}
                className="border border-slate-300 rounded cursor-pointer"
                onClick={generateCode}
                title="點擊重新產生驗證碼"
            />
            <button
                type="button"
                onClick={generateCode}
                className="p-2 text-slate-500 hover:text-primary-700 transition-colors"
                title="重新整理"
            >
                <RefreshCw size={18} />
            </button>
        </div>
    );
});

Captcha.displayName = 'Captcha';
