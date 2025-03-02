import { Suspense } from "react";
import { DharmaLibrary } from "@/components/features/dharma-library";
import { MantraCounter } from "@/components/features/mantra-counter";
import { MeditationTimer } from "@/components/features/meditation-timer";
import { MeritDedication } from "@/components/features/merit-dedication";
import { PracticeDashboard } from "@/components/features/practice-dashboard";
import { PracticeReminder } from "@/components/features/practice-reminder";
import { VirtualPrayerWheel } from "@/components/features/virtual-prayer-wheel";
import { VirtualTemple } from "@/components/features/virtual-temple";
import { Loader } from "@/components/common/loader";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function PracticePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Suspense fallback={<Loader />}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Practice Tools</h2>
            <div className="space-y-8">
              <MeditationTimer />
              <MantraCounter />
              <VirtualPrayerWheel />
            </div>
          </section>
        </Suspense>
        <Suspense fallback={<Loader />}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Progress Tracking</h2>
            <div className="space-y-8">
              <PracticeDashboard />
              <PracticeReminder />
            </div>
          </section>
        </Suspense>
        <Suspense fallback={<Loader />}>
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Dharma Resources</h2>
            <DharmaLibrary />
          </section>
        </Suspense>
        <Suspense fallback={<Loader />}>
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Community</h2>
            <MeritDedication />
          </section>
        </Suspense>
        <Suspense fallback={<Loader />}>
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Virtual Experience</h2>
            <VirtualTemple />
          </section>
        </Suspense>
      </div>
    </div>
  );
}
