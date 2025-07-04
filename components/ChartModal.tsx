'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

interface ChartModalProps {
  chartSVG: string;
  onClose: () => void;
}

export default function ChartModal({ chartSVG, onClose }: ChartModalProps) {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const [originalOrientation, setOriginalOrientation] = useState<string | null>(null);

  useEffect(() => {
    // Use ua-parser-js for reliable mobile device detection
    const parser = new UAParser();
    const result = parser.getResult();
    
    // Check if device is mobile or tablet (both benefit from landscape orientation)
    const isMobile = result.device.type === 'mobile' || result.device.type === 'tablet';
    
    // Check if device can rotate (has orientation API with lock capability)
    const hasOrientationAPI = 'screen' in window && 'orientation' in window.screen;
    const canLockOrientation = hasOrientationAPI && 'lock' in window.screen.orientation;
    
    setIsMobileDevice(isMobile);
    setCanRotate(canLockOrientation);
  }, []);

  useEffect(() => {
    // Handle mobile landscape rotation only if we can actually rotate
    if (isMobileDevice && canRotate && 'screen' in window && 'orientation' in window.screen) {
      // Store original orientation
      setOriginalOrientation(window.screen.orientation.type);
      
      // Request landscape orientation
      window.screen.orientation.lock('landscape').catch(() => {
        console.log('Orientation lock failed - user may need to enable auto-rotate');
      });
    }

    // Cleanup function to restore original orientation
    return () => {
      if (isMobileDevice && canRotate && originalOrientation && 'screen' in window && 'orientation' in window.screen) {
        window.screen.orientation.unlock();
      }
    };
  }, [isMobileDevice, canRotate, originalOrientation]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`relative max-h-[90vh] w-full animate-[modalSlideIn_0.3s_ease-out] overflow-y-auto rounded-3xl bg-white shadow-2xl ${isMobileDevice ? 'max-w-full' : 'max-w-5xl'}`}>
        {/* Mobile rotation prompt - only show if mobile but can't auto-rotate */}
        {isMobileDevice && !canRotate && (
          <div className="block md:hidden landscape:hidden bg-gradient-to-r from-dreamy-yellow to-dreamy-pink p-4 text-center">
            <p className="text-sm font-bold text-gray-800">
              📱 Turn your phone sideways for the best chart view!
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between border-b-2 border-gray-200 p-6">
          <h2 className="text-gradient text-2xl font-bold">
            How My Money Grew This Month
          </h2>
          <button
            className="cursor-pointer text-3xl font-bold text-gray-400 transition-colors duration-300 hover:text-gray-800"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center">
            {chartSVG ? (
              <div 
                className={`${isMobileDevice ? 'w-full overflow-x-auto' : ''}`}
                dangerouslySetInnerHTML={{ __html: chartSVG }} 
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