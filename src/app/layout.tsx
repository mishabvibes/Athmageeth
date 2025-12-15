import type { Metadata } from 'next';
import { Inter, Baloo_Chettan_2 } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const baloo = Baloo_Chettan_2({
  subsets: ['malayalam'],
  variable: '--font-baloo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ആത്മഗീതം Registration',
  description: 'Official registration portal for Athmageeth cultural program.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${baloo.variable} antialiased bg-background text-foreground`}
      >
        <main className="min-h-screen flex flex-col">{children}</main>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
