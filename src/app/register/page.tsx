import { RegistrationForm } from '@/components/RegistrationForm';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Register | ആത്മഗീതം',
    description: 'Register for the Athmageeth cultural program.',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen relative py-12 px-4 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 max-w-4xl mx-auto mb-8">
                <Link href="/">
                    <Button variant="ghost" className="pl-0 gap-2 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <div className="container relative z-10">
                <RegistrationForm />
            </div>
        </div>
    );
}
