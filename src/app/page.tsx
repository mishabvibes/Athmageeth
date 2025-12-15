import { Hero } from '@/components/Hero';
import { Prizes } from '@/components/Prizes';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Hero />
      <Prizes />

      {/* Footer or additional info could go here */}
      <footer className="w-full text-center py-8 text-sm text-muted-foreground/60">
        <p>&copy; 2025 Athmageeth. All rights reserved.</p>
      </footer>
    </main>
  );
}
