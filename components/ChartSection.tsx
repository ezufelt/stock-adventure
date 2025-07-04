'use client';

import { useState } from 'react';
import ChartModal from './ChartModal';

interface ChartSectionProps {
  chartSVG: string;
  chartAltText: string;
}

export default function ChartSection({
  chartSVG,
  chartAltText,
}: ChartSectionProps) {
  const [showChartModal, setShowChartModal] = useState(false);

  return (
    <>
      <section className="border-dreamy-blue from-dreamy-blue magical-hover slide-up my-10 rounded-2xl border-4 bg-gradient-to-br to-blue-50 p-6">
        <h2 className="text-gradient mb-4 text-center text-2xl font-bold drop-shadow-lg md:mb-5 md:text-3xl">
          How My Money Grew This Month
        </h2>
        <div className="relative flex h-32 items-center justify-center">
          <button
            onClick={() => setShowChartModal(true)}
            className="border-dreamy-blue bg-dreamy-blue magical-hover rounded-full border-4 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            📊 Last 30 Days
          </button>
        </div>
      </section>

      {showChartModal && (
        <ChartModal
          chartSVG={chartSVG}
          chartAltText={chartAltText}
          onClose={() => setShowChartModal(false)}
        />
      )}
    </>
  );
}
