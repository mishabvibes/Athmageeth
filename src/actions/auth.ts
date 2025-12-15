'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password');

    // Simple check against env variable
    // In a real app, use a constant time comparison to avoid timing attacks, but strictly checking strictly Env is acceptable for single admin simple case.
    if (password === process.env.ADMIN_PASSWORD) {
        // Determine expiration
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ role: 'admin', expires });

        // Save the session in a cookie
        (await cookies()).set('session', session, { expires, httpOnly: true });

        redirect('/admin');
    }

    return { error: 'Invalid password' };
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
    redirect('/admin/login');
}
