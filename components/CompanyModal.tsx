'use client';

import { useEffect } from 'react';
import { PortfolioStockData } from '../lib/stockData';

interface CompanyInfo {
  name: string;
  logo: string;
  description: string;
  funFacts: string[];
  whatTheyDo: string;
  whyInvest: string;
}

interface CompanyModalProps {
  symbol: string;
  company: CompanyInfo;
  stock: PortfolioStockData;
  onClose: () => void;
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CompanyModal({
  symbol,
  company,
  stock,
  onClose,
}: CompanyModalProps) {
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
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-5"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl animate-[modalSlideIn_0.3s_ease-out] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="border-gold flex items-center justify-between border-b-2 p-8 pb-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{company.logo}</span>
            <div>
              <h2 className="m-0 text-2xl font-bold text-gray-800">
                {company.name}
              </h2>
              <span className="bg-gold-light mt-1 inline-block rounded-lg px-3 py-1 font-bold text-gray-800">
                {symbol}
              </span>
            </div>
          </div>
          <button
            className="cursor-pointer text-3xl font-bold text-gray-400 transition-colors duration-300 hover:text-gray-800"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="font-comic p-8">
          <div className="mb-5">
            <h3 className="mb-3 text-xl text-pink-500">About {company.name}</h3>
            <p className="leading-relaxed text-gray-800">
              {company.description}
            </p>
          </div>

          <div className="mb-5">
            <h3 className="mb-3 text-xl text-pink-500">What They Do</h3>
            <p className="leading-relaxed text-gray-800">
              {company.whatTheyDo}
            </p>
          </div>

          <div className="mb-5">
            <h3 className="mb-3 text-xl text-pink-500">Why People Invest</h3>
            <p className="leading-relaxed text-gray-800">{company.whyInvest}</p>
          </div>

          <div className="mb-5">
            <h3 className="mb-3 text-xl text-pink-500">Fun Facts</h3>
            <ul className="list-none p-0">
              {company.funFacts.map((fact, index) => (
                <li
                  key={index}
                  className="bg-gold-light border-gold relative mb-2 rounded-lg border-l-4 p-3 pl-8 before:absolute before:top-3 before:left-2 before:content-['✨']"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <h3 className="mb-3 text-xl text-pink-500">Your Investment</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-lg text-gray-800">
                <span>Shares Owned:</span>
                <span className="font-bold">{stock.shares}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-800">
                <span>Purchase Price:</span>
                <span className="font-bold">
                  {formatCurrency(stock.purchasePrice)}
                </span>
              </div>
              <div className="flex justify-between text-lg text-gray-800">
                <span>Current Price:</span>
                <span className="font-bold">{formatCurrency(stock.price)}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-800">
                <span>Total Value:</span>
                <span className="font-bold">
                  {formatCurrency(stock.totalValue)}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-white p-3 text-lg font-bold">
                <span>Gain/Loss:</span>
                <span
                  className={`${(stock.gainLoss || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {(stock.gainLoss || 0) >= 0 ? '+' : ''}
                  {formatCurrency(stock.gainLoss)}(
                  {(stock.gainLossPercent || 0) >= 0 ? '+' : ''}
                  {stock.gainLossPercent?.toFixed(2) || '—'}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
