'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

interface ChartModalProps {
  chartSVG: string;
  chartAltText: string;
  onClose: () => void;
}

export default function ChartModal({
  chartSVG,
  chartAltText,
  onClose,
}: ChartModalProps) {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Use ua-parser-js for reliable mobile device detection
    const parser = new UAParser();
    const result = parser.getResult();

    // Check if device is mobile or tablet
    const isMobile =
      result.device.type === 'mobile' || result.device.type === 'tablet';

    setIsMobileDevice(isMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus management
    const activeElement = document.activeElement as HTMLElement;
    const modalElement = document.querySelector(
      '[role="dialog"]'
    ) as HTMLElement;
    if (modalElement) {
      modalElement.focus();
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore focus
      if (activeElement) {
        activeElement.focus();
      }
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`modal-container relative max-h-[90vh] w-full animate-[modalSlideIn_0.3s_ease-out] overflow-y-auto rounded-3xl bg-white shadow-2xl ${isMobileDevice ? 'max-w-full' : 'max-w-5xl'}`}
        tabIndex={-1}
      >
        {/* Mobile rotation prompt */}
        {isMobileDevice && (
          <div className="from-dreamy-yellow to-dreamy-pink block bg-gradient-to-r p-4 text-center md:hidden landscape:hidden">
            <p className="text-sm font-bold text-gray-800">
              📱 Turn your phone sideways for the best chart view!
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-b-2 border-gray-200 p-6">
          <h2 id="modal-title" className="text-gradient text-2xl font-bold">
            How My Money Grew This Month
          </h2>
          <button
            className="cursor-pointer text-3xl font-bold text-gray-400 transition-colors duration-300 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close chart modal"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div id="modal-description" className="sr-only">
            {chartAltText}
          </div>
          <div className="flex items-center justify-center">
            {chartSVG ? (
              <div
                className={`${isMobileDevice ? 'w-full overflow-x-auto' : ''}`}
                dangerouslySetInnerHTML={{ __html: chartSVG }}
                role="img"
                aria-label={chartAltText}
              />
            ) : (
              <div className="flex h-96 items-center justify-center text-gray-500">
                Chart data unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
