'use client';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#1a0f0f] border border-amber-500/20 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 max-h-[90vh] overflow-y-auto ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-xl font-bold font-malayalam text-amber-200">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
}
