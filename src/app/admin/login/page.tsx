'use client';

import { useActionState } from 'react'; // React 19 hook
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-malayalam">Admin Login</CardTitle>
                    <CardDescription>Enter your secure password to access the dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="bg-background/50"
                            />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500 text-center font-medium">{state.error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            variant="gold"
                            disabled={isPending}
                        >
                            {isPending ? 'Authenticating...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
